# v1 build plan

*Drafted 2026-11-18. Status: **approved by Ryan on 2026-11-18**, taking every recommendation. The decisions are recorded in ADRs [0026](./adr/0026-build-logging-and-the-grid-before-the-to-do-list.md) to [0039](./adr/0039-small-v1-product-calls.md).*

This is the plan for getting from "no code" to the v1 on [the roadmap](./ROADMAP.md): sign in, a to-do list, logging a session, and the movement grid, deployed and in daily use. It has two parts:

1. **Decisions to approve.** Everything the roadmap says the plan must settle, plus a few forks found while writing it. Each has options, what they cost, and a recommendation. "Take all the recommendations" is a valid answer; so is picking a different option on any one.
2. **The numbered steps.** What gets built, in what order, what "done" means for each, and **where each step runs**: in a Claude chat, in Claude Code on Ryan's Mac, or in an account only Ryan can open.

Once approved, each decision becomes an ADR (step 1), and this file stays as the record of the plan. When the plan changes during the build, this file changes in the same commit, with a line in the change log at the bottom.

## When to switch to Claude Code in the terminal

**Right after step 2.** Steps 1 and 2 are writing (ADRs and one research check) and can happen in a chat. From step 3 on, every step installs packages, runs a dev server or a database, or needs secrets in a local `.env`, and that only works on Ryan's Mac. The table below marks each step:

- 💬 **Chat is fine:** writing and research. A cloud Claude session can do it.
- 💻 **Terminal:** Claude Code on Ryan's Mac, in the repo, with `/next`.
- 🔑 **Ryan's accounts:** something only Ryan can click, in a dashboard Claude can't and shouldn't log into (Google Cloud, Neon, Vercel), or a secret only he should hold.

| # | Step | Where |
| --- | --- | --- |
| 1 | ADRs for the approved decisions | 💬 |
| 2 | Check how Better Auth stores session tokens, ADR either way | 💬 |
| 3 | Scaffold the app, tooling, and checks | 💻 |
| 4 | Local database in Docker, Drizzle, migrations | 💻 (Docker installed) |
| 5 | Sign in with Google, allowlisted | 💻 🔑 (Google OAuth client, `.env` secrets) |
| 6 | App schema, starting data per user, time zone | 💻 |
| 7 | The Server Action pattern and the day helpers | 💻 |
| 8 | Deploy the skeleton to production | 🔑 💻 (Neon, Vercel, Google redirect URL) |
| 9 | CI on GitHub | 💻 🔑 (Ryan pushes) |
| 10 | Colors: palette, contrast check, Ryan picks | 💻 |
| 11 | Log a session, and the rest/sick marker | 💻 |
| 12 | The movement grid | 💻 |
| 13 | Import the pre-app log | 💻, then 🔑 (real log, in production) |
| 14 | To-do list, part 1: lists, clocks, due dates, getting old | 💻 |
| 15 | To-do list, part 2: order, soft cap, stale, deal with it first | 💻 |
| 16 | The daily screen, desktop and phone | 💻 |
| 17 | v1 wrap-up: docs as built, README screenshots, `/audit` | 💻 |

Ryan pushes after any step he likes. Once step 8 is done, every push to `main` deploys to production, so from then on each step ends in something that works.

---

## Part 1: decisions to approve

### Engineering

#### E1. Build order: grid first, then the to-do list

The roadmap lists the to-do list first, but doesn't fix the order.

1. **Grid first (logging, grid, import), then the to-do list.** The grid half is the smaller half ([0020](./adr/0020-built-in-to-do-list-backlog-and-current-list.md) says the to-do list is most of the v1 work), so something real ships sooner. It also ends the paper or phone-note log sooner: once logging is live, the pre-app log gets imported once and the app takes over. Cost: Ryan said he wouldn't open the app daily without the to-do list, so the first few weeks of the app are "log and look," not the full morning.
2. **To-do list first.** The most-used part arrives first. The paper log keeps going longer, and the import happens later with a bigger file.
3. **Interleave** (a slice of each, alternating). Feels balanced. More context switching, and neither half is finished until the end.

**Recommendation: 1.** The order of steps 11 to 15 below assumes it.

#### E2. Deploy early (a "walking skeleton"), not at the end

A **walking skeleton** is the thinnest version of the app that runs end to end in production: sign in, see an empty page, sign out. Nothing useful yet, but every piece (Vercel, Neon, Google sign-in, migrations) is proven to connect.

