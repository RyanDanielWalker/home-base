# 0013. No streak counters, relationship nudges, or step tracking

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** `docs/PRODUCT.md` (Design principles, Out of scope), [0017](./0017-trust-logged-sessions.md)

## In plain English

Home Base never counts streaks, never reminds you to contact people, and never counts steps. Each of those adds a new way to fail, and failing is what makes people quit a habit. A missed day is just an empty square.

## Context

Covers the decision log row "No streaks, no relationship nudges, no step tracking," decided 2026-11-18, and the first design principle, "No new ways to fail."

Ryan works best with visible progress: GitHub's contribution graph and Duolingo kept him coming back. Streaks are the obvious tool, but a broken streak turns progress into a loss, and the app becomes something to avoid. The design principles in `docs/PRODUCT.md` exist to stop that.

The one exception is deliberate: the to-do list, where Ryan opted into some pressure ([0020](./0020-built-in-to-do-list-backlog-and-current-list.md)). The movement grid never gets any.

## Options considered

1. **None of the three.** The grid is the reward. Nothing else keeps score.
2. **Duolingo-style streaks with "freezes."** Proven engagement. Still a counter that resets, and freezes are a second thing to manage.
3. **Contact reminders.** Helps keep in touch. Social deadlines add stress, which works against the point.

## Decision

Option 1. Out of scope on purpose, not postponed: streak counters of any kind (including gentle ones), relationship nudges and social deadlines, step counting and automatic activity imports.

## Consequences

- **Good:** The app can't make a bad week worse.
- **Bad:** No built-in "keep going" pull beyond the grid itself. If the grid isn't enough motivation, that's a design question, not a reason to add a streak.
- **Follow-ups:** every feature gets checked against the principles in `docs/PRODUCT.md`.
