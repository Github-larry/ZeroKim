# ADR-0005: Data retention
Status: PROPOSED
Raw tick history is never written to disk or PostgreSQL (bounded in-memory buffers only).
Persisted: user, sessions, MFA, audit events (hashed IP), preferences, and - from the Strategy Lab onward - the
owner's own rule definitions, signals, simulated/real trade records and risk events, because the Learn step needs them.
Each table has a documented retention limit.
