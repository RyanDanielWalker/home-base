# Home Base

A personal daily dashboard: one screen to start the day on. v1 is a to-do list, session logging, and a GitHub-style movement grid. It's a long-term build and a possible portfolio piece, so the code, the docs, and the reasoning are all part of what's being shown. Treat quality and explainability as requirements, not extras.

**Where it stands:** building v1. The numbered v1 build plan in `docs/V1-BUILD-PLAN.md` was approved on 2026-11-18 (ADRs 0026 to 0039). Step 3 is done: the Next.js app is scaffolded with its checks, and its one page says "Home Base." There is no database, auth, or feature code yet. Build from the plan in order; step 4 (local database) is next.

## Read first

- `docs/ROADMAP.md`: what's planned, in what order, and what's still open
- `docs/V1-BUILD-PLAN.md`: the approved v1 build plan, its steps in order, and which steps need Ryan's accounts
- `docs/adr/`: why it's built this way. Check here before proposing a change to something that looks odd; it may be deliberate.
- `docs/PRODUCT.md`: what the app does and the design principles every feature is checked against
- `docs/ARCHITECTURE.md`: how the system fits together (planned until v1 code lands)
- `docs/DEVELOPMENT.md`: how work gets done, how to set up a fresh clone, and what each command does
- `AGENTS.md`: written by Next.js itself. It says this Next.js is newer than your training data, so read the guide in `node_modules/next/dist/docs/` before writing Next.js code. `next dev` re-adds it if it's deleted, so it stays committed.

## Stack

Installed: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, ESLint, Prettier, Vitest, on Node 24, and Drizzle ORM with the `pg` driver against Postgres 18 in Docker locally. Decided, not yet installed: Postgres on Neon in production, Better Auth with Google sign-in, Zod, dnd-kit, deployed on Vercel Hobby. Reads happen in Server Components, writes in Server Actions through one helper, and business rules live in plain TypeScript modules (ADRs 0004, 0028 to 0034).

## Commands

Run on Node 24 (`.node-version`; `fnm` or `nvm` picks it up). `docs/DEVELOPMENT.md` explains each one.

- `npm run dev`: the app at http://localhost:3000, reloading on save
- `npm run build`: the production build (also type-checks)
- `npm run lint`: ESLint. Any warning fails it (`--max-warnings=0`)
- `npm run typecheck`: generates Next.js's route types, then runs `tsc --noEmit`
- `npm test`: Vitest, once. `npm run test:watch` re-runs on save
- `npm run format:check`: Prettier, check only. `npm run format` rewrites files
- `npm run db:up` / `db:down`: start or stop the local Postgres in Docker. `db:down` keeps the data
- `npm run db:generate`: write a SQL migration from changes to `src/db/schema.ts`, into `drizzle/`
- `npm run db:migrate`: apply migrations that haven't run yet to the database in `DATABASE_URL`
- `npm run db:reset`: empty the local database and re-apply every migration. Refuses any host but localhost
- `npm run db:studio`: browse the database in Drizzle Studio

Before every commit: `npm run typecheck`, `npm test`, `npm run lint`, `npm run format:check`. Before the last commit of a task, `npm run build` too.

## Rules for changes