1. **Deploy right after sign-in and the schema exist (step 8).** Production surprises (a wrong redirect URL, a missing env var, the Neon cold start) show up when the app is small and easy to debug. Every later step lands in production as soon as Ryan pushes, so the grid is usable the day it's done. Cost: Ryan sets up Neon and Vercel early, and has to remember that pushing `main` deploys.
2. **Deploy once v1 is finished.** No production to worry about during the build. All the deployment surprises arrive together at the end, and nothing is usable until everything is.

**Recommendation: 1.**

#### E3. Local development gets its own database, in Docker

[0005](./adr/0005-postgres-on-neon-free-plan.md) requires that development never touches production data.

1. **Postgres in Docker on Ryan's Mac**, the same major Postgres version as the Neon project. Snippr already does this (its ADR 0015), so Docker is presumably already installed (a guess; step 4 checks). Works offline, no cold start, free, and resetting it is one command. A guard script refuses to run the local database commands against any host that isn't `localhost`. Cost: Docker has to be running while working.
2. **A second Neon database for development** (a separate Neon project, not a branch of production, because a branch would copy real health data). No Docker. Needs the network, has the same 5-minute cold start, and counts against the free plan's compute hours.
3. **PGlite**: Postgres compiled to run inside Node, no server at all. Lightest setup. Younger, and it's not the same server Neon runs, so "works locally" proves less. It also struggles when two processes open it at once, which a Next.js dev server can do.

**Recommendation: 1.**

#### E4. Talk to the database with `pg` over TCP, in development and production

A **driver** is the library that actually carries queries to Postgres. Neon offers its own serverless driver (queries over HTTP) and also accepts the standard `pg` driver (queries over a normal TCP connection).

1. **`pg` everywhere, with Vercel's `attachDatabasePool`.** One driver for local Docker and Neon, so local behaves like production. Neon's own Vercel guide now recommends this for Vercel's current function runtime ("Fluid compute"), calling it "the new fastest and most robust method" ([Neon: connecting from Vercel](https://neon.com/docs/guides/vercel-connection-methods), read 2026-11-18). That guide also says to benchmark both if cold starts are frequent, which Home Base's will be.
2. **Neon's serverless driver in production, `pg` locally.** What older guides recommend. Two code paths for one database, and the Neon driver can't talk to a plain local Postgres without an extra proxy.

**Recommendation: 1.** Step 8 times the first morning load. If the cold start is worse than expected, trying option 2 is a one-file change and gets its own ADR.

#### E5. Migrations: generated SQL files, run automatically by the production build

A **migration** is a file that changes the database's shape (add a table, add a column) and is applied once, in order. Drizzle Kit compares the TypeScript schema with the last migration and writes the SQL for the difference (`drizzle-kit generate`); a second command applies the files that haven't run yet (`drizzle-kit migrate`). Drizzle also has `drizzle-kit push`, which changes the database directly with no file; that's fine for throwaway experiments and wrong for anything that holds real data, because it leaves no reviewable record.

How migrations are made: always `generate`, commit the SQL file in the same commit as the schema change, read it in review. Never `push` against a database that matters.

When they run against production:

1. **In the Vercel build, production only.** The build command runs `migrate` first when `VERCEL_ENV` is `production`, then `next build`. Can't be forgotten. If a migration fails, the build fails and the previous deployment keeps serving. Cost: for the minute while the new build runs, the old code is running against the new schema. That's safe as long as migrations only add things; a removal (drop a column, rename) goes out in two pushes: first stop using it, then drop it. That rule goes in `CLAUDE.md`.
2. **Ryan runs `migrate` against production from his Mac, before pushing.** Full control. Needs the production connection string on his laptop, and forgetting it means the new code deploys against the old schema and breaks.
3. **Snippr's "push a migration to a branch first" rule.** It depends on how Snippr's deploys are wired, which hasn't been checked for this plan. Could be layered on top of 1 if it turns out to add something.

**Recommendation: 1**, plus the "add first, remove in a second push" rule. Preview deployments (any branch other than `main`) get no database URL, so they can never migrate production.

#### E6. Every Server Action follows one helper, and validation uses Zod

[0004](./adr/0004-one-nextjs-app-with-server-actions.md) leaves the validation library and the Server Action pattern to this plan. A Server Action is a public endpoint that looks like a function call, so the checks can't be optional.

Validation library:

