# 0024. Float backlog tasks 10+ days old into a "getting old" group

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0021](./0021-two-clocks-and-optional-due-dates.md), [0013](./0013-no-streaks-nudges-or-step-tracking.md)

## In plain English

Backlog tasks 10 or more days old move into a "getting old" group at the top of the backlog, with quick buttons: move to current list, keep, or delete. It's visible whenever Ryan looks at the backlog and never pops up on its own.

## Context

Covers the decision log rows "Backlog tasks get an extra nudge at 10+ days" and "Backlog 10+ days: a 'getting old' group at the top with move, keep, or delete buttons," decided 2026-11-18. A long-ignored task should eventually force a decision, without the app nagging.

## Options considered

1. **A "getting old" group at the top of the backlog.** Always visible in context, never interrupts.
2. **A weekly review prompt.** Thorough. A scheduled nag, which fights the first design principle ([0013](./0013-no-streaks-nudges-or-step-tracking.md)).
3. **Age display only.** No extra UI. Old tasks sink without a decision.

## Decision

Option 1. Age counts from creation ([0021](./0021-two-clocks-and-optional-due-dates.md)).

## Consequences

- **Good:** Old tasks get a decision when Ryan is already looking at the backlog.
- **Bad:** "Keep" puts the task straight back in the group on the next visit unless it changes something. The build plan decides whether "keep" snoozes it.
- **Follow-ups:** decide what "keep" does, in the v1 build plan.
