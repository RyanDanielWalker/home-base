# 0036. "Keep, I'm on it" quiets a stale task's prompt until tomorrow, and the label keeps counting

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (P1), [0023](./0023-deal-with-stale-tasks-before-adding.md) (closes its follow-up), [0021](./0021-two-clocks-and-optional-due-dates.md), [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md)

## In plain English

When Ryan adds a task while something on the current list is stale, Home Base first asks about each stale task: done, back to the backlog, or "keep, I'm on it." Tapping keep means that task won't be asked about again until tomorrow. Its "on the list 4 days" label stays and keeps counting, because the label is a fact.

## Context

[0023](./0023-deal-with-stale-tasks-before-adding.md) created the "deal with it first" step and left one question: does "keep" change anything? Without an answer, adding three tasks in one morning would ask about the same stale task three times.

A task is **stale** when it has been on the current list for 2 or more calendar days ([0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md), [0039](./0039-small-v1-product-calls.md)).

## Options considered

1. **Keep quiets the prompt for that task until tomorrow; the label stays.** One question per stale task per day. Nothing about the task's real history is hidden.
2. **Keep changes nothing.** Every add asks again. Honest, and quickly turns into tapping through.
3. **Keep resets the current-list clock.** The label disappears. Hides how long the task has really been there, which [0021](./0021-two-clocks-and-optional-due-dates.md) exists to prevent.

## Decision

Option 1, chosen by Ryan on 2026-11-18. The task stores `staleKeptOn`, the local date (in Ryan's time zone) that keep was tapped. The prompt skips tasks whose `staleKeptOn` is today.

## Consequences

- **Good:** The prompt stays a real question instead of a ritual.
- **Bad:** [0023](./0023-deal-with-stale-tasks-before-adding.md)'s risk remains: tapping keep every morning can become its own autopilot. If that happens, it's worth revisiting, not tightening into a block.
- **Follow-ups:** none.