1. **Zod.** The most widely used TypeScript validation library. Better Auth already depends on it (checked in its package metadata, 2026-11-18), so it's in the project either way.
2. **Valibot.** Smaller bundle. A second validation library alongside Better Auth's Zod.
3. **Hand-written checks.** No dependency. More code, easier to miss a case.

The pattern:

1. **One small helper, written here, that every action goes through.** Roughly: `action(schema, async (input, { userId }) => ...)`. It resolves the signed-in user (no user: refuse), parses the input with the schema (bad shape: refuse with a plain error), then runs the body with a trusted `userId`. Ownership checks on ids happen in the data functions, which all take `userId` and filter by it. About 40 lines, fully readable, easy to explain in an interview.
2. **`next-safe-action`**, a library that does the same. Less to write. A dependency doing the most security-sensitive job in the app, and one more thing to learn instead of read.
3. **No shared pattern**, each action does its own checks. Fastest to start. The first forgotten check is a hole.

**Recommendation: Zod, and helper 1.** Every action returns either `{ ok: true, data }` or `{ ok: false, error }`, so the UI handles failure the same way everywhere.

On top of the helper, the database enforces ownership across tables: a logged session's activity type must belong to the same user, enforced by a foreign key on both `id` and `userId` (a **composite foreign key**: the database refuses a row pointing at another user's activity type, even if the app code forgets to check). Cheap to add now, painful later.

#### E7. Tests: Vitest, with database tests against the local Postgres

1. **Vitest** for unit tests of the business rules (pure functions with a fixed "now" and time zone passed in) and for a smaller set of database tests (data functions and ownership checks) against a separate `home_base_test` database in the same Docker container, emptied between tests. Vitest is the test runner most Next.js projects use now and needs almost no setup with TypeScript.
2. **Jest.** Older, more answers online, more configuration with modern TypeScript and ES modules.

No browser (end-to-end) tests in v1: Google sign-in makes them awkward to automate, and the risk worth testing lives in the rules and the ownership checks. An end-to-end smoke test goes on the roadmap for later.

**Recommendation: 1.** CI (step 9) runs the same tests on GitHub with a Postgres service container.

#### E8. Only allowlisted emails can sign in

Without this, anyone who finds the URL can sign in with any Google account and create a user. Ownership checks mean they'd see nothing of Ryan's, but they'd be using his database and free-plan limits.

1. **An allowlist in an environment variable** (`ALLOWED_EMAILS`), checked in Better Auth's "before a user is created" hook, which can abort the sign-up ([Better Auth database hooks](https://better-auth.com/docs/concepts/database), read 2026-11-18). Strangers get a plain "This is a private app" page. Adding a second user later is one env var change.
2. **Keep the Google OAuth app in "Testing" with Ryan as the only test user.** Google enforces it. But Testing status is what makes refresh tokens expire after 7 days, which v3's Calendar needs to avoid ([`PRODUCT.md`](./PRODUCT.md), Integrations), so it would have to change later anyway.
3. **Leave sign-up open.** Nothing to build. Strangers can make accounts.

**Recommendation: 1.**

#### E9. New dependencies: Tailwind CSS, dnd-kit, and no date library

Each new dependency is a decision ([`/next`](../.claude/skills/next/SKILL.md) says ask first), so the expected ones are listed here to approve in one go:

| Need | Recommendation | Alternatives and why not |
| --- | --- | --- |
| Styling | **Tailwind CSS**, the default `create-next-app` offers. Design tokens (the family colors, the amber tint) live as CSS variables, so light and dark mode swap them in one place | CSS Modules: fine, more files, and the tokens still need the same variables. A component library (shadcn/ui and similar): fast forms, but a look to fight against for a deliberately quiet UI |
| Drag to reorder | **`@dnd-kit/core` and `@dnd-kit/sortable`.** Mouse, touch (long press, per [0025](./adr/0025-task-states-three-shapes-three-meanings.md)), and keyboard reordering built in, which covers the accessibility point in [0022](./adr/0022-current-list-never-resets-soft-cap-and-stale-label.md) | Hand-written drag and drop: touch and keyboard support is weeks of edge cases. Up and down buttons only: accessible, but not what was decided |
| Validation | **Zod** (E6) | |
| Dates and time zones | **No library.** The app only needs "what is today's date in this time zone" and "how many days between two dates." The built-in `Intl.DateTimeFormat` answers the first, and date-only arithmetic answers the second, in about 30 tested lines (step 7) | `date-fns` with `@date-fns/tz`: solid, more than needed. Luxon: same. The new built-in `Temporal` API: not reliably available in every browser and Node version Home Base targets yet (not re-checked for this plan) |

