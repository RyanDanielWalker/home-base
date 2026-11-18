# 0005. Use Postgres, hosted on Neon's free plan

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0004](./0004-one-nextjs-app-with-server-actions.md), [0006](./0006-use-drizzle-as-the-orm.md), Snippr [0003](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0003-supabase-postgres-with-prisma-5.md), [0037](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0037-turn-on-row-level-security-with-no-policies.md)

## In plain English

The data lives in Postgres, a relational database, hosted by Neon on its free plan. Neon gives us a plain Postgres database and nothing else, which is all Home Base needs.

## Context

The data is relational: users own tasks, sessions, and activity types; activity types belong to color families; sessions link to planned workouts later. Ryan knows Postgres from Snippr.

Snippr runs on Supabase, which bundles a database with an auto-generated HTTP API, auth, and storage. Two of Snippr's traps came from that bundle: the direct database host is IPv6-only on the free tier, and the auto-generated "Data API" exposed tables until row-level security was turned on (Snippr ADRs 0003 and 0037).

**Scale to zero** means the database computer shuts down when nobody is using it and starts again on the next request. That keeps it free, at the cost of a slow first request after a quiet stretch.

Neon's free plan, from [Neon's plans page](https://neon.com/docs/introduction/plans), checked 2026-11-18: 1 GB of storage per project, 100 compute-hours per project per month, and scale to zero after 5 minutes of inactivity, which can't be turned off on the free plan.

## Options considered

1. **Neon, free plan.** Plain Postgres with nothing extra to secure. Free for one user's data for years. Cons: the cold start after 5 idle minutes, which will hit every morning's first load.
2. **Supabase, free plan.** Known from Snippr. Brings an HTTP API and auth that Home Base won't use, and the traps that come with them. Free projects pause after a week of inactivity.
3. **Local SQLite, or Postgres on a small server.** Cheapest per month. Ryan becomes the database administrator, with backups and upgrades to run himself.

## Decision

Option 1: Postgres on Neon's free plan.

## Consequences

- **Good:** No extra surface to lock down. The only way in is a connection string that lives in Vercel and `.env`.
- **Good:** Free for the foreseeable future. One person's tasks and sessions are a few megabytes a year.
- **Bad:** The first page load each morning waits for the database to wake up. That's the exact moment Home Base is meant to be used. If it's annoying in practice, the options are a paid plan or a cheap keep-warm ping, decided then.
- **Follow-ups:** the v1 build plan decides how local development gets its own database, so development never touches production data (Snippr learned this the hard way in its ADR 0015).
