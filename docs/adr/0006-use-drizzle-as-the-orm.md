# 0006. Use Drizzle as the ORM

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0005](./0005-postgres-on-neon-free-plan.md), Snippr [0003](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0003-supabase-postgres-with-prisma-5.md)

## In plain English

The app talks to Postgres through Drizzle, a TypeScript library where the database tables are defined in TypeScript and queries look a lot like SQL. Ryan chose it over Prisma, which Snippr uses, after hearing that Snippr is stuck two major versions behind.

## Context

An **ORM** (object-relational mapper) is a library that lets code read and write database rows as typed objects instead of hand-written SQL strings. For example, instead of `SELECT * FROM task WHERE user_id = $1`, Drizzle code reads `db.select().from(task).where(eq(task.userId, userId))`, and TypeScript knows the shape of what comes back.

Snippr uses Prisma 5, pinned on purpose: Prisma 7 changed how it's configured and fought the setup (Snippr ADR 0003). Prisma 5 is now two major versions behind.

## Options considered

1. **Drizzle.** The schema is TypeScript, so there's no separate schema language or generate step. Queries map closely to SQL, which is also a good way to learn SQL. Cons: newer than Prisma, with a smaller ecosystem and fewer answers online; Ryan hasn't used it.
2. **Prisma 5.** Known from Snippr. Starts a new project two majors behind, with the upgrade problem baked in.
3. **Prisma 7.** Current. The version that blocked Ryan before.

## Decision

Option 1: Drizzle. Confirmed by Ryan on 2026-11-18 after learning Snippr is on Prisma 5.

## Consequences

- **Good:** Types come straight from the schema file, with no `generate` step to forget (Snippr's build runs `prisma generate` first for exactly that reason).
- **Good:** SQL-shaped queries make it easier to reason about what actually hits the database.
- **Bad:** A new tool to learn. Expect a few early sessions spent on how Drizzle does migrations and relations.
- **Bad:** Fewer ready-made answers than Prisma when something goes wrong.
- **Follow-ups:** the v1 build plan picks the migration workflow (Drizzle Kit's generated SQL migrations, and when they run against production).