Versions current on npm on 2026-11-18, for reference: `next` 16.4.6, `better-auth` 1.7.25, `drizzle-orm` 0.45.4, `drizzle-kit` 0.31.11, `zod` 4.6.7, `vitest` 5.1.1, `pg` 8.23.1, `tailwindcss` 4.3.5, `@dnd-kit/core` 6.3.1, `@dnd-kit/sortable` 10.0.0. Step 3 pins whatever is current then.

#### E10. Import the pre-app log through a page in the app, not a script

The real log never goes in the repo ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).

1. **An import page:** paste CSV text (`date,activity,note`), see a preview that flags anything it can't match ("`yoga flow` isn't an activity type yet"), then save. It goes through the same Server Action helper as everything else, so it's tied to the signed-in user, and the production database password never has to sit on Ryan's laptop. Costs a small page.
2. **A command-line script** run against production. Less UI. Needs the production connection string locally and a way to look up Ryan's user id, and it bypasses the ownership pattern.

**Recommendation: 1.** The page can stay afterwards for any future backfill.

### Product calls

These look small but change behavior, and the ADRs left them to this plan.

#### P1. What "keep, I'm on it" does on a stale task ([0023](./adr/0023-deal-with-stale-tasks-before-adding.md))

1. **It quiets the "deal with it first" prompt for that task until tomorrow.** The stale label stays and keeps counting honestly ("on the list 4 days"). Adding three tasks in one morning asks about each stale task once, not three times. Stored as the date it was kept, in Ryan's time zone.
2. **Nothing changes.** Every add asks again. Honest, and quickly annoying.
3. **It resets the current-list clock.** The stale label disappears. Hides how long the task has really been there, which [0021](./adr/0021-two-clocks-and-optional-due-dates.md) exists to prevent.

**Recommendation: 1.**

#### P2. What "keep" does in the "getting old" group ([0024](./adr/0024-getting-old-group-at-the-top-of-the-backlog.md))

1. **It moves the task out of the group for 7 days**, back into the normal backlog. Its age label keeps counting. After 7 days, if it's still in the backlog, it floats back up.
2. **For good**, until the task moves somewhere. The group stays meaningful, but a kept task is never asked about again.
3. **Nothing changes.** The group fills with tasks Ryan already said yes to, and stops meaning anything.

**Recommendation: 1, with 7 days.** The number is a guess and easy to change.

#### P3. Which two families a three-activity day shows ([0016](./adr/0016-split-two-activity-days-diagonally.md))

The square splits by **family**, not by session: two walks on one day is one green square.

1. **The first two families logged that day**, by the time they were logged. Stable: logging a third thing never changes what the square already showed.
2. **A fixed priority order** (say strength first). Predictable, but quietly ranks some kinds of movement above others.
3. **The two least-done families recently.** Clever, and changes old squares as new days are logged.

**Recommendation: 1.** The details on hover, tap, and for screen readers always list every session.

#### P4. Smaller calls, recommended as written unless Ryan says otherwise

- **Days are calendar days in Ryan's time zone, not 24-hour periods.** A task created at 11pm reads "1 day old" the next morning. "New today" means created today. Same rule for stale (2+ calendar days on the current list) and getting old (10+).
- **Rest and sick are a sixth family** with activity types "Rest" and "Sick," logged like any session, so there's one table and one form. If a day has both movement and a rest marker, the square shows the movement and the details list both.
- **Logging defaults to today and can pick an earlier date**, for the session that didn't get logged last night. The stored `localDate` is the picked date ([0010](./adr/0010-store-each-sessions-local-date-and-utc-time.md)).
- **Time zone:** the browser's zone is saved automatically on first sign-in, and a settings page can change it.
- **Done tasks** leave the list, with a few seconds of "Undo." v1 keeps them in the database (with `completedAt`) but has no history view.
- **The backlog has no manual order in v1:** "Getting old" at the top, then newest first. Drag to reorder is for the current list, where order means priority.
- **The grid shows the last 52 weeks on desktop** and the last 16 or so on a phone, sized in step 16.
- **Families and starting activity types are copied for each new user** when the account is created, since settings are data per user ([0011](./adr/0011-single-user-multi-user-ready.md)). A family stores a color *key* like `blue`, not a hex value, so light and dark mode can each map it to the right shade.

