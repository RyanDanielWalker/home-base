# 0032. Test with Vitest, against a local test database, and run the tests in CI

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E7, step 9), [0004](./0004-one-nextjs-app-with-server-actions.md), [0028](./0028-run-postgres-in-docker-for-local-development.md), [0027](./0027-deploy-a-walking-skeleton-early.md)

## In plain English

Tests use Vitest. Most tests check the business rules as plain functions. A smaller set checks the data functions and ownership rules against a real Postgres test database. GitHub runs the same tests on every push. There are no browser tests in v1.

## Context

[0004](./0004-one-nextjs-app-with-server-actions.md) puts business rules in plain TypeScript modules so they can be tested without Next.js. The two biggest risks in Home Base are rules that quietly compute the wrong day (a time zone mistake) and a query that forgets its owner filter. Both are testable without a browser.

A **test runner** finds test files, runs them, and reports what failed. **CI** (continuous integration) is a service that runs the checks automatically on every push. Here that's GitHub Actions, free for public repos. A **service container** in GitHub Actions is a database started next to the tests for the length of the run.

## Options considered

1. **Vitest, plus database tests against `home_base_test` in the local Docker Postgres, plus GitHub Actions with a Postgres service container.** Vitest works with modern TypeScript with almost no setup. Database tests run against the same server software as production. Cost: database tests need Docker locally.
2. **Jest.** Older, more answers online, more configuration for TypeScript and ES modules.
3. **Unit tests only, no database tests.** Simpler. Ownership filters, the most important rule in the app, would go untested.

Browser (end-to-end) tests were left out: Google sign-in makes them awkward to automate, and the risks worth testing are in the rules and the queries.

## Decision

Option 1, chosen by Ryan on 2026-11-18.

- Rules are tested as pure functions with a fixed "now" and time zone passed in.
- Database tests use `home_base_test`, emptied between tests.
- After a test passes, the code is broken on purpose once to see the test fail (already the house rule in [`DEVELOPMENT.md`](../DEVELOPMENT.md)).
- CI (step 9) runs typecheck, lint, format check, and tests on every push. CI wasn't on the original roadmap; it's added because from step 8 on, a push to `main` is a production deploy ([0027](./0027-deploy-a-walking-skeleton-early.md)) and CI is the only automated check before it.

## Consequences

- **Good:** The riskiest logic is tested where it lives, quickly.
- **Good:** A failing check is visible on GitHub before Ryan has to notice it in production.
- **Bad:** No test clicks through the real UI. A broken page with correct rules passes.
- **Follow-ups:** an end-to-end smoke test goes on the roadmap for after v1.
