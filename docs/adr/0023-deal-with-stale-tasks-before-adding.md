# 0023. Show stale tasks first when adding a task to the current list

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md)

## In plain English

While any task on the current list is stale, tapping "add" first shows those stale tasks with three buttons each: done, back to backlog, or "keep, I'm on it." One tap per task, then the add form opens. It's friction, not a wall.

## Context

Covers the decision log row "Add friction while a task is stale: deal with stale tasks first," decided 2026-11-18. The goal is to deal with a stalled task, finished or moved back, before more work piles on.

## Options considered

1. **Deal with it first: one tap per stale task, then add.** A real decision each time. "Keep" means nothing is ever blocked.
2. **An "Add anyway?" confirmation.** Less to build. People click through dialogs on autopilot, so it changes nothing.
3. **No friction.** Calmest. Stale tasks get ignored.

## Decision

Option 1.

## Consequences

- **Good:** Every add is a small checkpoint for what's stuck.
- **Bad:** "Keep, I'm on it" every morning could turn into its own autopilot. If that happens in practice, it's worth revisiting, not tightening into a block.
- **Follow-ups:** decide in the build plan whether "keep" changes anything (for example, hiding the stale label for a day). The decision log doesn't say.