---

## Part 2: the steps

Each step is one or a few commits, run through `/next` from step 3 on. "Done" always also means: checks pass, docs that the step made wrong are fixed, the roadmap is ticked, and no real data is anywhere in the diff.

### 1. ADRs for the approved decisions 💬

One ADR per decision above (from 0026), in the house format, linking back here. P4's small calls share one ADR.

**Done when:** every decision Ryan approved has an ADR, the ADR index lists them, and `ARCHITECTURE.md`'s data table matches the data model below.

### 2. How Better Auth stores session tokens 💬

The open check from [0008](./adr/0008-better-auth-with-google-and-encrypted-tokens.md): if the session table holds tokens as-is, a leaked row works as a login cookie. Snippr stores a SHA-256 hash instead (its ADR 0061). Better Auth's database page describes the session `token` only as "the unique session token" (read 2026-11-18), so the answer has to come from its source code.

**Done when:** an ADR records what Better Auth does, with the source line that shows it, and what Home Base does about it (accept it, or hash it with a hook or plugin).

**→ Switch to Claude Code in the terminal here.**

### 3. Scaffold the app 💻

`create-next-app` with TypeScript, the App Router, ESLint, and Tailwind. Prettier, Vitest, and the npm scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `format:check`. A page that says "Home Base" and nothing else.

**Ryan needs:** Node installed (a current LTS).

**Done when:** all scripts run clean, `CLAUDE.md` lists the commands, and `DEVELOPMENT.md`'s Setup section explains how to get from a fresh clone to a running page.

### 4. Local database 💻

`docker-compose.yml` with Postgres (same major version as the Neon project in step 8), two databases (`home_base` and `home_base_test`), Drizzle config, the `pg` client, and scripts: `db:up`, `db:down`, `db:generate`, `db:migrate`, `db:studio`, `db:reset`. A guard that refuses to run `db:reset` or the seed script unless the database host is `localhost`.

**Ryan needs:** Docker Desktop (or OrbStack) installed and running.

**Done when:** a fresh clone can go from nothing to a migrated local database with the commands in `DEVELOPMENT.md`, and the guard demonstrably refuses a non-local URL. `CLAUDE.md` gets the migration rule from E5.

### 5. Sign in with Google 💻 🔑

Better Auth with the Drizzle adapter, Google as the only provider, basic scopes, sessions in Postgres, `account.encryptOAuthTokens: true` in the first commit that configures auth, and the E8 allowlist hook. A sign-in page, a protected layout that redirects signed-out visitors, and sign-out. Better Auth's own tables come from its CLI and go through a normal Drizzle migration.

**Ryan needs to, in his accounts:**
- Create a Google Cloud project and an OAuth client (type "Web application") with `http://localhost:3000/api/auth/callback/google` as a redirect URI. Claude writes the click-by-click steps into `DEVELOPMENT.md` first.
- Put `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, a generated `BETTER_AUTH_SECRET`, and `ALLOWED_EMAILS` in `.env` (never committed; Claude can't read it, per the deny rule).
- Sign in once to confirm it works, and once with a second Google account to confirm it's refused.

**Done when:** Ryan can sign in and out locally, a non-allowlisted account sees the refusal page, and the stored `account` row's tokens are visibly encrypted (checked with `db:studio`). Also check whether Better Auth sends usage telemetry by default, and turn it off if so (not checked for this plan).

### 6. App schema, starting data, time zone 💻

The tables in the data model below, one migration, the after-sign-up hook that copies the six families and starting activity types, and a settings page with the time zone. A `db:seed` script that fills the local database with made-up tasks and sessions.

**Done when:** a fresh sign-in gets its families and types, the time zone saves, and a database test proves a session can't be saved with another user's activity type (the composite foreign key from E6).

### 7. The Server Action helper and the day helpers 💻

The E6 helper, and `src/lib/days.ts`: today's local date in a zone, and whole days between two local dates. These are the two pieces every later step leans on, so they get the most thorough tests: signed-out calls refused, malformed input refused, the 11pm New York case lands on the right day, and the day the clocks change.

**Done when:** tests cover all of the above, each was seen failing once on purpose, and `ARCHITECTURE.md` explains the pattern with one real example.

### 8. Deploy the skeleton 🔑 💻

The walking skeleton from E2.

**Ryan needs to, in his accounts:**
- Create the Neon project (free plan) in the same region as Vercel's functions (Vercel's default is Washington, D.C., `iad1`; pick Neon's AWS US East 1 to match; verify both when clicking through). Copy the connection string.
- Create the Vercel project from the GitHub repo. Add `DATABASE_URL`, `BETTER_AUTH_SECRET` (a new one, not the local one), `BETTER_AUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `ALLOWED_EMAILS` as Sensitive variables, scoped to Production only.
- Add the production callback URL to the Google OAuth client.
- Push `main`. This is the first production deploy.

