# 0033. Only allowlisted email addresses can sign in

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E8, step 5), [0008](./0008-better-auth-with-google-and-encrypted-tokens.md), [0009](./0009-one-google-account-with-incremental-consent.md), [0011](./0011-single-user-multi-user-ready.md)

## In plain English

Home Base is on a public URL with "Sign in with Google," so without a rule anyone with a Google account could make an account. An environment variable lists the email addresses allowed to sign up. Anyone else sees a plain "This is a private app" page and no account is created.

## Context

[0011](./0011-single-user-multi-user-ready.md) defers a signup flow until there's a reason. But Google sign-in creates an account on first sign-in by default, so "no signup flow" doesn't mean "no signups." Ownership rules mean a stranger would see none of Ryan's data, but they'd still be storing rows in his free-plan database.

An **allowlist** is a list of who's let in, with everyone else refused. Its opposite, a blocklist, lists who's kept out.

Better Auth's **database hooks** run code before or after it creates a row. Its docs say a "before" hook that returns `false` aborts the operation, and it can also throw an `APIError` ([Better Auth: database](https://better-auth.com/docs/concepts/database), read 2026-11-18).

## Options considered

1. **An allowlist in `ALLOWED_EMAILS`**, checked in the "before a user is created" hook. In the app's own code, easy to test, and adding a second person later is one variable. Cost: one more environment variable to set in each environment.
2. **Keep the Google OAuth app in "Testing" status with Ryan as the only test user.** Google enforces it. But Testing status is what makes Google refresh tokens expire after 7 days, which v3's Calendar needs to avoid ([`PRODUCT.md`](../PRODUCT.md), Integrations), so it would have to change later anyway.
3. **Leave sign-up open.** Nothing to build. Strangers can make accounts.

## Decision

Option 1, chosen by Ryan on 2026-11-18. Emails are compared lowercased and trimmed. The refusal page is plain and says nothing about who is allowed.

## Consequences

- **Good:** Only intended people get accounts, and the rule is visible in the code.
- **Good:** Opening Home Base to a friend later is a config change, not a feature.
- **Bad:** Forgetting to set `ALLOWED_EMAILS` in production locks everyone out, including Ryan. The hook fails closed on purpose, and step 8's checklist sets it.
- **Follow-ups:** none.
