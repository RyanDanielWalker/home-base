# 0031. Send every Server Action through one helper, validate with Zod, and enforce ownership in foreign keys

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E6, step 7), [0004](./0004-one-nextjs-app-with-server-actions.md), [0011](./0011-single-user-multi-user-ready.md)

## In plain English

Every write in Home Base goes through one small helper the project writes itself. Before any action runs, the helper checks who's signed in and checks that the input has the right shape, using a library called Zod. Every data function takes the user's id and filters by it. And the database itself refuses a row that points at another user's data, so a forgotten check in the code still can't mix two users' records.

## Context

A **Server Action** is a function that a button or form calls as if it were local, but it runs on the server ([0004](./0004-one-nextjs-app-with-server-actions.md)). Behind the scenes it's an HTTP endpoint, and anyone can call it with any arguments. So every action has to answer three questions before doing anything: who is calling, is the input the shape we expect, and does every id in it belong to that person ([0011](./0011-single-user-multi-user-ready.md)). [0004](./0004-one-nextjs-app-with-server-actions.md) left the validation library and the shared pattern to the build plan.

**Validation** means checking that input matches a description before trusting it. For example, a schema saying "`title` is a string of 1 to 200 characters" rejects an empty title, a number, or a 10,000-character string, and hands back a typed object when the input is fine.

A **composite foreign key** is a foreign key on more than one column. A normal foreign key says "`activityTypeId` must be an existing activity type." A composite one on (`activityTypeId`, `userId`) says "must be an existing activity type *owned by the same user as this row*." The database enforces it, so even buggy app code can't save a session pointing at someone else's activity type.

## Options considered

Validation library:

1. **Zod.** The most widely used TypeScript validation library. Better Auth already depends on it (its package metadata, checked 2026-11-18), so it's in the project either way.
2. **Valibot.** Smaller in the browser bundle. A second validation library alongside Better Auth's Zod.
3. **Hand-written checks.** No dependency. More code, and easier to miss a case.

The pattern:

1. **One helper, written in the project.** Roughly `action(schema, async (input, { userId }) => ...)`. It resolves the signed-in user (none: refuse), parses the input (bad shape: refuse with a plain message), then runs the body with a trusted `userId`. About 40 lines that can be read top to bottom and explained in an interview.
2. **`next-safe-action`**, a library that does the same. Less to write. A dependency doing the most security-sensitive job in the app, and one more thing to learn rather than read.
3. **No shared pattern.** Fastest to start. The first action that forgets a check is a hole.

## Decision

Zod, and helper 1, chosen by Ryan on 2026-11-18. Plus:

- Every action returns `{ ok: true, data }` or `{ ok: false, error }`, so the UI handles failure the same way everywhere.
- Data functions take `userId` as an argument and filter every query by it. Ownership of each id is checked there, close to the query.
- Every foreign key from one user-owned table to another includes `userId` (a composite foreign key), so the database backs up the app's checks.

## Consequences

- **Good:** A new action can't skip the sign-in or input check without visibly not using the helper, which review and `/audit` look for.
- **Good:** The database refuses cross-user references even if app code forgets.
- **Bad:** Composite foreign keys need a unique constraint on (`id`, `userId`) in each referenced table, which is slightly unusual and needs explaining.
- **Bad:** A hand-written helper is ours to maintain. It gets the most thorough tests in the project (step 7).
- **Follow-ups:** none.
