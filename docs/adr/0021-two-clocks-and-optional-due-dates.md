# 0021. Count backlog age from creation, reset time on the current list on re-entry, and keep due dates optional and separate

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0020](./0020-built-in-to-do-list-backlog-and-current-list.md), [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md), [0010](./0010-store-each-sessions-local-date-and-utc-time.md)

## In plain English

Every task has two clocks. **Age** counts days since the task was created and never resets, so the backlog always tells the truth about how old something is. **Time on the current list** counts days since the task last moved onto the current list, and starts over each time it does. Due dates are a third, separate thing: optional, off by default, and styled so a deadline is never mistaken for a pressure number.

## Context

Covers four decision log rows from 2026-11-18: "Backlog shows task age, counted from creation," "Time on the current list resets on re-entry; backlog age never resets," "Due dates are optional, off by default, and styled differently from pressure dates," and the age part of "Backlog tasks get an extra nudge at 10+ days" (the nudge itself is [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md)).

Ryan wants gentle pressure on tasks that sit around. If age reset whenever a task moved, bouncing it between lists would hide how old it is.

| | Age | Time on current list | Due date |
| --- | --- | --- | --- |
| What it is | Days since created | Days since last entering the current list | A deadline Ryan sets |
| Default | Every task | Every task on the current list | Off |
| Shows on | Backlog | Current list, from 2 days | Anywhere |
| Resets? | Never | On each re-entry | Only if Ryan changes it |

## Options considered

1. **Two clocks plus optional due dates, each styled differently.** Each number means one thing. Costs a visual system that keeps three kinds of date apart.
2. **One clock for both lists.** Simpler. Either moving a task hides its age, or a fresh pick from the backlog arrives already stale.
3. **Time spent in the backlog only.** Measures neglect. Resets when a task visits the current list, so it can be gamed.
4. **Due dates on every task.** Familiar. Most tasks have no real deadline, and invented ones turn into noise.

## Decision

Option 1. A task stores `createdAt` and `enteredCurrentListAt` (cleared when it leaves). Due dates are a nullable column. Day counts use the user's time zone ([0010](./0010-store-each-sessions-local-date-and-utc-time.md)).

## Consequences

- **Good:** Backlog age is honest, and current-list time measures what it says.
- **Bad:** A small loophole by design: moving a stale task to the backlog and back resets its current-list clock. Moving it back is a real reprioritizing decision, and backlog age still tells the truth.
- **Follow-ups:** the visual system for task states, decided in [0025](./0025-task-states-three-shapes-three-meanings.md).
