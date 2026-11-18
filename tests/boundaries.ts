import { readdirSync, readFileSync } from "node:fs";
import { join, relative, sep } from "node:path";

export interface SourceFile {
  path: string; // repo-relative, forward slashes
  source: string;
}
export interface PackageManifest {
  path: string; // repo-relative path of package.json, forward slashes
  dependencies: string[];
}
export interface Rule {
  prefix: string; // applies to paths starting with this
  forbid?: RegExp[]; // forbidden import specifiers / dependency names
  relativeOnly?: boolean; // only "./" or "../" imports and zero dependencies allowed
  message: string;
}
export interface Violation {
  file: string;
  what: string;
  message: string;
}

const IMPORT_RE =
  /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)|require\(\s*['"]([^'"]+)['"]\s*\)/g;

export function extractSpecifiers(source: string): string[] {
  const found: string[] = [];
  for (const m of source.matchAll(IMPORT_RE)) {
    const spec = m[1] ?? m[2] ?? m[3] ?? m[4];
    if (spec !== undefined) found.push(spec);
  }
  return found;
}

// Only packages/deriv-client may talk to Deriv directly.
const DIRECT_DERIV = /derivws\.com|binaryws\.com|new\s+WebSocket\s*\(/;
const DERIV_ALLOWED_PREFIXES = ["packages/deriv-client/", "tests/"];

export const RULES: Rule[] = [
  {
    prefix: "apps/web/",
    forbid: [/^@zerotrader\/deriv-client/, /^(drizzle-orm|pg|postgres|fastify)(\/|$)/],
    message: "web must never import deriv-client, the database layer or the API framework",
  },
  {
    prefix: "packages/analysis/",
    relativeOnly: true,
    message: "analysis must be pure: relative imports only, no dependencies, no I/O",
  },
  {
    prefix: "packages/risk/",
    forbid: [/^@zerotrader\/deriv-client/, /^(react|next)(\/|$)/],
    message: "risk must not talk to Deriv or depend on UI frameworks",
  },
  {
    prefix: "packages/ui/",
    forbid: [/^@zerotrader\/deriv-client/, /^(fastify|drizzle-orm|pg|postgres)(\/|$)/],
    message: "ui must not import deriv-client or server-side packages",
  },
  {
    prefix: "packages/deriv-client/",
    forbid: [/^@zerotrader\/(web|api|ui|risk)/, /^(react|next)(\/|$)/],
    message: "deriv-client must stay independent of apps, ui, risk and UI frameworks",
  },
  {
    prefix: "packages/config/",
    forbid: [/^@zerotrader\//],
    message: "config is a leaf package and must not import other workspace packages",
  },
];

export function findViolations(
  files: SourceFile[],
  manifests: PackageManifest[],
  rules: Rule[] = RULES,
): Violation[] {
  const out: Violation[] = [];
  for (const rule of rules) {
    for (const f of files.filter((x) => x.path.startsWith(rule.prefix))) {
      for (const spec of extractSpecifiers(f.source)) {
        const relative = spec.startsWith("./") || spec.startsWith("../");
        const isTestFile = /\.test\.[cm]?[jt]sx?$/.test(f.path);
        const allowedInTests = isTestFile && spec === "vitest";
        const bad =
          !allowedInTests &&
          ((rule.relativeOnly === true && !relative) ||
            (rule.forbid ?? []).some((re) => re.test(spec)));
        if (bad) out.push({ file: f.path, what: `import "${spec}"`, message: rule.message });
      }
    }
    for (const m of manifests.filter((x) => x.path.startsWith(rule.prefix))) {
      for (const dep of m.dependencies) {
        const bad = rule.relativeOnly === true || (rule.forbid ?? []).some((re) => re.test(dep));
        if (bad) out.push({ file: m.path, what: `dependency "${dep}"`, message: rule.message });
      }
    }
  }
  for (const f of files) {
    if (DERIV_ALLOWED_PREFIXES.some((p) => f.path.startsWith(p))) continue;
    if (DIRECT_DERIV.test(f.source)) {
      out.push({
        file: f.path,
        what: "direct Deriv/WebSocket access",
        message: "only packages/deriv-client may communicate with Deriv",
      });
    }
  }
  return out;
}

// ---- filesystem loading (used by the real-repository test) ----
const SKIP = new Set(["node_modules", "dist", ".next", "coverage", ".git"]);

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

export function loadRepo(root: string): { files: SourceFile[]; manifests: PackageManifest[] } {
  const files: SourceFile[] = [];
  const manifests: PackageManifest[] = [];
  for (const area of ["apps", "packages"]) {
    for (const full of walk(join(root, area))) {
      const rel = relative(root, full).split(sep).join("/");
      if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(rel)) {
        files.push({ path: rel, source: readFileSync(full, "utf8") });
      } else if (rel.endsWith("/package.json")) {
        const json = JSON.parse(readFileSync(full, "utf8")) as {
          dependencies?: Record<string, string>;
          devDependencies?: Record<string, string>;
        };
        manifests.push({
          path: rel,
          dependencies: [
            ...Object.keys(json.dependencies ?? {}),
            ...Object.keys(json.devDependencies ?? {}),
          ],
        });
      }
    }
  }
  return { files, manifests };
}
