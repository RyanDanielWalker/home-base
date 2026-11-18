# 0030. Generate SQL migrations with Drizzle Kit, and run them in the production build

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E5), [0006](./0006-use-drizzle-as-the-orm.md), [0007](./0007-host-on-vercel-hobby.md), [0002](./0002-carry-over-snippr-working-rules.md), Snippr [0038](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0038-push-commits-with-a-migration-to-a-branch-first.md)

## In plain English

Every change to the database's shape is a SQL file, generated from the TypeScript schema, committed, and read in review. When Ryan pushes `main`, the Vercel build applies any new migration files to production before building the app. If a migration fails, the build fails and the old version keeps running. Migrations only ever add things in one push; removing something takes two pushes.

## Context

A **migration** is a file that changes the database's shape (add a table, add a column, add an index) and is applied once, in order. The database remembers which ones have run.

Drizzle Kit has three relevant commands:

- `drizzle-kit generate` compares the schema in TypeScript with the last migration and writes a SQL file for the difference. For example, adding a `note` field to the session table writes a file containing `ALTER TABLE "logged_session" ADD COLUMN "note" text;`.
- `drizzle-kit migrate` applies the files that haven't run yet.
- `drizzle-kit push` changes the database directly to match the schema, with no file. Handy for throwaway experiments. Wrong for anything with real data, because there's no record to review and no history.

[0006](./0006-use-drizzle-as-the-orm.md) left two questions: how migrations are made, and when they run against production. Every push to `main` deploys ([0007](./0007-host-on-vercel-hobby.md)).

## Options considered

How migrations are made: `generate` and commit the SQL was the only serious option. `push` was ruled out for the reason above.

When they run in production:

1. **In the Vercel build, production only.** The build command runs `migrate`, then `next build`, only when `VERCEL_ENV` is `production`. Can't be forgotten. A failed migration fails the build, and the previous deployment keeps serving. Cost: while the new build runs, the old code is running against the new schema, so migrations must be safe for the old code. Adding is safe; removing or renaming isn't.
2. **Ryan runs `migrate` against production from his Mac, before pushing.** Full control over timing. Needs the production connection string on the laptop, and forgetting it deploys new code against the old schema.
3. **Snippr's "push a migration to a branch first" rule** (its ADR 0038). It depends on how Snippr's deploys are wired, which wasn't checked for this decision. It could be layered on top of option 1 later if it adds something.

## Decision

Option 1, chosen by Ryan on 2026-11-18, with these rules:

- **Always `generate`, never `push`,** against any database that matters. The SQL file goes in the same commit as the schema change.
- **Add first, remove in a second push.** A migration that drops or renames something ships only after a previous push has stopped the code using it. This goes in `CLAUDE.md` as a rule.
- **Preview deployments get no database.** `DATABASE_URL` is set for Production only in Vercel, so a branch build can never migrate production.
- `/next` flags any commit with a migration under "Do before you push," so Ryan knows the push changes the database.

## Consequences

- **Good:** The schema history is a folder of readable SQL files, and production can't drift from it.
- **Good:** No production credentials needed on the laptop.
- **Bad:** A migration can't be undone by rolling back the deploy. Rolling back the code leaves the schema where it is. The "add first" rule is what keeps rollbacks safe.
- **Bad:** A slow migration makes the build slow. With one user's data, that's theoretical for a long time.
- **Follow-ups:** step 4 adds the rule to `CLAUDE.md` and `/next`, closing the follow-up in [0002](./0002-carry-over-snippr-working-rules.md).
