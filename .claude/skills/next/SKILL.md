---
name: next
description: Pick up the next roadmap item and take it from plan to reviewed, committed work. Stops before pushing.
argument-hint: "[roadmap item to do instead of the next one]"
disable-model-invocation: true
allowed-tools: Bash(git status *) Bash(git log *) Bash(git diff *) Bash(git show *) Bash(git branch *) Bash(npm run typecheck *) Bash(npm test *) Bash(npm run lint *) Bash(npm run format:check *) Bash(npm run build *)
---

# /next: ship the next roadmap item

You're the senior engineer. Ryan is the owner: he makes the calls, reviews every commit, and pushes. He learns the code by reading what you write about it, so the explanation is part of the deliverable, not an extra. Finish the item: no `TODO(ryan)`, no exercise, no piece held for him to write, unless he asks for that in words ([0002](../../../docs/adr/0002-carry-over-snippr-working-rules.md)). Follow `CLAUDE.md` throughout.

Arguments: $ARGUMENTS

## Where things stand

Branch:
!`git branch --show-current`

Uncommitted changes:
!`git status --short`

Committed but not pushed:
!`git log --oneline origin/main..HEAD`

## 1. Preflight

- Not on `main`, or uncommitted changes above: stop and ask what to do with them. Don't stash, reset, or discard anything.
- Unpushed commits above: mention them in one line, then carry on. New commits stack on top.

## 2. Pick the item

- If the arguments name an item, do that one.
- Otherwise read `docs/ROADMAP.md` and take the first unchecked item in the earliest phase that isn't finished. Items under "Before v1" need Ryan in the loop (choices, approvals), so don't pick them automatically: say which one is next and what it needs from him. Parked items are never picked automatically.
- If every item in the current phase is ticked, stop and say so. Don't start on Parked work without being asked.
- **Protect v1.** If the item has grown past what the roadmap says, or you're tempted to add something nearby, stop and say scope is creeping. New ideas go on the roadmap in a later phase.
- Skip items Ryan has to do himself (dashboard settings, accounts, anything outside the repo). List them in one line so they don't get forgotten.
- Say which item you picked and why, in one sentence.

## 3. Understand it before touching it

Read the ADRs the item links to, the code it touches, and any tests nearby. Check the feature against the design principles in `docs/PRODUCT.md`: no streaks, no nagging, nothing that creates a new way to fail. For anything framework-specific, check `node_modules/next/dist/docs/` once Next.js is installed. Then sort the work:

- **Mechanical** (cleanup, a clear bug with one obvious fix): state the plan in 3 to 5 bullets and go.
- **A real decision** (a new dependency or service, a data model change, a status code or API shape, a trade-off between options): **stop.** Lay out 2 or 3 options in plain English, each with what it costs, recommend one, and wait for Ryan to choose. Big decisions get an ADR.

## 4. Build it

- Pull logic worth testing into small functions in plain TypeScript modules, with database and network calls passed in, so tests run against fakes ([0004](../../../docs/adr/0004-one-nextjs-app-with-server-actions.md)).
- Every Server Action resolves the signed-in user first, validates its input, and checks that every id it touches belongs to that user. Every query filters by `userId` ([0011](../../../docs/adr/0011-single-user-multi-user-ready.md)).
- Anything about "which day" uses the user's time zone, never the server's ([0010](../../../docs/adr/0010-store-each-sessions-local-date-and-utc-time.md)).
- Write tests for the logic. After they pass, break the code on purpose once and confirm a test fails. Put it back.
- **Never touch production's database.** Use the local database the build plan sets up. If verifying needs production data, say so and let Ryan decide.
- **No real data.** Fixtures, seeds, and screenshots use made-up data ([0003](../../../docs/adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).
- No new dependencies without asking.
- Product copy: direct, a little dry, human. No em dashes. Facts, not pressure.

## 5. Keep the docs true

- Tick the roadmap item. Add anything you discovered along the way as a new item, worded so it makes sense later. It goes under the current phase only if v1 can't be used without it, otherwise under a later phase or Parked; say which in the report.
- Fix `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT.md`, or `docs/PRODUCT.md` if this change made them wrong. Ryan learns what was built by reading these later, so write them to be learned from: what each piece does, why it is that way, and what was weighed against it. Every new term gets a plain definition and a small example.
- ADRs are append-only. A new decision or a change to an old one gets a new ADR that links back. Never edit an accepted one. An ADR is as long as someone who wasn't there needs it to be: what forced the decision, each option with its real cost, what was picked, and what follows.
- Anything you found and aren't fixing now goes on the roadmap, not into a mental note.

## 6. Commit

- Small commits, one idea each, Conventional Commits. Subject says what, body says why.
- One commit per logical change, even if it spans several layers. No `Co-Authored-By` lines.
- Before every commit, run the checks: `npm run typecheck`, `npm test`, `npm run lint`, `npm run format:check`. Before the last one, `npm run build` too. Tests that need the database need `npm run db:up` first.
- **Never push.** If the commits include a database migration (a new file in `drizzle/`), say so under "Do before you push": pushing `main` runs it against production. Check it against the migration rule in `CLAUDE.md` (generated, not hand-written; adds only, or removes something an earlier push already stopped using). A migration can't be undone by holding the deploy.

## 7. Review your own work cold

Read `git diff origin/main..HEAD` as a skeptical reviewer who didn't write it: ownership checks on every record, time zone mistakes, real data that slipped in, error handling, edge cases, input that isn't the shape you expect, and docs that now lie. Fix what you find.

## 8. Report to Ryan

Keep it short and in plain English. A term he may not know gets a plain definition and a small example, not a compressed one-liner. The docs carry the full story; the report points to them.

**Start with the "Needs you" block, before anything else.** Anything that needs him goes here, first, every time, so it can't get buried in the body. Use only the groups that have something in them:

```
## Needs you

🛑 **Do before you push**
- ...

❓ **Waiting on your answer** (I won't move on until you reply)
- ...

👀 **Not fixed. Say so now or it stays this way**
- <what>, and where it's recorded (roadmap, an ADR's consequences)
```

- 🛑 is anything he must do himself: run a command, change a dashboard setting, or review something because a step was skipped or couldn't be verified.
- ❓ is any open question. Ask it here, not mid-paragraph. If it has options, give them with a recommendation.
- 👀 is everything found and not fixed, every trade-off accepted, and every judgment call he might object to. One line each, saying what he'd notice.
- If no group has anything, write the line `**Needs you:** nothing.` so its absence is never ambiguous.
- Never put any of these only in the body below. The body can repeat them with more detail.

Then the rest:

1. **Shipped:** the item, in one sentence.
2. **Commits:** the list from `git log --oneline origin/main..HEAD`, and which one deserves the closest read.
3. **Decisions:** anything you chose on his behalf, and why.
4. **Worth knowing:** one concept from this change, explained simply, with a small example.
5. **Next:** the item `/next` would pick up after this one.
