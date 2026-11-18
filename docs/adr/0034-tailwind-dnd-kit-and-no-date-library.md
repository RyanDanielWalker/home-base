# 0034. Use Tailwind CSS and dnd-kit, and handle dates without a library

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E9), [0010](./0010-store-each-sessions-local-date-and-utc-time.md), [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md), [0025](./0025-task-states-three-shapes-three-meanings.md), [0031](./0031-one-server-action-helper-zod-and-composite-foreign-keys.md)

## In plain English

Three more dependency choices, made together so building doesn't stop to ask each time. Styling uses Tailwind CSS. Dragging tasks to reorder uses a library called dnd-kit, because it handles mouse, touch, and keyboard. Dates and time zones use what's built into JavaScript, with a small tested helper, and no date library.

## Context

`/next` says no new dependency without asking. These are the ones v1 obviously needs (Zod is in [0031](./0031-one-server-action-helper-zod-and-composite-foreign-keys.md)).

**Tailwind CSS** styles elements with small utility classes in the markup, like `flex gap-2 text-sm`, instead of separate stylesheets. **Design tokens** are named values (a color, a spacing size) defined once and used everywhere, so changing the yoga yellow is one edit.

Reordering the current list has to work with a mouse, a long press on a phone ([0025](./0025-task-states-three-shapes-three-meanings.md)), and a keyboard for accessibility ([0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md)).

The only date questions v1 asks are "what is today's date in this time zone" and "how many days between two dates" ([0010](./0010-store-each-sessions-local-date-and-utc-time.md)). The built-in `Intl.DateTimeFormat` answers the first: given a moment and `America/New_York`, it returns that zone's year, month, and day. The second is arithmetic on dates with no time, which has no time zone problem.

## Options considered

| Need | Chosen | Turned down |
| --- | --- | --- |
| Styling | **Tailwind CSS**, the default `create-next-app` offers, with the family colors and the amber tint as CSS variables so light and dark mode swap them in one place | CSS Modules: fine, more files, same variables needed. A component library such as shadcn/ui: fast forms, but a look to fight for a deliberately quiet UI |
| Reordering | **`@dnd-kit/core` and `@dnd-kit/sortable`**, with mouse, touch, and keyboard support built in | Hand-written drag and drop: weeks of touch and keyboard edge cases. Up and down buttons only: accessible, but not what [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md) decided |
| Dates | **No library.** About 30 lines in `src/lib/days.ts` on top of `Intl`, heavily tested | `date-fns` with `@date-fns/tz`, or Luxon: solid, more than needed. The new built-in `Temporal` API: not reliably available everywhere Home Base runs yet (not re-checked for this decision) |

Versions on npm on 2026-11-18: `tailwindcss` 4.3.5, `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0. dnd-kit also has a newer `@dnd-kit/react` package at 0.5.3; a version below 1.0 is still settling, so the established packages were chosen.

## Decision

As in the table, chosen by Ryan on 2026-11-18. Step 3 pins whatever versions are current then.

## Consequences

- **Good:** Few dependencies, each doing something hard to do well by hand.
- **Good:** The date logic is short enough to read in one sitting and is the most tested code in the project.
- **Bad:** Tailwind markup gets long. Repeated patterns become small components.
- **Bad:** If date needs grow (recurring planned sessions in v3, say), a library may earn its place then. That would be a new ADR.
- **Follow-ups:** none.
