# 0035. Import the pre-app log through a page in the app, not a script

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E10, step 13), [0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md), [0031](./0031-one-server-action-helper-zod-and-composite-foreign-keys.md), [0026](./0026-build-logging-and-the-grid-before-the-to-do-list.md)

## In plain English

Ryan's log from before the app gets into Home Base through an import page: paste CSV text, see a preview that points out anything it can't match, then save. It goes through the same checks as every other write, and the production database password never has to be on his laptop.

## Context

Design principle 7: logging starts before the app, and the app imports that history so the grid is filled in on day one. The log is real health data and never goes in the repo ([0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).

**CSV** (comma-separated values) is a plain text table, one row per line. For example:

```
date,activity,note
2026-11-02,Intentional walk,
2026-11-03,Dumbbell session,rows at 15 lb
```

## Options considered

1. **An import page.** Paste CSV, preview with problems flagged ("`yoga flow` isn't an activity type yet"), save. Uses the Server Action helper ([0031](./0031-one-server-action-helper-zod-and-composite-foreign-keys.md)), so rows belong to the signed-in user automatically. Cost: a small page with a preview.
2. **A command-line script run against production.** Less UI. Needs the production connection string on the laptop, needs Ryan's user id looked up by hand, and bypasses the ownership pattern.

## Decision

Option 1, chosen by Ryan on 2026-11-18. The page stays after the first import, for any later backfill. Only made-up CSV is used in tests and development.

## Consequences

- **Good:** No production credentials on the laptop, and the import obeys the same rules as everything else.
- **Bad:** Pasting a long log into a text box is clunky. For one import of a few weeks of history, it's fine.
- **Follow-ups:** none.
