# Architecture Decision Records

An ADR is a document that captures one significant decision: what we chose, what we didn't, and what it costs us. The goal is that anyone reading the code (including future me) can find out *why* it looks the way it does without having to guess.

## When to write one

Write an ADR when a decision is:

- **Hard to reverse.** Swapping a database, an auth library, or a hosting platform.
- **Not obvious from the code.** Anything where a reasonable engineer would ask "why didn't you just...?"
- **A trade-off.** If we accepted a known downside to get something else, that belongs on paper.
- **A product rule the code enforces.** Home Base's to-do list and grid have rules (two clocks, a soft cap, flat colors) that look arbitrary without the reasoning.

Don't write one for routine choices (naming, small refactors, picking a utility library nobody will ask about).

## How

1. Copy [`0000-template.md`](./0000-template.md) to the next number: `NNNN-short-kebab-title.md`.
2. Fill it in. Make it thorough, not padded: long enough that someone who wasn't there understands what forced the decision, each option with its real cost, what was picked, and what follows. A new term gets a plain definition and a small example. Link to code, commits, and issues rather than copying them ([0002](./0002-carry-over-snippr-working-rules.md)).
3. Commit it alongside the change it describes.
4. ADRs are append-only. If a decision changes, write a new ADR and mark the old one `Superseded by NNNN`. Don't rewrite history.

## Statuses

| Status | Meaning |
| --- | --- |
| Proposed | Under discussion, not yet decided |
| Accepted | Decided and in effect. Before v1, most accepted ADRs are decided but not built yet |
| Superseded | Replaced by a later ADR (linked) |
| Deprecated | No longer applies, nothing replaced it |

## Index

