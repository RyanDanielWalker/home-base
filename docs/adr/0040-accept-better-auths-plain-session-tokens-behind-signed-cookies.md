# 0040. Accept Better Auth's plain session tokens, because its cookies are signed

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (step 2), [0008](./0008-better-auth-with-google-and-encrypted-tokens.md) (closes its open check), Snippr [0061](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0061-store-session-tokens-as-their-sha-256.md)

## In plain English

Better Auth saves each login session's token in the database as-is, not hashed. That sounds worse than Snippr, which stores a hash. But Better Auth never accepts the bare token as a cookie: the browser's cookie carries the token plus a signature made with the app's secret key. Someone holding a leaked database row still can't make a working cookie without that secret. So Home Base keeps Better Auth's default for v1 and writes down the conditions that would change that.

## Context

[0008](./0008-better-auth-with-google-and-encrypted-tokens.md) left this open. Better Auth's docs describe the session `token` column only as "the unique session token" (read 2026-11-18), so the answer came from the source code of `better-auth` 1.7.25, the current version on npm on 2026-11-18.

Three terms:

- A **session token** is the random string that proves "this browser is signed in as this user." The browser sends it with every request in a cookie; the server looks it up in the `session` table.
- **Hashing** turns a value into a fixed fingerprint that can't be turned back. If the table holds only `sha256(token)`, a stolen row doesn't reveal the token. Snippr does this (its ADR 0061).
- A **signed cookie** carries a value plus a signature computed from that value and a secret key (an HMAC). The server recomputes the signature and rejects the cookie if it doesn't match. Without the key, nobody can produce a valid signature for a token.

What the source shows (paths inside the `better-auth` package's `dist` folder):

- `db/internal-adapter.mjs`, `createSession`: the token is `generateId(32)`, a 32-character random id, stored as-is in the `token` field. `findSession` looks a session up by an exact match on that field. Nothing hashes it.
- `cookies/index.mjs`, `setSessionCookie`: the cookie is written with `ctx.setSignedCookie(..., session.session.token, ctx.context.secret, ...)`.
- `api/routes/session.mjs`, the get-session route: the cookie is read with `ctx.getSignedCookie(..., ctx.context.secret)`, which rejects a cookie whose signature doesn't verify.

So a leaked `session` row alone isn't a usable cookie. Both the row and `BETTER_AUTH_SECRET` would have to leak. That secret lives only in `.env` and Vercel's Sensitive variables, never the database.

While reading the source, one more open check from the plan was answered: Better Auth's telemetry is **off by default** in 1.7.25 (`@better-auth/telemetry`, `dist/index.mjs`: enabled only if `telemetry.enabled` is set or `BETTER_AUTH_TELEMETRY` is true).

## Options considered

1. **Accept the default.** No custom code in the most security-sensitive part of the app. The signature gives most of what hashing gives. Cost: a leak of the database *and* the secret together (for example, a compromised Vercel account) makes sessions usable; with hashing, the secret wouldn't help.
2. **Hash tokens with a custom adapter wrapper**, hashing the `token` field on every write and lookup. Matches Snippr. Fights the library: every Better Auth upgrade could change how sessions are written or found, and a mistake here locks Ryan out or, worse, fails open.
3. **Use a plugin or option that hashes tokens.** None of the plugin names in 1.7.25 suggests one (only the names were checked, not every plugin's options). If one appears, it's the best version of option 2.

## Decision

Option 1. Home Base also commits to:

- **Never enabling Better Auth's `bearer` plugin** (which accepts a token in an `Authorization` header) without revisiting this ADR, since that path may not involve the signed cookie.
- **Treating `BETTER_AUTH_SECRET` as critical**: different values in development and production, Sensitive in Vercel, never logged.
- **Rechecking on major Better Auth upgrades** whether the session cookie is still signed.

## Consequences

- **Good:** No custom auth code to maintain or get wrong.
- **Bad:** Weaker than Snippr in one scenario: if the database and the secret leak together. For one user's app on managed hosting, accepted.
- **Bad:** The protection depends on a library detail (signed cookies) rather than something Home Base enforces. The recheck on upgrades is the guard.
- **Follow-ups:** if Better Auth adds built-in token hashing, adopt it in a new ADR.
