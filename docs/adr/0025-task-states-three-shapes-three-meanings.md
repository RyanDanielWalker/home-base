# 0025. Show task states as three shapes with three meanings, with a pale amber tint past the cap

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0020](./0020-built-in-to-do-list-backlog-and-current-list.md), [0021](./0021-two-clocks-and-optional-due-dates.md), [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md) (its "turn yellow" is replaced here), [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md), [0014](./0014-movement-grid-families-and-activity-types.md)

## In plain English

The to-do list has several states a task can be in, and none may be mistaken for another. Deadlines are a boxed date with a calendar icon. Pressure numbers ("on the list 3 days," "12 days old") are plain, quiet text with an hourglass that always counts days. The soft cap is a dashed line in the list after task 6, and the tasks below it sit on a pale amber tint, not the yellow the brief described. A missed deadline says "Was due Mon, Nov 16" in the same box, with no red.

## Context

This was the last open design question before the v1 build plan. Five states can land on one task: past the soft cap of 6, stale on the current list, a due date, backlog age, and 10+ days "getting old" ([0021](./0021-two-clocks-and-optional-due-dates.md) to [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md)). The hard requirement from the brief: a pressure number is never mistaken for a deadline. Design principle 6 adds "facts, not pressure," and the grid's accessibility rule says color is never the only signal.

The options were mocked up on desktop and phone with made-up tasks, and Ryan chose Option A on 2026-11-18. In the same conversation he agreed to two smaller calls:

1. **The brief says past-cap tasks "turn yellow."** Yoga is yellow on the movement grid ([0014](./0014-movement-grid-families-and-activity-types.md)), and on a phone the grid sits right above the list. A yellow task row would look like it had something to do with yoga.
2. **What a missed deadline says.** Red text or an "overdue" badge would be the app raising its voice about an unpaid bill, which the principles rule out.

## Options considered

1. **A: three shapes, three meanings.** Deadlines, pressure counts, and the cap differ in shape, icon, and wording, not just color. Calm. More distinct pieces to build than B.
2. **B: a colored pill for every state.** One component, familiar from Jira and Linear. "4d" and "Nov 22" are both short tokens in a pill, so the difference rests mostly on color; three pills on one task reads like an alarm; and the cap lands on each task instead of on the list.
3. **C: quiet icons, details on tap.** Calmest screen. Hides the pressure Ryan opted into, tap-to-reveal is slow on a phone, and fading past-cap tasks reads as "disabled."

## Decision

Option A, with the pale amber tint and a plain "Was due."

| State | Where | Looks like | Words |
| --- | --- | --- | --- |
| Due date | Anywhere | Outlined box with a calendar icon. The only boxed thing on a task | "Due Fri, Nov 20", "Due today", "Due tomorrow" |
| Due date passed | Anywhere | The same box, no color change | "Was due Mon, Nov 16" |
| Stale | Current list, 2+ days | Muted italic text with an hourglass | "on the list 3 days" |
| Backlog age | Backlog, every task | Muted italic text with an hourglass | "6 days old", "new today" |
| Getting old | Backlog, 10+ days | Its own group at the top, with move, keep, and delete buttons | Group heading "Getting old" |
| Past the cap | Current list, position 7+ | A dashed divider after task 6, then rows on a pale amber tint | "past 6: probably not today" |

- **Grammar does the work.** A deadline is always a date. A pressure number is always a count of days that have passed. They differ in shape (box vs. plain text), icon (calendar vs. hourglass), and wording.
- **Stale and backlog age share a style on purpose.** Both are pressure counters, and they never appear on the same task, since a task is in one list at a time.
- **The cap belongs to the list, not the task.** Position and the worded divider carry the meaning; the tint is backup. The tint is a pale amber surface, never the grid's solid yoga yellow.
- **Screen readers** hear full words: "Due Friday, November 20," "On the current list 3 days," "Added 6 days ago," a separator labeled "Past 6, probably not today," and a labeled "Getting old, 10 or more days" group.
- **Phone:** metadata drops under the title, rows are at least 44px tall to tap, and reordering is a long-press instead of a drag handle.

This replaces "turn yellow" in [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md) and the private brief. Everything else in 0022 stands.

## Consequences

- **Good:** A pressure number and a deadline can't be confused, even in grayscale.
- **Good:** One task can be past the cap, due Sunday, and stale at once, each in its own slot, without blurring together.
- **Bad:** More visual pieces to build and keep consistent than a single pill component.
- **Bad:** A missed deadline looks almost the same as an upcoming one; only the word "Was" differs. That's the point, but it means a missed bill is easy to overlook. If that bites, a stronger look for past-due only (a filled box, say) is the fallback that was considered.
- **Follow-ups:** exact color values, including the amber tint in light and dark, are set and contrast-checked when the v1 styles are built.
