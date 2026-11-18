# 0029. Use the standard `pg` driver over TCP, in development and production

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E4), [0005](./0005-postgres-on-neon-free-plan.md), [0006](./0006-use-drizzle-as-the-orm.md), [0028](./0028-run-postgres-in-docker-for-local-development.md)

## In plain English

Drizzle needs a driver to actually send queries to Postgres. Home Base uses `pg`, the standard Node.js Postgres driver, both locally and on Vercel. Neon's own guide recommends this for Vercel's current function runtime.

## Context

A **driver** is the library that opens a connection to the database and carries queries over it. Drizzle sits on top of a driver.

Neon accepts two kinds:

- **`pg` (node-postgres)** over a normal TCP connection, like any Postgres. Works against the local Docker database too.
- **`@neondatabase/serverless`**, which sends queries over HTTP or WebSockets. It was built for serverless functions that start and stop constantly and can't keep a connection open. It can't talk to a plain local Postgres without an extra proxy.

A **connection pool** keeps a few database connections open and lends them to requests, so each request doesn't pay to open its own. Vercel's current runtime, **Fluid compute**, reuses one function instance for many requests, which makes a pool worthwhile. Vercel's `@vercel/functions` package has `attachDatabasePool`, which closes idle pooled connections before a function instance is suspended.

Neon's guide, read 2026-11-18 ([Neon: connecting from Vercel](https://neon.com/docs/guides/vercel-connection-methods)): with Fluid compute, "we recommend you use a standard Postgres TCP connection" with a pool, calling it "the new fastest and most robust method." It also says to benchmark both if an app has many cold starts. It doesn't say whether to use Neon's pooled or direct connection string; step 8 checks Neon's connection docs for that.

## Options considered

1. **`pg` everywhere, with `attachDatabasePool` on Vercel.** One driver, so local behaves like production. Neon's current recommendation. Cost: Home Base's traffic is exactly the "many cold starts" case Neon flags, so the benchmark matters.
2. **Neon's serverless driver in production, `pg` locally.** What older guides recommend. Two code paths for one database, and bugs that only exist in one of them.
3. **Neon's serverless driver everywhere.** One path, but local development would need Neon's proxy in Docker or a cloud database, which [0028](./0028-run-postgres-in-docker-for-local-development.md) ruled out.

## Decision

Option 1. Chosen by Ryan on 2026-11-18. The database client lives in one file, so switching drivers is a small change if the measurement says to.

## Consequences

- **Good:** Local and production run the same code path.
- **Bad:** If the morning cold start turns out to be slow because of the TCP connection setup, the fix is trying option 2, which brings back the two-path problem.
- **Follow-ups:** step 8 measures the first load after 10 idle minutes and records it. If it's bad enough to change drivers, that's a new ADR.
