# Proposed M1: monorepo, tooling and CI (not started)

Prereq on owner's machine: Node 24 LTS (verify), pnpm, Git, Docker Desktop, a GitHub repo.

1. git init, .gitignore, .editorconfig, pnpm-workspace.yaml, root package.json, tsconfig.base (strict).
2. Create apps/web, apps/api, packages/{deriv-client,analysis,risk,ui,config} as empty typed packages.
3. ESLint (+ boundary rules), Prettier, Husky pre-commit, Vitest per package, commitlint (conventional commits).
4. Boundary test: web !-> deriv-client; analysis has no I/O imports.
5. docker-compose.yml with Postgres (local only); .env.example with placeholders only.
6. GitHub Actions: install, lint, typecheck, test, audit, dependency review, secret scan.
7. Docs skeleton; README with the five-command start.
   Acceptance: all commands pass on the owner's machine and in CI, output pasted back. No features yet.
