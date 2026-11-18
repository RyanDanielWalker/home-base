# 0011. Build for one user, without the shortcuts that block a second

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0008](./0008-better-auth-with-google-and-encrypted-tokens.md), [0010](./0010-store-each-sessions-local-date-and-utc-time.md), [0014](./0014-movement-grid-families-and-activity-types.md), `docs/PRODUCT.md` (Scope and users)

## In plain English

Home Base has one user: Ryan. It skips everything a public product needs (signup, billing, admin), but it also skips the shortcuts that would make adding a second user a rewrite. Every row knows who owns it, login is real, settings are data, and each user has a time zone and their own encrypted tokens.

## Context

Covers the decision log row "Single user, multi-user-ready," decided 2026-11-18.

Building for one person is fast. The trap is that the fastest one-person shortcuts (a hardcoded password, "select all workouts," a config file of activity colors) touch every table and query when a second person shows up. Avoiding them costs little now and a lot later.

## Options considered

1. **Single user, multi-user-ready.** Fast to build, with five rules that keep the door open. Small extra cost on every table and query.
2. **Strictly personal, with shortcuts.** Fastest. Going public later means touching every table, query, and protected page.
3. **A full multi-user product from the start.** Ready to share. Signup, billing, and admin tools delay v1 for users who don't exist.

## Decision

Option 1. The five rules:

| Rule | In practice | Why now |
| --- | --- | --- |
| Every record has an owner | Every table with user data has `userId`; every query filters by it. | Adding it later means touching every table and query and backfilling old rows. |
| Real login from day one | Better Auth with Google ([0008](./0008-better-auth-with-google-and-encrypted-tokens.md)). | Swapping auth later touches every protected page. |
| Settings are data | Activity types, colors, and later news sources are rows per user, not code. | A second user can't share one hardcoded config. |
| Time zone per user | Day boundaries use the user's zone ([0010](./0010-store-each-sessions-local-date-and-utc-time.md)). | Getting this wrong silently misplaces squares. |
| Integration tokens per user, encrypted | Each user's Google and GitHub connections stored separately ([0008](./0008-better-auth-with-google-and-encrypted-tokens.md)). | Shared tokens can't be untangled later. |

Deferred until there's a reason: signup flow, billing, admin tools, scaling work, Google app verification.

## Consequences

- **Good:** Going public later is new features, not a rewrite.
- **Good:** The ownership rule is also the main security rule: one user can never read another's rows.
- **Bad:** Every query carries a `userId` filter even though there's one user. Forgetting it is invisible until a second user exists, so `/audit` checks for it.
- **Follow-ups:** none.
