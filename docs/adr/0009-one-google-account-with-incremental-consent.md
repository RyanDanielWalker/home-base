# 0009. Use one Google account for sign-in and Calendar, asking for Calendar access only when it's needed

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0008](./0008-better-auth-with-google-and-encrypted-tokens.md), [0019](./0019-build-gmail-last.md), `docs/PRODUCT.md` (Integrations)

## In plain English

You sign in with Google, and v1 only asks Google for your name and email. In v3, a "Connect Calendar" button asks the same Google account for read-only calendar access. GitHub is a separate "Connect GitHub" button in v3, not a way to sign in.

## Context

**Scopes** are the specific permissions an app asks Google for. `openid email profile` covers who you are; `calendar.readonly` (or a narrower events scope) lets the app read your calendar. The consent screen lists every scope requested.

**Incremental consent** means asking for more scopes later, only when the feature that needs them is used, instead of everything at sign-in. Better Auth does this by linking the same provider again with extra scopes (`linkSocial`).

Google treats calendar scopes as *sensitive* and Gmail read scopes as *restricted*. Under the personal-use exception (the developer and a few people they know), an app can skip verification, with an "unverified app" warning and a user cap. Details and sources are in `docs/PRODUCT.md` under Integrations.

## Options considered

1. **One Google account, basic scopes at sign-in, Calendar added in v3.** v1's consent screen asks for almost nothing. One account to think about.
2. **Ask for Calendar at sign-in from day one.** One consent screen ever. v1 would ask for access it doesn't use, and every v1 sign-in would hit the sensitive-scope warning.
3. **Separate accounts for sign-in and Calendar.** Flexible. More tables and edge cases for a single user who has one Google account.

## Decision

Option 1. v1 sign-in uses basic scopes only. v3 adds "Connect Calendar" (read-only, the narrowest scope that lists today's events) to the same Google account, and a separate "Connect GitHub" for the building grid.

## Consequences

- **Good:** v1 ships without touching sensitive scopes.
- **Good:** Each integration stays a separate module the app works fine without.
- **Bad:** Two consent moments instead of one. Fine for one user.
- **Follow-ups:** before v3, confirm that basic-scope Google sign-in shows no unverified-app warning, and move the Google project to "In production" status so refresh tokens don't expire after 7 days (see `docs/PRODUCT.md`). Both are on the roadmap.
