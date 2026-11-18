import { describe, expect, it } from "vitest";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { extractSpecifiers, findViolations, loadRepo } from "./boundaries";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

describe("boundary checker detects violations (it must be able to fail)", () => {
  it("extracts static, side-effect, dynamic and require specifiers", () => {
    const src = `
      import a from "x";
      import { b } from '@scope/y';
      import "side-effect";
      export * from "./z";
      const c = await import("dyn");
      const d = require("cjs");
    `;
    expect(extractSpecifiers(src)).toEqual(["x", "@scope/y", "side-effect", "./z", "dyn", "cjs"]);
  });

  it("flags web importing deriv-client", () => {
    const v = findViolations(
      [{ path: "apps/web/src/a.ts", source: 'import { x } from "@zerotrader/deriv-client";' }],
      [],
    );
    expect(v).toHaveLength(1);
    expect(v[0]?.file).toBe("apps/web/src/a.ts");
  });

  it("flags web depending on a database package", () => {
    const v = findViolations(
      [],
      [{ path: "apps/web/package.json", dependencies: ["drizzle-orm"] }],
    );
    expect(v).toHaveLength(1);
  });

  it("flags non-relative imports and any dependency in analysis", () => {
    const files = [
      { path: "packages/analysis/src/a.ts", source: 'import fs from "node:fs";' },
      { path: "packages/analysis/src/b.ts", source: 'import { ok } from "./c";' },
    ];
    const v = findViolations(files, [
      { path: "packages/analysis/package.json", dependencies: ["lodash"] },
    ]);
    expect(v.map((x) => x.what).sort()).toEqual(['dependency "lodash"', 'import "node:fs"']);
  });

  it("allows vitest in analysis test files only", () => {
    const src = 'import { it } from "vitest";';
    expect(findViolations([{ path: "packages/analysis/src/a.test.ts", source: src }], [])).toEqual(
      [],
    );
    expect(findViolations([{ path: "packages/analysis/src/a.ts", source: src }], [])).toHaveLength(
      1,
    );
  });

  it("flags direct Deriv access outside deriv-client but allows it inside", () => {
    const code = 'const s = new WebSocket("wss://api.derivws.com/x");';
    expect(findViolations([{ path: "apps/api/src/a.ts", source: code }], [])).toHaveLength(1);
    expect(
      findViolations([{ path: "packages/deriv-client/src/a.ts", source: code }], []),
    ).toHaveLength(0);
  });

  it("does not flag allowed imports", () => {
    const v = findViolations(
      [{ path: "apps/web/src/a.ts", source: 'import { ui } from "@zerotrader/ui"; import "./x";' }],
      [],
    );
    expect(v).toEqual([]);
  });
});

describe("real repository obeys package boundaries", () => {
  it("has no boundary violations", () => {
    const { files, manifests } = loadRepo(root);
    expect(files.length).toBeGreaterThan(0);
    expect(manifests.length).toBeGreaterThan(0);
    expect(findViolations(files, manifests)).toEqual([]);
  });
});
