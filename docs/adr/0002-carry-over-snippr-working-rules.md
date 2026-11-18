# 0002. Carry over Snippr's working rules, guardrails, and credit

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** `CLAUDE.md`, `.claude/settings.json`, `.claude/skills/next/SKILL.md`, `.claude/skills/audit/SKILL.md`, Snippr ADRs [0033](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0033-write-docs-to-learn-from-and-leave-nothing-for-ryan.md), [0034](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0034-block-git-push-and-env-reads-with-permission-rules.md), [0054](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0054-credit-claude-in-the-readme-not-on-every-commit.md)

## In plain English

Home Base is built with Claude Code the same way Snippr is. Claude commits but never pushes, finishes work instead of leaving pieces for Ryan, writes docs to be learned from, and leaves no co-author lines on commits. The README says once that the project is built with Claude Code. These rules are copied from Snippr on purpose, along with the settings that enforce them and the two skills that run the work.

## Context

Ryan wants the same working setup in Home Base as in Snippr (said 2026-11-18). Snippr arrived at its rules over several weeks, each with its own ADR. Copying the result is cheaper than relearning it.

Three terms matter here:

- A **deny rule** in `.claude/settings.json` refuses a matching command before it runs, whatever Claude decides. For example, `Bash(git push *)` refuses `git push origin main`. An **allow rule** runs a matching command without asking, like `Bash(npm test *)`.
- A **commit trailer** is a line at the end of a commit message that tools read as data. Claude Code adds `Co-Authored-By: Claude ...` by default, and GitHub then shows the commit as written by two people.
- A **skill** is a saved set of instructions Claude Code runs when you type its name. `/next` here is a file at `.claude/skills/next/SKILL.md`.

## Options considered

1. **Copy Snippr's rules and settings, adapted to Home Base.** One ADR explains them. The rules that mention Snippr-specific things (Prisma, Route Handlers, Supabase) get rewritten for this stack, not copied blindly.
2. **Link to Snippr's ADRs and copy nothing.** Less text. But rules outside this repo don't travel with it, and a reader here couldn't see how the work is done.
3. **Start fresh and let rules emerge.** Nothing to copy. Repeats lessons already paid for.

## Decision

Option 1. From Snippr, adapted:

- **Commit, never push.** `.claude/settings.json` denies `git push` (including `git -C <folder> push`) and reading `.env` or `.env.local`. It allows read-only git commands and the checks (`npm test`, `typecheck`, `lint`, `format:check`, `build`) without asking. Everything else, including `git commit`, still asks.
- **No co-author lines.** `attribution.commit` and `attribution.pr` are `""` and `attribution.sessionUrl` is `false`, so commits show Ryan as the only author. The README credits Claude Code once, in "How it's built." The first commit was made from a Claude cloud session, where this file doesn't apply yet, so the same rule was followed by hand.
- **Nothing is left for Ryan to fill in** unless he asks in words. No `TODO(ryan)`, no exercises.
- **Docs and ADRs are thorough, not padded.** A new term gets a plain definition and a small example.
- **The repo carries the context, not the chat.**
- **Every end-of-task report opens with a "Needs you" block.**
- **`/next`** picks the next roadmap item and takes it to reviewed commits, stopping before push. **`/audit`** is a fresh-session review that reports and doesn't fix.

Left out for now: Snippr's migration-branch rule ([Snippr 0038](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0038-push-commits-with-a-migration-to-a-branch-first.md)) and its local-database guard script ([Snippr 0015](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0015-local-postgres-in-docker-for-development.md)). Both depend on how migrations and local development are set up here, which the v1 build plan decides. They're on the roadmap so they aren't forgotten.

## Consequences

- **Good:** Ryan gets the working rapport he already trusts, from the first commit.
- **Good:** The guardrails are in the repo, so every Claude session here follows them, in the terminal or the desktop app.
- **Bad:** Deny rules match command text, so they're a strong guardrail, not a sealed wall. A script that runs `git push` inside it would get through. Ryan's review before pushing is still the real check.
- **Bad:** The history won't mark which commits Claude worked on. A reader takes the README's word for it.
- **Follow-ups:** decide the migration workflow and local database setup in the v1 build plan, then update `CLAUDE.md` and `/next` to match.
