# 0037. "Keep" moves a task out of "Getting old" for 7 days

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (P2), [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md) (closes its follow-up), [0021](./0021-two-clocks-and-optional-due-dates.md)

## In plain English

Backlog tasks 10 or more days old sit in a "Getting old" group at the top of the backlog with move, keep, and delete buttons. Tapping keep sends the task back to the normal backlog for 7 days. Its age label keeps counting. If it's still in the backlog after 7 days, it floats back up.

## Context

[0024](./0024-getting-old-group-at-the-top-of-the-backlog.md) noted that if keep changes nothing, the task is back in the group on the next visit, and left the choice to the build plan.

## Options considered

1. **Out of the group for 7 days.** The group only holds tasks that need a decision now, and a kept task is asked about again a week later.
2. **Out of the group for good**, until the task moves. The group stays meaningful, but a kept task is never asked about again however old it gets.
3. **Nothing changes.** The group fills with tasks Ryan already said yes to, and stops meaning anything.

## Decision

Option 1, with 7 days, chosen by Ryan on 2026-11-18. The task stores `oldKeptUntil`, a local date 7 days after keep was tapped. A task is in the group when it's in the backlog, 10 or more days old, and `oldKeptUntil` is empty or has passed. Moving a task to the current list clears `oldKeptUntil`.

## Consequences

- **Good:** The group holds what needs deciding now.
- **Bad:** 7 days is a guess. If kept tasks come back too often or too rarely, it's a one-number change.
- **Follow-ups:** none.
