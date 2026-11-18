# 0039. Small v1 product calls: calendar days, rest as a family, defaults, and done tasks

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (P4), [0010](./0010-store-each-sessions-local-date-and-utc-time.md), [0011](./0011-single-user-multi-user-ready.md), [0014](./0014-movement-grid-families-and-activity-types.md), [0021](./0021-two-clocks-and-optional-due-dates.md), [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md), [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md)

## In plain English

Eight smaller decisions that each change how v1 behaves, recorded together because none needs a page of its own. Each was recommended in the build plan and accepted by Ryan on 2026-11-18.

## Context

Writing the build plan turned up questions the earlier ADRs didn't answer. None is a big fork, but each would otherwise be decided silently in code.

## Decision

1. **Day counts are calendar days in the user's time zone, not 24-hour periods.** A task created at 11pm is "1 day old" the next morning, and "new today" means created today. The same rule drives stale (2+ days on the current list, [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md)) and "Getting old" (10+ days, [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md)). *Turned down:* 24-hour periods, where a task created at 11pm would still be "new today" at 9am the next day, which reads wrong.
2. **Rest and sick are a sixth family**, with activity types "Rest" and "Sick," logged with the same form as any session. One table, one form. If a day has movement and a rest marker, the square shows the movement and the details list both. *Turned down:* a separate rest-day table, which is a second form and a second query for the grid.
3. **Logging defaults to today and can pick an earlier date**, for the session that didn't get logged last night. The picked date is stored as `localDate` ([0010](./0010-store-each-sessions-local-date-and-utc-time.md)).
4. **The time zone is saved from the browser on first sign-in**, and a settings page can change it. *Turned down:* asking on first sign-in, which is a question the browser already answers.
5. **Done tasks leave the list, with a few seconds of "Undo."** They stay in the database with `completedAt`, but v1 has no history view. *Turned down:* a confirmation dialog, which is slower and gets clicked through.
6. **The backlog has no manual order in v1.** "Getting old" sits at the top, then newest first. Drag to reorder is for the current list, where order means priority ([0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md)).
7. **The grid shows the last 52 weeks on desktop** and roughly the last 16 on a phone, sized when the daily screen is built.
8. **Families and starting activity types are copied for each new user** when the account is created, because settings are data per user ([0011](./0011-single-user-multi-user-ready.md)). A family stores a color key like `blue`, not a hex value, so light and dark mode can each map it to their own shade.

## Consequences

- **Good:** These behaviors are written down instead of left to whoever writes the code.
- **Bad:** Eight decisions in one record is harder to supersede one at a time. A change to one of them gets its own ADR that names which number it replaces.
- **Follow-ups:** none.
