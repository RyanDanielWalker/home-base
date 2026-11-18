# Development guide

How work on Home Base gets done. Setup instructions arrive with the first code; until then this covers the workflow.

## Setup

Not yet: there is no application code. The approved [v1 build plan](./V1-BUILD-PLAN.md) sets it up in steps 3 to 5: Node, then Postgres in Docker for local development ([0028](./adr/0028-run-postgres-in-docker-for-local-development.md)), then a Google OAuth client and a local `.env`. This section gets the exact commands in the same commits that add them.

## How a change gets made

Home Base is built with Claude Code, the same way as Snippr ([0002](./adr/0002-carry-over-snippr-working-rules.md)).

1. **Pick the work.** `/next` takes the first unchecked item in the current phase of [`ROADMAP.md`](./ROADMAP.md), or the item you name. Items in "Before v1" need Ryan in the loop and aren't picked automatically.
2. **Decide before building.** A mechanical change gets a short plan and goes. A real decision (a new dependency, a data model change, a trade-off) gets 2 or 3 options in plain English and a recommendation, and waits for Ryan. Big decisions get an ADR.
3. **Build and test.** Logic worth testing goes in plain TypeScript modules with the database passed in, so tests run against fakes. After tests pass, break the code on purpose once and confirm a test fails.
4. **Keep the docs true.** Tick the roadmap item. Fix `ARCHITECTURE.md`, `PRODUCT.md`, or this file if the change made them wrong.
5. **Commit, never push.** Small Conventional Commits (`feat:`, `fix:`, `docs:`, ...), subject says what, body says why, one commit per logical change. Claude can't run `git push`: `.claude/settings.json` denies it.
6. **Review cold.** Read the diff as someone who didn't write it.
7. **Report.** Open with "Needs you," then what shipped.
8. **Ryan reviews and pushes.** `git log origin/main..HEAD` shows what's waiting. A push to `main` deploys to production once Vercel is connected.

`/audit`, in a fresh session, reviews the whole repo as an outsider would and reports without fixing anything.

## Definition of done

- The roadmap item is ticked, and anything discovered along the way is a new roadmap item.
- Docs that the change made wrong are fixed in the same commits.
- A significant decision has an ADR ([`adr/README.md`](./adr/README.md) says when).
- No real data anywhere in the diff: fixtures, seeds, and screenshots are invented ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).
- Checks pass (once they exist): typecheck, lint, tests, build.

## Privacy

The repo is public and the app holds health data ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)). Real data never goes in the repo. Keep private files (the product brief, an export of your log) in a `private/` folder at the repo root, which `.gitignore` ignores, or outside the repo entirely.
