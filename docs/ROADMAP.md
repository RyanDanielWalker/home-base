# Roadmap

*Last updated: 2026-11-18*

The thing most likely to kill this project is taking too long to become useful. So v1 is the smallest version Ryan would actually use every day: see what needs doing, log a session, see the grid. Each later phase ships something usable on its own. New ideas are welcome, and they go into a later phase or Parked unless Ryan says otherwise.

[`PRODUCT.md`](./PRODUCT.md) says how much each feature matters; this file says when it ships. Phases run in order. Items inside a phase can ship in any order, each as its own small set of commits.

## Before v1

Where things stand on 2026-11-18: planning. Stack and auth are decided ([0004](./adr/0004-one-nextjs-app-with-server-actions.md) to [0010](./adr/0010-store-each-sessions-local-date-and-utc-time.md)). There is no application code. `/next` doesn't pick these items up automatically; each needs Ryan in the loop.

- [x] Create the repo, set up like Snippr: `CLAUDE.md`, `.claude/settings.json`, `/next` and `/audit`, this roadmap, ADR template, and ADRs for every decision so far ([0001](./adr/0001-record-architecture-decisions.md), [0002](./adr/0002-carry-over-snippr-working-rules.md)). Done 2026-11-18
- [x] A public version of the product brief, without the health details ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)). Done 2026-11-18 as [`PRODUCT.md`](./PRODUCT.md); Ryan to read it once and say if anything in it is too personal
- [ ] Ryan: keep logging sessions now, in a phone note or on paper, so there's history to import when v1 ships (design principle 7). Real logs stay out of the repo
- [x] A visual system for task states: three shapes, three meanings, with a pale amber tint past the cap and a plain "Was due" for missed deadlines ([0025](./adr/0025-task-states-three-shapes-three-meanings.md)). Chosen by Ryan on 2026-11-18
- [ ] The five family colors plus rest, and the exact task-state colors including the amber tint, checked for contrast in light and dark, against the background and against each other for split squares ([0014](./adr/0014-movement-grid-families-and-activity-types.md), [0016](./adr/0016-split-two-activity-days-diagonally.md), [0025](./adr/0025-task-states-three-shapes-three-meanings.md)). Moved into the build as step 10 of the plan
- [x] A numbered v1 build plan, approved by Ryan before any code. Approved 2026-11-18 as [`V1-BUILD-PLAN.md`](./V1-BUILD-PLAN.md), with its decisions in [0026](./adr/0026-build-logging-and-the-grid-before-the-to-do-list.md) to [0039](./adr/0039-small-v1-product-calls.md). It settles: the data model for tasks, sessions, activity types, and families; the migration workflow and when migrations run in production ([0006](./adr/0006-use-drizzle-as-the-orm.md)); how local development gets its own database so it never touches production ([0005](./adr/0005-postgres-on-neon-free-plan.md)); validation and the pattern every Server Action follows ([0004](./adr/0004-one-nextjs-app-with-server-actions.md)); the test setup; what "keep" does on a stale task and in the "getting old" group ([0023](./adr/0023-deal-with-stale-tasks-before-adding.md), [0024](./adr/0024-getting-old-group-at-the-top-of-the-backlog.md)); and which two activities a three-activity square shows ([0016](./adr/0016-split-two-activity-days-diagonally.md))
- [x] Check whether Better Auth stores session tokens hashed or as-is, and record the answer in an ADR ([0008](./adr/0008-better-auth-with-google-and-encrypted-tokens.md)). Done 2026-11-18: stored as-is, but the session cookie is signed with `BETTER_AUTH_SECRET`, so a leaked row alone isn't a usable cookie. Accepted for v1 in [0040](./adr/0040-accept-better-auths-plain-session-tokens-behind-signed-cookies.md)
- [ ] After the build plan: update `CLAUDE.md` (Commands, Known traps) and `/next` with the real commands and the migration rule, the way Snippr's say "push commits with a migration to a branch first" ([0002](./adr/0002-carry-over-snippr-working-rules.md))

## v1: The grid

The habit loop. Everything else decorates it. Built multi-user-ready from the first commit ([0011](./adr/0011-single-user-multi-user-ready.md)). The order and the exact steps are in the approved [build plan](./V1-BUILD-PLAN.md): logging and the grid first, then the to-do list ([0026](./adr/0026-build-logging-and-the-grid-before-the-to-do-list.md)), with a bare version deployed early ([0027](./adr/0027-deploy-a-walking-skeleton-early.md)).

