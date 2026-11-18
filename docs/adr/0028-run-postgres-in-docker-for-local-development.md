# 0028. Run Postgres in Docker for local development

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E3, step 4), [0005](./0005-postgres-on-neon-free-plan.md), [0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md), Snippr [0015](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0015-local-postgres-in-docker-for-development.md)

## In plain English

When Ryan works on Home Base on his Mac, the app talks to a Postgres database running in Docker on that Mac, never to the production database on Neon. A guard script refuses to run the destructive local commands against anything that isn't `localhost`.

## Context

[0005](./0005-postgres-on-neon-free-plan.md) left this to the build plan with one requirement: development never touches production data. Snippr learned that the hard way (its ADR 0015). The production database holds health data, so it matters more here.

**Docker** runs programs in isolated containers. For example, `docker compose up` can start a Postgres server on the Mac without installing Postgres itself, and deleting the container deletes the database.

## Options considered

1. **Postgres in Docker**, the same major version as the Neon project. Works offline, no cold start, free, and one command resets it. The same server software as production, so "works locally" means something. Snippr already does this, so Docker is presumably on Ryan's Mac (to be confirmed in step 4). Cost: Docker has to be running while working.
2. **A separate Neon project for development.** No Docker. Needs the network, has the same 5-minute cold start, and uses free-plan compute hours. It must be a separate project, not a Neon branch of production, because a branch copies production's data, real health data included.
3. **PGlite**, Postgres compiled to run inside Node with no server. Lightest setup. Not the same server Neon runs, younger, and it doesn't like two processes opening it at once, which a Next.js dev server can do.

## Decision

Option 1. Chosen by Ryan on 2026-11-18.

- `docker-compose.yml` starts Postgres with two databases: `home_base` for development and `home_base_test` for tests ([0032](./0032-test-with-vitest-against-a-local-test-database.md)).
- npm scripts start, stop, migrate, and reset it (step 4 lists them in `CLAUDE.md` and `DEVELOPMENT.md`).
- `db:reset` and `db:seed` refuse to run unless the database host is `localhost`.
- Seed data is made up ([0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).

## Consequences

- **Good:** Production data can't end up on the laptop by accident, and local experiments can't damage production.
- **Good:** Fast and offline.
- **Bad:** One more thing to have running. "Can't connect to database" usually means Docker isn't started.
- **Bad:** The guard matches the host name, so it's a strong guardrail, not a wall. A production URL pasted into `.env` still reaches production for non-guarded commands.
- **Follow-ups:** none.
