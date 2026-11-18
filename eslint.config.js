import js from "@eslint/js";
import tseslint from "typescript-eslint";

const BOUNDARY = "Package boundary violation (see docs/ARCHITECTURE.md).";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/coverage/**",
      "pnpm-lock.yaml",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  { files: ["**/*.js"], ...tseslint.configs.disableTypeChecked },
  // apps/web must never reach Deriv or the database directly.
  {
    files: ["apps/web/**/*.ts", "apps/web/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            { regex: "^@zerotrader/deriv-client", message: BOUNDARY },
            { regex: "^(drizzle-orm|pg|postgres|fastify)(/|$)", message: BOUNDARY },
          ],
        },
      ],
    },
  },
  // packages/analysis is pure: relative imports only (no node:, no libraries, no I/O).
  {
    files: ["packages/analysis/**/*.ts"],
    ignores: ["**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: "^(?!\\.)", message: `${BOUNDARY} analysis is pure.` }] },
      ],
    },
  },
  // ...except that its test files may also import the test runner.
  {
    files: ["packages/analysis/**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: "^(?!\\.|vitest$)", message: `${BOUNDARY} analysis is pure.` }] },
      ],
    },
  },
  // risk, ui: never talk to Deriv.
  {
    files: ["packages/risk/**/*.ts", "packages/ui/**/*.ts", "packages/ui/**/*.tsx"],
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: [{ regex: "^@zerotrader/deriv-client", message: BOUNDARY }] },
      ],
    },
  },
);
