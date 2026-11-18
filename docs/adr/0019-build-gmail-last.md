# 0019. Build the Gmail integration last

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0009](./0009-one-google-account-with-incremental-consent.md), `docs/PRODUCT.md` (Integrations)

## In plain English

Email is the last feature on the list. Reading Gmail needs the kind of Google permission that's hardest to get approved if the app ever goes public, so it waits until everything cheaper is done.

## Context

Covers the decision log row "Email deprioritized to last," decided 2026-11-18.

Google sorts its permissions (scopes) into tiers. Every Gmail scope that reads mail, including `gmail.readonly` and `gmail.metadata`, is **restricted**, the heaviest tier. Going public with a restricted scope means Google's restricted-scope verification plus a yearly security assessment by an approved third party if the data touches a server. One third-party source estimates about $500 a year; Google doesn't publish a price. Under the personal-use exception, none of that applies, with an unverified-app warning and a user cap. Sources, checked 2026-11-18, are in `docs/PRODUCT.md` under Integrations.

## Options considered

1. **Build Gmail last, as "at most a count plus flagged threads."** Personal use works fine; the cost only bites if Home Base goes public.
2. **Build email early as a core panel.** Useful every morning. The most expensive integration to take public, and an inbox fights the "finite, not infinite" principle.

## Decision

Option 1. Email is in the "Later" phase.

## Consequences

- **Good:** No restricted scopes in v1 to v4.
- **Bad:** The morning dashboard won't show email for a long time.
- **Follow-ups:** none.
