# ADR-0002: Single-owner deployment now, multi-user later
Status: ACCEPTED (owner approved 2026-11-18)
## Decision
Phase 1 serves exactly one owner. No public registration, no invitation UI, no billing, no marketing-first site.
The owner account is created by a one-time protected CLI command.
## Kept (security is not reduced for one user)
Argon2id/scrypt password, server-side sessions, TOTP MFA, CSRF, host allow-list, rate limits, audit log.
## Designed for scaling later
Every per-user table carries user_id from day one; every query is scoped by it; ownership tests are written even
though only one user exists. Adding invitations later is then additive, not a rewrite.
## Consequence
Public-product blockers (Terms, Privacy, Deriv data-redistribution permission) are re-assessed by a lawyer for personal
use; they are NOT assumed away.
