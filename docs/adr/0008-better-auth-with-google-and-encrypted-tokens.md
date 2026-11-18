# 0008. Use Better Auth with Google sign-in, and encrypt stored OAuth tokens

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0009](./0009-one-google-account-with-incremental-consent.md), [0011](./0011-single-user-multi-user-ready.md), Snippr [0004](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0004-nextauth-database-sessions-and-account-linking.md), [0039](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0039-stop-storing-provider-tokens.md), [0061](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0061-store-session-tokens-as-their-sha-256.md)

## In plain English

Signing in uses Better Auth, an open-source auth library that runs inside the app and stores users and sessions in our own Postgres. You sign in with Google. Because Home Base will later keep Google and GitHub tokens to read your calendar and contributions, those tokens are encrypted before they're saved. Better Auth doesn't do that unless you turn it on, so it's on from the first commit.

## Context

The brief asks for real login from day one, so swapping auth later never touches every protected page ([0011](./0011-single-user-multi-user-ready.md)).

Two terms:

- An **OAuth token** is what Google hands the app after you approve access, so the app can call Google on your behalf later. For example, in v3 an access token lets the server ask Google Calendar for today's events without you signing in again. A refresh token gets a new access token when the old one expires.
- **Encrypting** a stored token means the database holds scrambled text that only the app's secret key can turn back into the token. A leaked database row is useless without the key.

Snippr deliberately stopped storing provider tokens because it never used them (Snippr ADR 0039). Home Base is the opposite case: v3's calendar and building grid need them, so they're stored on purpose and protected.

From [Better Auth's options reference](https://www.better-auth.com/docs/reference/options), checked 2026-11-18: `account.encryptOAuthTokens` "Encrypt[s] OAuth tokens before storing them in the database. Default: `false`." The same page says account linking is enabled by default.

## Options considered

1. **Better Auth.** Runs in the app, stores data in our Postgres, works with Drizzle, and supports adding Google scopes later and linking a second provider. Cons: younger than the alternatives; Ryan hasn't used it.
2. **Auth.js (NextAuth).** What Snippr uses (v4). Auth.js has been maintained under the Better Auth project since September 2025 (as reported during the kickoff research; not re-checked here), so new work is going to Better Auth.
3. **Clerk.** Hosted auth with a polished UI and almost no code. User data and sessions live with a third party, which is a poor fit for an app holding health data.

## Decision

Option 1: Better Auth, with Google as the only sign-in provider in v1, sessions stored in Postgres, and `account.encryptOAuthTokens: true`.

## Consequences

- **Good:** User and session data stay in our own database, next to everything else.
- **Good:** Tokens needed in v3 are encrypted at rest from day one, so there's no later migration to encrypt existing rows.
- **Bad:** The encryption key (`BETTER_AUTH_SECRET`) becomes critical. Lose it and every stored token is unreadable, so users reconnect. Rotate it carelessly and the same happens. Better Auth supports versioned secrets for rotation.
- **Bad:** Not yet known whether Better Auth stores session tokens hashed or as-is. Snippr hashes them (its ADR 0061), so a leaked session row can't be used as a cookie. This is checked before v1 ships and recorded in a new ADR either way.
- **Bad:** Account linking is on by default. With Google as the only provider in v1 that's harmless, but it matters when "Connect GitHub" arrives in v3 (Snippr's ADR 0004 found an email-linking hole with exactly that pair).
- **Follow-ups:** both checks above are on the roadmap.
