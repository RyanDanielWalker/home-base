# 0027. Deploy a walking skeleton to production early

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E2, step 8), [0005](./0005-postgres-on-neon-free-plan.md), [0007](./0007-host-on-vercel-hobby.md), [0008](./0008-better-auth-with-google-and-encrypted-tokens.md), [0030](./0030-generate-sql-migrations-and-run-them-in-the-production-build.md)

## In plain English

As soon as sign-in and the database schema exist, Home Base goes to production, even though it does nothing useful yet. That proves Vercel, Neon, Google sign-in, and migrations all work together while the app is still small, and every feature after that is live the moment Ryan pushes it.

## Context

A **walking skeleton** is the thinnest version of an app that runs end to end in its real environment. For Home Base: open the production URL, sign in with Google, see an empty page, sign out. Nothing useful, but every connection is real: the browser to Vercel, Vercel to Neon, Better Auth to Google and back.

Most deployment problems are wiring, not code: a redirect URL that doesn't match, an environment variable set for the wrong environment, a database in a far-away region. They're easy to find in a tiny app and hard to find under a finished one.

## Options considered

1. **Deploy right after auth and the schema (step 8).** Wiring problems surface while there's little else to blame. Each later feature is usable as soon as it's pushed. Cost: Ryan sets up Neon and Vercel early, and from then on every push to `main` is a production deploy ([0007](./0007-host-on-vercel-hobby.md)).
2. **Deploy when v1 is finished.** No production to think about during the build. All the wiring problems arrive at once, at the end, and nothing is usable until everything is.

## Decision

Option 1. Chosen by Ryan on 2026-11-18. Step 8 also measures the first load after 10 idle minutes, which is the Neon cold start ([0005](./0005-postgres-on-neon-free-plan.md)), and writes the number down.

## Consequences

- **Good:** Deployment risk is paid off early and in small pieces.
- **Good:** Combined with [0026](./0026-build-logging-and-the-grid-before-the-to-do-list.md), logging is in daily use well before v1 is complete.
- **Bad:** From step 8 on, a careless push breaks the real app. CI ([0032](./0032-test-with-vitest-against-a-local-test-database.md)) and the migration rule ([0030](./0030-generate-sql-migrations-and-run-them-in-the-production-build.md)) are the guards.
- **Follow-ups:** none.