| # | Decision | Status |
| --- | --- | --- |
| [0001](./0001-record-architecture-decisions.md) | Record architecture decisions | Accepted |
| [0002](./0002-carry-over-snippr-working-rules.md) | Carry over Snippr's working rules, guardrails, and credit | Accepted |
| [0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md) | Keep real data and the private brief out of the repo | Accepted |
| [0004](./0004-one-nextjs-app-with-server-actions.md) | Build one Next.js app, with Server Components for reads and Server Actions for writes | Accepted |
| [0005](./0005-postgres-on-neon-free-plan.md) | Use Postgres, hosted on Neon's free plan | Accepted |
| [0006](./0006-use-drizzle-as-the-orm.md) | Use Drizzle as the ORM | Accepted |
| [0007](./0007-host-on-vercel-hobby.md) | Host on Vercel's Hobby plan | Accepted |
| [0008](./0008-better-auth-with-google-and-encrypted-tokens.md) | Use Better Auth with Google sign-in, and encrypt stored OAuth tokens | Accepted |
| [0009](./0009-one-google-account-with-incremental-consent.md) | Use one Google account for sign-in and Calendar, asking for Calendar access only when it's needed | Accepted |
| [0010](./0010-store-each-sessions-local-date-and-utc-time.md) | Give each user a time zone, and store each session's local date plus a UTC timestamp | Accepted |
| [0011](./0011-single-user-multi-user-ready.md) | Build for one user, without the shortcuts that block a second | Accepted |
| [0012](./0012-web-app-desktop-first-pwa-later.md) | Make it a web app, desktop-first and phone-friendly, with a PWA later | Accepted |
| [0013](./0013-no-streaks-nudges-or-step-tracking.md) | No streak counters, relationship nudges, or step tracking | Accepted |
| [0014](./0014-movement-grid-families-and-activity-types.md) | Color the movement grid by five families plus rest, with activity types stored as data | Accepted |
| [0015](./0015-a-session-happened-or-it-didnt.md) | Record that a session happened, not how much, and use one flat color per family | Accepted |
| [0016](./0016-split-two-activity-days-diagonally.md) | Split a two-activity day's square diagonally | Accepted |
| [0017](./0017-trust-logged-sessions.md) | Count every logged session, and trust the user | Accepted |
| [0018](./0018-own-repo-with-snippr-as-the-main-build.md) | Give Home Base its own repo, and keep Snippr as the main build | Accepted |
| [0019](./0019-build-gmail-last.md) | Build the Gmail integration last | Accepted |
| [0020](./0020-built-in-to-do-list-backlog-and-current-list.md) | Build the to-do list in, as a backlog plus a short current list, in v1 | Accepted |
| [0021](./0021-two-clocks-and-optional-due-dates.md) | Count backlog age from creation, reset time on the current list on re-entry, and keep due dates optional and separate | Accepted |
| [0022](./0022-current-list-never-resets-soft-cap-and-stale-label.md) | Keep the current list until Ryan changes it: drag to reorder, a soft cap of 6, and a quiet stale label at 2 days | Accepted; past-cap color replaced by [0025](./0025-task-states-three-shapes-three-meanings.md) |
| [0023](./0023-deal-with-stale-tasks-before-adding.md) | Show stale tasks first when adding a task to the current list | Accepted |
| [0024](./0024-getting-old-group-at-the-top-of-the-backlog.md) | Float backlog tasks 10+ days old into a "getting old" group | Accepted |
| [0025](./0025-task-states-three-shapes-three-meanings.md) | Show task states as three shapes with three meanings, with a pale amber tint past the cap | Accepted |
| [0026](./0026-build-logging-and-the-grid-before-the-to-do-list.md) | Build logging and the grid before the to-do list | Accepted |
| [0027](./0027-deploy-a-walking-skeleton-early.md) | Deploy a walking skeleton to production early | Accepted |
| [0028](./0028-run-postgres-in-docker-for-local-development.md) | Run Postgres in Docker for local development | Accepted |
| [0029](./0029-use-pg-over-tcp-in-development-and-production.md) | Use the standard `pg` driver over TCP, in development and production | Accepted |
| [0030](./0030-generate-sql-migrations-and-run-them-in-the-production-build.md) | Generate SQL migrations with Drizzle Kit, and run them in the production build | Accepted |
| [0031](./0031-one-server-action-helper-zod-and-composite-foreign-keys.md) | Send every Server Action through one helper, validate with Zod, and enforce ownership in foreign keys | Accepted |
| [0032](./0032-test-with-vitest-against-a-local-test-database.md) | Test with Vitest, against a local test database, and run the tests in CI | Accepted |
| [0033](./0033-allowlist-who-can-sign-in.md) | Only allowlisted email addresses can sign in | Accepted |
| [0034](./0034-tailwind-dnd-kit-and-no-date-library.md) | Use Tailwind CSS and dnd-kit, and handle dates without a library | Accepted |
| [0035](./0035-import-the-pre-app-log-through-a-page.md) | Import the pre-app log through a page in the app, not a script | Accepted |
| [0036](./0036-keep-quiets-a-stale-task-until-tomorrow.md) | "Keep, I'm on it" quiets a stale task's prompt until tomorrow, and the label keeps counting | Accepted |
| [0037](./0037-keep-moves-a-task-out-of-getting-old-for-7-days.md) | "Keep" moves a task out of "Getting old" for 7 days | Accepted |
| [0038](./0038-three-activity-days-show-the-first-two-families-logged.md) | A three-activity day's square shows the first two families logged | Accepted |
| [0039](./0039-small-v1-product-calls.md) | Small v1 product calls: calendar days, rest as a family, defaults, and done tasks | Accepted |
| [0040](./0040-accept-better-auths-plain-session-tokens-behind-signed-cookies.md) | Accept Better Auth's plain session tokens, because its cookies are signed | Accepted |

ADRs 0001 to 0025 were all written on 2026-11-18, when the repo was created. 0004 to 0010 record the stack and auth decisions approved that day. 0011 to 0024 record the product brief's decision log, which moved here from the private brief ([0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)). 0025 records the task-state visual system Ryan chose the same day. 0026 to 0039 record the decisions in the [v1 build plan](../V1-BUILD-PLAN.md), which Ryan approved on 2026-11-18 by taking every recommendation. 0040 answers the session-token check that [0008](./0008-better-auth-with-google-and-encrypted-tokens.md) left open (plan step 2).
