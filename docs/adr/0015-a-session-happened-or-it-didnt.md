# 0015. Record that a session happened, not how much, and use one flat color per family

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0014](./0014-movement-grid-families-and-activity-types.md), `docs/PRODUCT.md` (The movement grid)

## In plain English

A session either happened or it didn't. There's no duration, distance, or effort level. Every square in a family gets the same color, so a yin yoga class and a flow class look identical on the grid. The subtype still shows when you hover or tap a square.

## Context

Covers three decision log rows from 2026-11-18: "No 'how much' unit," "Flat colors per family, no shading," and the superseded "Shade means how much, not subtype."

GitHub's contribution graph shades squares by count: pale means a little, deep means a lot. The first plan copied that, with shade meaning "how much." Then the group decided there's no "how much" to measure: yoga only counts for classes, which run about an hour, walks are about doing it rather than distance, and strength is the only activity with numbers worth tracking, which live in the strength log (v2). With no amount, shading by subtype came up instead (yin pale, flow deep), and was turned down because in a GitHub-style grid, pale reads as "less." A yin class would look like a weaker day.

That sequence happened in one conversation, before this repo existed, so it's recorded here as one ADR rather than one ADR superseding another.

## Options considered

1. **No unit, flat colors per family.** Fastest logging. The grid is about which families show up.
2. **Shade by how much** (duration presets, effort levels, or walk distance). Familiar from GitHub. Slower logging, and there's nothing Ryan wants to measure.
3. **Shade by subtype.** More detail on the grid. Pale reads as "less," which misrepresents a perfectly good day.

## Decision

Option 1. Subtypes show on hover and tap, in the v2 breakdown chart, and in the "last done" line. The color logic lives in one function, so this is cheap to change.

## Consequences

- **Good:** Logging is pick a type, done.
- **Good:** No square ever looks like a worse version of another.
- **Bad:** The grid can't show a heavy week against a light one. That's deliberate.
- **Follow-ups:** none.
