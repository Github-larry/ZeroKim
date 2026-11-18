# ADR-0003: Trade execution is in scope, gated, demo-first

Status: ACCEPTED (owner approved 2026-11-18). Amends the original directive, which listed live execution as out of scope. The owner has asked
for execution capability; this ADR records that and keeps the original P6 gate.

## Decision

Pipeline: Observe -> Analyse -> Decide -> Risk check -> Execute -> Monitor -> Learn.
Execution is built behind one interface (ExecutionPort). Until the P6 gate is passed the ONLY implementation is
PracticeExecutor (simulated fills using real quoted payouts). No Deriv trading code is written before the gate.

## P6 gate (all required, unchanged)

Verified authenticated Deriv flow; written Deriv confirmation for this use; legal advice; independent security review;
owner's written approval; demo account first.

## Hard prohibitions (enforced in code and tests, not configurable)

- No martingale, stake doubling, recovery mode, loss-chasing or "hedge flip after loss".
- Fixed stake only. Limits (stake, daily loss, consecutive losses, open trades, cooldown) live in the risk gate.
- Limit INCREASES take effect only after a cooling-off delay; decreases are immediate. Kill switch always available.
- Risk gate fails closed: no data, stale feed, DB error, or unknown state = no trade.
- Idempotency key per order; reconciliation after restart; secrets never in the browser.

## No "AI prediction"

Signals are rule outputs with sample sizes and confidence ranges, compared against a random-guessing control.
