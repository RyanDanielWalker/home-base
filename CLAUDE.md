# Home Base

A personal daily dashboard: one screen to start the day on. v1 is a to-do list, session logging, and a GitHub-style movement grid. It's a long-term build and a possible portfolio piece, so the code, the docs, and the reasoning are all part of what's being shown. Treat quality and explainability as requirements, not extras.

**Where it stands:** planning, pre-v1. The stack and auth are decided (ADRs 0004 to 0010). There is no application code yet. The numbered v1 build plan in `docs/V1-BUILD-PLAN.md` was approved on 2026-11-18 (ADRs 0026 to 0039). Build from it in order, starting at step 3.

## Read first

- `docs/ROADMAP.md`: what's planned, in what order, and what's still open
- `docs/V1-BUILD-PLAN.md`: the approved v1 build plan, its steps in order, and which steps need Ryan's accounts
- `docs/adr/`: why it's built this way. Check here before proposing a change to something that looks odd; it may be deliberate.
- `docs/PRODUCT.md`: what the app does and the design principles every feature is checked against
- `docs/ARCHITECTURE.md`: how the system fits together (planned until v1 code lands)
- `docs/DEVELOPMENT.md`: how work gets done, and setup once there is something to set up

## Stack

Decided, not yet installed: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Postgres on Neon (Docker locally), Drizzle ORM with the `pg` driver, Better Auth with Google sign-in, Zod, dnd-kit, Vitest, deployed on Vercel Hobby. Reads happen in Server Components, writes in Server Actions through one helper, and business rules live in plain TypeScript modules (ADRs 0004, 0028 to 0034).

## Commands

None yet. When the app is scaffolded, this section lists `dev`, `build`, `lint`, `typecheck`, `test`, and the database commands, in the same commit that adds them.

## Rules for changes

- **Commit, never push.** Work on local `main` in small commits. Ryan reviews (`git log origin/main..HEAD`) and pushes. A deny rule in `.claude/settings.json` stops Claude from running `git push` (ADR 0002).
- **Nothing is left for Ryan to fill in.** No `TODO(ryan)` markers, exercises, or work held until he writes a piece himself, unless he asks for that in words. He learns by building with Claude, reading the docs, and studying on his own (ADR 0002).
- **Commits show Ryan as the only author.** No `Co-Authored-By` lines and no session links; `.claude/settings.json` turns them off. The README credits Claude Code once (ADR 0002).
- **Small commits** using Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`, `style:`). Subject says what, body says why. One commit per logical change, even when it spans several layers.
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

- Better Auth stores OAuth tokens unencrypted unless `account.encryptOAuthTokens: true` is set. It must be set from the first commit that configures auth (ADR 0008).
- Neon's free plan suspends the database after 5 minutes idle, so the first request after a quiet stretch is slow. That's expected, not a bug (ADR 0005).
- A day boundary computed on the server is in UTC. An 11pm walk in New York is already tomorrow in UTC. Always compute the local date in the user's time zone (ADR 0010).
