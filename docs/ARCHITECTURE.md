# Architecture

TypeScript modular monolith (ADR-0001). One repository, strict package boundaries.

| Package               | Responsibility                                   | Must NOT                               |
| --------------------- | ------------------------------------------------ | -------------------------------------- |
| apps/web              | UI                                               | import deriv-client, database, fastify |
| apps/api              | HTTP API, auth, WebSocket fan-out, orchestration | talk to Deriv except via deriv-client  |
| packages/deriv-client | Only code allowed to talk to Deriv               | import apps, ui, risk                  |
| packages/analysis     | Pure statistics and indicators                   | any non-relative import, any I/O       |
| packages/risk         | Fail-closed risk gate (ADR-0003)                 | import deriv-client                    |
| packages/ui           | Design system                                    | import deriv-client or server packages |
| packages/config       | Typed configuration                              | import other workspace packages        |

Enforcement: ESLint `no-restricted-imports` plus `tests/boundaries.test.ts`, which also proves the checker can fail.
Status: M1 contains empty packages only. Decisions are in `docs/adr/`.