- [ ] Sign in with Google, basic scopes only, with `account.encryptOAuthTokens: true` set from the start and only allowlisted emails let in ([0008](./adr/0008-better-auth-with-google-and-encrypted-tokens.md), [0009](./adr/0009-one-google-account-with-incremental-consent.md), [0033](./adr/0033-allowlist-who-can-sign-in.md))
- [ ] CI on GitHub: typecheck, lint, format check, and tests on every push ([0032](./adr/0032-test-with-vitest-against-a-local-test-database.md)). Added by the build plan
- [ ] A time zone setting per user ([0010](./adr/0010-store-each-sessions-local-date-and-utc-time.md))
- [ ] The to-do list: backlog and current list, the two clocks, optional due dates, soft cap of 6, stale label, deal-with-it-first, drag to reorder, and the "getting old" group, styled per the task-state system ([0020](./adr/0020-built-in-to-do-list-backlog-and-current-list.md) to [0025](./adr/0025-task-states-three-shapes-three-meanings.md))
- [ ] Log a session: type and an optional one-line note, in a couple of taps on a phone ([0015](./adr/0015-a-session-happened-or-it-didnt.md), [0017](./adr/0017-trust-logged-sessions.md))
- [ ] The rest/sick marker ([0014](./adr/0014-movement-grid-families-and-activity-types.md))
- [ ] Activity types and families as data, seeded with the starting set ([0014](./adr/0014-movement-grid-families-and-activity-types.md))
- [ ] The movement grid, with flat family colors, diagonal split squares, and a text description on every square ([0015](./adr/0015-a-session-happened-or-it-didnt.md), [0016](./adr/0016-split-two-activity-days-diagonally.md))
- [ ] Import the pre-app log, so the grid is already filled in on day one. The import file never goes in the repo ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md))
- [ ] Deployed on Vercel Hobby with the database on Neon ([0005](./adr/0005-postgres-on-neon-free-plan.md), [0007](./adr/0007-host-on-vercel-hobby.md))
- [ ] README with real screenshots made from fake data

## v2: The gains

Turns "I moved" into "I'm getting stronger."

- [ ] An end-to-end browser smoke test, left out of v1 because Google sign-in makes it awkward to automate ([0032](./adr/0032-test-with-vitest-against-a-local-test-database.md))
- [ ] Strength logging: exercises, weight, sets, reps
- [ ] Lift charts over time
- [ ] The "last done" line per family
- [ ] The breakdown chart across families

## v3: The plan

The first integrations, added once the core is solid.

- [ ] Planned sessions and today's workout, with one-tap "done." Needs the open question of how the program is stored answered first ([`PRODUCT.md`](./PRODUCT.md), Planned vs. logged sessions)
- [ ] Today's calendar via "Connect Calendar" on the sign-in Google account, read-only ([0009](./adr/0009-one-google-account-with-incremental-consent.md)). Before it: confirm basic-scope sign-in shows no unverified-app warning, and move the Google project to "In production" so refresh tokens don't expire weekly
- [ ] The GitHub building grid via a separate "Connect GitHub." Before it: decide how account linking behaves, since Better Auth links by default and Snippr found an email-linking hole with the Google and GitHub pair ([0008](./adr/0008-better-auth-with-google-and-encrypted-tokens.md))

## v4: The morning

Completes the morning dashboard.

- [ ] One line for today
- [ ] Weather (source not chosen)
- [ ] News, a fixed number of headlines from chosen sources (source not chosen)
- [ ] Install as a PWA ([0012](./adr/0012-web-app-desktop-first-pwa-later.md))

## Later

Nice to have, or expensive.

- [ ] Lab results, logged by hand and charted
- [ ] Quote
- [ ] Evening check-in (undefined so far)
- [ ] Email: a count plus flagged threads ([0019](./adr/0019-build-gmail-last.md))

## Parked

Open questions and ideas with no phase yet. Anything here can be picked up when it's worth doing.

- [ ] A real name, if "Home Base" doesn't stick
- [ ] Confirm whether Vercel's Hobby terms restrict commercial use, before Home Base is ever offered to other people ([0007](./adr/0007-host-on-vercel-hobby.md))
- [ ] If the Neon cold start makes the first morning load annoying: a paid plan or a keep-warm ping ([0005](./adr/0005-postgres-on-neon-free-plan.md))
