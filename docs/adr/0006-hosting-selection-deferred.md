# ADR-0006: Hosting provider selection deferred

Status: ACCEPTED as deferred (owner approved 2026-11-18); provider choice still OPEN
No provider chosen. Before recommending one (M11) we verify current pricing, WebSocket and long-running process
support, managed Postgres backups, regions, TLS, and limits. Web and API must share a registrable domain
(SameSite=Strict cookies + WebSocket). Local Docker Compose is the only environment until M11.
