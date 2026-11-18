# ADR-0001: TypeScript modular monolith on the approved stack
Status: ACCEPTED (owner approved 2026-11-18)
## Decision
Build from scratch on the stack in the original directive: TypeScript (strict), Node.js 24 LTS (to be VERIFIED in M1),
pnpm workspaces, Next.js App Router, Fastify, PostgreSQL + Drizzle, Zod, native WebSocket, Lightweight Charts, Vitest,
Playwright, ESLint/Prettier/Husky, GitHub Actions, Docker. No microservices.
## Existing "Tickdesk" JavaScript project
Not migrated. Used only as a reference. Its 93 offline tests (verified passing in M0) are treated as a
specification: statistical and Deriv-message behaviour will be re-implemented in TypeScript and re-tested with
independently derived expected values, not copied blindly.
## Boundaries (enforced by lint/tests in M1)
web never imports deriv-client; analysis has no I/O; only deriv-client talks to Deriv.
