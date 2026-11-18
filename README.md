# Zerotrader

Independent market-intelligence workspace for Deriv. Pipeline: Observe, Analyse, Decide, Risk check,
Execute, Monitor, Learn. **Status: M1 (tooling skeleton). No product features exist yet.**
Execution is designed but locked behind the P6 gate (ADR-0003). No profit is promised or implied.

## Start in five commands

Prerequisites: Node 24, Git, Docker with the compose plugin, and `corepack enable` (once).

```bash
pnpm install                 # 1. install tools and link the workspace packages
cp .env.example .env         # 2. then edit .env: set POSTGRES_PASSWORD to a long random value
docker compose up -d         # 3. start the local database (host port 5433)
pnpm check                   # 4. format check + lint + typecheck + tests
docker compose ps            # 5. confirm the database shows "healthy"
```

Never commit `.env`. See `docs/` for architecture, security status, testing and contributing.
