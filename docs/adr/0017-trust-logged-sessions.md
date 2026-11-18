# 0017. Count every logged session, and trust the user

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0013](./0013-no-streaks-nudges-or-step-tracking.md), `docs/PRODUCT.md` (Design principles 4 and 8)

## In plain English

If Ryan logs a session, it counts. The app doesn't check durations, read step counts, or import activities from a watch. Ryan knows what an intentional session is; the app believes him.

## Context

Covers the decision log row "A logged session counts; the app trusts the user," decided 2026-11-18, and design principles 4 ("Trust the user") and 8 ("Logging takes seconds").

Ryan's working definition of an intentional walk, for example, is about intent and preparation, not a number the app could measure. Getting around the city doesn't count. Rules like that are easy for a person and hard for software.

## Options considered

1. **Trust the log.** No detection code. Logging is fast. The grid is as honest as the person using it.
2. **Minimum durations enforced by the app.** Feels rigorous. Contradicts "no how much" ([0015](./0015-a-session-happened-or-it-didnt.md)) and slows logging.
3. **Step-based or wearable detection.** Automatic. Adds integrations, second-guessing, and the step tracking ruled out in [0013](./0013-no-streaks-nudges-or-step-tracking.md).

## Decision

Option 1.

## Consequences

- **Good:** Logging stays a couple of taps.
- **Bad:** Nothing stops a generous log. For a personal app that's fine; if Home Base ever had users comparing grids, it wouldn't be.
- **Follow-ups:** none.
