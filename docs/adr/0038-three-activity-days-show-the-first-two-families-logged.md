# 0038. A three-activity day's square shows the first two families logged

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (P3), [0016](./0016-split-two-activity-days-diagonally.md) (closes its open question), [0014](./0014-movement-grid-families-and-activity-types.md), [0015](./0015-a-session-happened-or-it-didnt.md)

## In plain English

A grid square splits by family, not by session: two walks on one day is one green square. On the rare day with three or more families, the square shows the first two families logged that day, and the details list everything.

## Context

[0016](./0016-split-two-activity-days-diagonally.md) splits a two-family day's square diagonally and left one question to the build plan: which two show when there are three. Every session is always listed in the square's details (hover, tap, screen readers), so this only decides the picture.

## Options considered

1. **The first two families logged that day**, ordered by `loggedAt`. Stable: logging a third thing never changes what the square already showed. Simple to explain.
2. **A fixed priority order**, say strength first. Predictable, but quietly ranks some kinds of movement above others, which the grid otherwise never does.
3. **The two families done least recently.** Clever. Old squares would change as new days are logged, so the grid stops being a record.

## Decision

Option 1, chosen by Ryan on 2026-11-18. Families are deduplicated before picking. The rest/sick family only shows when the day has no movement ([0039](./0039-small-v1-product-calls.md)).

## Consequences

- **Good:** A square never changes once its first two families are in.
- **Bad:** A day's third family is invisible at a glance. On a day that varied, that's a small loss, and the details show it.
- **Follow-ups:** none.
