# ADR-0004: What we take from Kadima and what we reject

Status: ACCEPTED (owner approved 2026-11-18). Source: text of https://digits.kadimatraders.com/ read on 2026-11-17. Authenticated screens,
visual design and runtime behaviour were NOT inspected (UNKNOWN).

## Adopt (UX ideas)

Separate Trade / Analysis / Transactions / Settings views; live P/L and win-rate header; session log; resume-or-new
session prompt; "bot stopped" reason dialogs; connection lost/reconnecting banner; take-profit and stop-loss;
market picker incl. 1s volatility indices and Jumps (only what the live API actually returns).

## Reject (conflicts with our principles)

Martingale, recovery mode, recovery martingale, hedge-after-loss, "do martingale after N losses", and unexplained
"AI predictions/confidence" shown as guidance. These are loss-escalation or unfounded-prediction features.

## Differentiate

Show break-even win rate, pricing margin, sample size and confidence beside every result; say "no meaningful
pattern" when true.