- **Commit, never push.** Work on local `main` in small commits. Ryan reviews (`git log origin/main..HEAD`) and pushes. A deny rule in `.claude/settings.json` stops Claude from running `git push` (ADR 0002).
- **Nothing is left for Ryan to fill in.** No `TODO(ryan)` markers, exercises, or work held until he writes a piece himself, unless he asks for that in words. He learns by building with Claude, reading the docs, and studying on his own (ADR 0002).
- **Commits show Ryan as the only author.** No `Co-Authored-By` lines and no session links; `.claude/settings.json` turns them off. The README credits Claude Code once (ADR 0002).
- **Small commits** using Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `style:`). Subject says what, body says why. One commit per logical change, even when it spans several layers.
- **Migrations: generate, never push, add before you remove.** Every schema change is a SQL file from `npm run db:generate`, committed with the schema change and read in review. Never run `drizzle-kit push` against a database that matters, and never edit a migration that's been pushed. From plan step 8, pushing `main` runs new migrations against production in the Vercel build, while the old code is still serving, so each migration must be safe for the code already running: adding tables and columns is fine; dropping or renaming one happens only in a later push, after an earlier push stopped using it. A commit with a migration gets flagged under "Do before you push" (ADR 0030).
- **Real data never goes in the repo.** This app holds health data. Seed data, fixtures, screenshots, and demos use made-up data. The private product brief is not committed (ADR 0003).
- **Every record has an owner.** Every table that holds user data has a `userId`, and every query filters by it. Never "all workouts," always "this user's workouts." Every Server Action resolves the signed-in user first and checks ownership of every id it touches, including foreign keys (ADR 0011).
- **Dates come from the user's time zone.** Which day a session or task belongs to is computed in the user's time zone, never the server's (ADR 0010).
- **Protect v1.** The biggest risk to this project is taking too long to become useful. New ideas go into a later phase on the roadmap unless Ryan says otherwise. Say so when scope is creeping.
- **Check features against the design principles** in `docs/PRODUCT.md`. No streaks, no nagging, nothing that creates a new way to fail. The to-do list is the one place Ryan opted into some pressure (ADR 0013).
- **Significant decisions get an ADR** in `docs/adr/`, committed alongside the change. ADRs are append-only; supersede, don't rewrite. An ADR is as long as someone who wasn't there needs it to be.
- **Keep docs true and thorough.** If a change makes `ARCHITECTURE.md`, `DEVELOPMENT.md`, `PRODUCT.md`, or the roadmap wrong, fix them in the same set of commits. Reading them later is how Ryan learns what was built, so they say what each piece does and why, not just that it exists.
- **The repo carries the context, not the chat.** Sessions get cleared between tasks. A decision, a trap, or a half-finished thread goes in the docs or the roadmap before the session ends.
- **Secrets** stay in `.env` (never committed) and Vercel Sensitive environment variables. Never log them.
- **Explain decisions.** Ryan makes the final call on direction. When there's a real fork in the road, lay out the options and trade-offs in plain language, recommend one, and wait.
- **Explain new terms.** A new term gets a plain definition and a small example the first time it comes up, in docs, ADRs, and reports. Never a compressed one-liner.
- **Every report at the end of a task opens with a "Needs you" block:** what Ryan must do before pushing, questions waiting on him, and anything noticed but not fixed. Or one line saying there is nothing. Format: `.claude/skills/next/SKILL.md`, step 8.

## Product copy

Direct, a little dry, human. No em dashes. No marketing filler ("seamless," "powerful," "unlock"). Facts, not pressure: "Strength: 6 days ago," never "You haven't done strength in 6 days!"

## Known traps

- The project runs on Node 24 (`.node-version`, and `engines` in `package.json`, which Vercel also reads). A bare `node` on Ryan's Mac may be Homebrew's Node 25, which is past end of life and outside Vitest 5's supported versions. `.npmrc` sets `engine-strict=true`, so `npm install` on the wrong Node fails loudly instead of installing quietly. In a non-interactive shell, run `eval "$(fnm env)" && fnm use` first.
- The local Postgres listens on port **5433**, not 5432, so it can run next to Snippr's. "Connection refused" usually means Docker Desktop isn't running, or `npm run db:up` hasn't been run (ADR 0028).
- Drizzle Kit and the scripts in `scripts/` read `.env` themselves, but a variable already set in the shell wins. A `DATABASE_URL` exported in the terminal silently overrides the local one.
- Better Auth stores OAuth tokens unencrypted unless `account.encryptOAuthTokens: true` is set. It must be set from the first commit that configures auth (ADR 0008).
- Better Auth stores session tokens as-is; only the signed session cookie protects them. Never enable its `bearer` plugin, and never reuse `BETTER_AUTH_SECRET` between development and production, without revisiting ADR 0040.
- Neon's free plan suspends the database after 5 minutes idle, so the first request after a quiet stretch is slow. That's expected, not a bug (ADR 0005).
- A day boundary computed on the server is in UTC. An 11pm walk in New York is already tomorrow in UTC. Always compute the local date in the user's time zone (ADR 0010).
