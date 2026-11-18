# 0016. Split a two-activity day's square diagonally

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0014](./0014-movement-grid-families-and-activity-types.md), `docs/PRODUCT.md` (The movement grid)

## In plain English

On a day with two kinds of movement, like a walk and a strength session, the square is cut corner to corner, half in each color. On the rare three-activity day, the square shows two and the details list the rest.

## Context

Covers the decision log row "Two-activity days split the square diagonally," decided 2026-11-18. Squares are small, often around 12 pixels, so whatever represents two activities has to read at that size.

## Options considered

1. **Diagonal split.** Both colors visible. Reads well small.
2. **Show only the longest session.** Simple. Hides a family, which defeats the point of color ([0014](./0014-movement-grid-families-and-activity-types.md)), and there's no duration to compare ([0015](./0015-a-session-happened-or-it-didnt.md)).
3. **Dots inside the square.** Shows any number. Unreadable at small sizes.

## Decision

Option 1. Which two show on a three-activity day is decided in the v1 build plan; the details list every session regardless.

## Consequences

- **Good:** Variety stays visible.
- **Bad:** Two colors in a tiny square need enough contrast between every pair of families. The palette has to be checked pairwise, not just against the background.
- **Follow-ups:** none.