Claude does the build-command change (migrate, then build, production only) and writes the checklist above into `DEVELOPMENT.md` before Ryan starts clicking.

**Done when:** Ryan signs in on the production URL, the migrations ran in the build log, and the first-load time after 10 idle minutes is measured and written down (that's the Neon cold start, E4).

### 9. CI on GitHub 💻 🔑

A GitHub Actions workflow that runs typecheck, lint, format check, and tests on every push, with a Postgres service container for the database tests. Free for public repos. Small, and it's the only automated check between a push and production. Ryan can cut it if he'd rather not; it's the one step here that isn't on the roadmap.

**Ryan needs:** to push, and look at the first run.

**Done when:** the workflow is green on `main` and fails visibly on a deliberately broken test on a branch.

### 10. Colors 💻

The roadmap's open item: five family colors, rest, and the to-do colors including the amber tint, for light and dark mode. A small script checks contrast against the background and between every pair of families (split squares, [0016](./adr/0016-split-two-activity-days-diagonally.md)), and fails if any pair is too close. Claude makes a mockup with made-up data; Ryan picks.

**Done when:** the values live as CSS variables, the script runs in `npm test`, the ADR follow-ups in [0014](./adr/0014-movement-grid-families-and-activity-types.md) and [0025](./adr/0025-task-states-three-shapes-three-meanings.md) are closed by a new ADR with the chosen values, and Ryan has approved them.

### 11. Log a session, and rest/sick 💻

The log form: pick an activity type (grouped by family), date defaults to today, optional one-line note. Edit and delete a logged session. Rest and sick through the same form. Fast on a phone: a couple of taps for the common case ([0015](./adr/0015-a-session-happened-or-it-didnt.md), design principle 8).

**Done when:** logging takes two taps plus "save" on a phone-sized screen, and tests cover the date logic and ownership.

### 12. The movement grid 💻

One function decides a square's look from a day's sessions (one family, a diagonal split, P3 for three, rest outline, empty). The grid renders 52 weeks, every square has a text description for hover, tap, and screen readers ([0014](./adr/0014-movement-grid-families-and-activity-types.md)), and tapping a day lists its sessions.

**Done when:** the color function has tests for every case, the grid reads correctly with a screen reader, and nothing in it counts streaks or misses ([0013](./adr/0013-no-streaks-nudges-or-step-tracking.md)).

### 13. Import the pre-app log 💻, then 🔑

The E10 import page, tested with a made-up CSV.

**Ryan needs:** to export his real log to CSV, keep it in `private/` or outside the repo, and paste it into the import page in production. This is the first real health data in the app.

**Done when:** the made-up import works locally, then Ryan's real grid is filled in production.

*At this point the grid half of v1 is in daily use.*

### 14. To-do list, part 1 💻

Add, edit, delete, and finish tasks (with Undo). Backlog and current list, moving between them. The two clocks and their labels, optional due dates in the boxed style, and "Was due" ([0021](./adr/0021-two-clocks-and-optional-due-dates.md), [0025](./adr/0025-task-states-three-shapes-three-meanings.md)). The "Getting old" group with move, keep (P2), and delete ([0024](./adr/0024-getting-old-group-at-the-top-of-the-backlog.md)). The rules ("is this stale," "is this getting old," "what does this label say") live in `src/lib/tasks/` as pure functions.

**Done when:** every rule has tests with a fixed date and time zone, and the labels match the wording in [0025](./adr/0025-task-states-three-shapes-three-meanings.md) exactly, screen reader text included.

### 15. To-do list, part 2 💻

The current list's order: drag on desktop, long press on a phone, and a keyboard alternative. New tasks land at the bottom. The soft cap divider after task 6 with the amber tint below it, the stale label, and the deal-with-it-first flow with done, back to backlog, and keep (P1) ([0022](./adr/0022-current-list-never-resets-soft-cap-and-stale-label.md), [0023](./adr/0023-deal-with-stale-tasks-before-adding.md)).

**Done when:** reordering works with mouse, touch, and keyboard; the add flow shows stale tasks first and is never a wall; and nothing is blocked past the cap.

### 16. The daily screen 💻

Put it together: desktop shows the current list and the grid side by side with a way to log; the phone leads with the grid, then logging, then the list ([0012](./adr/0012-web-app-desktop-first-pwa-later.md)). Tap targets at least 44px tall.

**Done when:** Ryan has used it on both for a few mornings and anything that annoyed him is fixed or on the roadmap.

### 17. v1 wrap-up 💻

`ARCHITECTURE.md` rewritten to describe what exists, file by file. README screenshots made from the seed data. `CLAUDE.md`'s "Where it stands" and Known traps updated. The roadmap's v1 ticked. Then `/audit` in a fresh session, and its findings sorted into fix-now or roadmap.

**Done when:** an engineer clicking the repo link can understand what Home Base is and how it's built from the README and docs alone, and the audit found nothing that blocks calling it v1.

---

## The data model

What step 6 builds. Every table holding user data has `userId`, and every foreign key to another user-owned row includes `userId` too (E6). Times are `timestamptz` (a UTC moment); "which day" fields are `date` (a calendar date with no time), computed in the user's time zone ([0010](./adr/0010-store-each-sessions-local-date-and-utc-time.md)).

**Better Auth's tables** (`user`, `session`, `account`, `verification`) are generated by its CLI. OAuth tokens in `account` are encrypted ([0008](./adr/0008-better-auth-with-google-and-encrypted-tokens.md)).

**`user_settings`**: `userId` (primary key), `timeZone` (an IANA name like `America/New_York`).

**`family`**: `id`, `userId`, `key` (`strength`, `yoga`, `walking`, `skate`, `play`, `rest`), `name`, `colorKey`, `position`. Unique on (`userId`, `key`). Six rows per user, copied at sign-up.

**`activity_type`**: `id`, `userId`, `familyId`, `name`, `archivedAt` (nullable, so a type can be retired without breaking old sessions). Unique on (`userId`, `name`). Foreign key (`familyId`, `userId`) → `family`.

**`logged_session`**: `id`, `userId`, `activityTypeId`, `localDate`, `loggedAt`, `note` (nullable, one line). Index on (`userId`, `localDate`) for the grid. Foreign key (`activityTypeId`, `userId`) → `activity_type`. Named `logged_session`, not `session`, because Better Auth's `session` table means "who's signed in."

**`task`**:

| Column | Type | Meaning |
| --- | --- | --- |
| `id`, `userId` | | Owner, as everywhere |
| `title` | text | The task |
| `list` | `backlog` or `current` | Which list it's on |
| `position` | integer, nullable | Order on the current list; null in the backlog |
| `createdAt` | timestamptz | Starts the age clock. Never changes |
| `enteredCurrentListAt` | timestamptz, nullable | Starts the current-list clock. Set on each move to the current list, cleared on leaving ([0021](./adr/0021-two-clocks-and-optional-due-dates.md)) |
| `dueDate` | date, nullable | Optional deadline |
| `completedAt` | timestamptz, nullable | Set when done. Done tasks leave both lists |
| `staleKeptOn` | date, nullable | The day "keep, I'm on it" was tapped (P1) |
| `oldKeptUntil` | date, nullable | Out of "Getting old" until this date (P2) |

Reordering rewrites the `position` of every task on the current list in one transaction. The current list is short (6, give or take), so that's a handful of rows, and it's simpler than the clever schemes for long lists.

## What this plan leaves for later

Logged here so it isn't forgotten, and added to the roadmap when the plan is approved:

- An end-to-end browser smoke test (E7). Later phase.
- If the Neon cold start turns out to annoy: a paid plan or a keep-warm ping. Already Parked on the roadmap.
- Better error logging than Vercel Hobby's 1 hour of runtime logs ([0007](./adr/0007-host-on-vercel-hobby.md)). Parked until a bug actually gets lost.

## Change log

- 2026-11-18: drafted, waiting on Ryan's approval.
- 2026-11-18: approved as written, every recommendation taken. Step 1 done: decisions recorded as ADRs 0026 to 0039 (E1 to E10 are 0026 to 0035, P1 to P4 are 0036 to 0039).
