# 0020. Build the to-do list in, as a backlog plus a short current list, in v1

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0021](./0021-two-clocks-and-optional-due-dates.md), [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md), [0023](./0023-deal-with-stale-tasks-before-adding.md), [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md), `docs/PRODUCT.md` (The to-do list)

## In plain English

Home Base has its own to-do list instead of syncing one from another app. It has two lists: a backlog of everything that needs doing, and a short current list of what Ryan is working on now. The daily screen shows the current list first. It ships in v1.

## Context

Covers the decision log row "To-do list: a backlog plus a short current list, built in, in v1," decided 2026-11-18. Ryan named the to-do list one of the most important parts of the app. It's also the one place he opted into some pressure ([0013](./0013-no-streaks-nudges-or-step-tracking.md)).

## Options considered

1. **Built in, backlog plus current list, v1.** The design follows Home Base's principles, and the app is useful daily from the start. Costs building a to-do app inside the dashboard.
2. **Sync with Todoist, Apple Reminders, or Google Tasks.** Less to build. Brings another app's red overdue badges and rules, plus an integration to maintain.
3. **One flat list.** Simpler. Doesn't separate "everything" from "today," so the list is either overwhelming or incomplete.
4. **Ship it after v1.** Faster v1. Ryan wouldn't open the app daily without it.

## Decision

Option 1. Tasks move from the backlog to the current list and back as often as Ryan likes. The detailed rules are in [0021](./0021-two-clocks-and-optional-due-dates.md) to [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md).

## Consequences

- **Good:** A reason to open Home Base every morning from v1.
- **Bad:** v1 is bigger than "log a session, see the grid." The to-do list is most of the v1 work.
- **Bad:** The list has several distinct states (past the cap, stale, due, old). They need a visual system so none is mistaken for another ([0025](./0025-task-states-three-shapes-three-meanings.md)).
- **Follow-ups:** the visual system for task states, decided in [0025](./0025-task-states-three-shapes-three-meanings.md).
