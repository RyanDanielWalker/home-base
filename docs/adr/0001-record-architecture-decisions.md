# 0001. Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`README.md`](./README.md), [`0000-template.md`](./0000-template.md)

## In plain English

Any significant decision in Home Base gets a short written record of what was chosen, what wasn't, and why. The code will show *what* the app does. These records show *why*. They start before there is any code, so the reasoning is written down while it's fresh instead of reconstructed later.

## Context

Home Base was planned in a long kickoff conversation on 2026-11-18. That conversation produced a product brief with a decision log, plus a stack and auth recommendation that Ryan approved. None of that lived in a repository yet.

Snippr, Ryan's other long-term project, started its ADRs six months after its first build, and several choices were hard to explain by then ([Snippr ADR 0001](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0001-record-architecture-decisions.md)). Home Base gets to start with them.

The brief itself can't be the record in this repo: it contains health details and the repo is public ([0003](./0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).

An *Architecture Decision Record* (ADR) is a short numbered document about one decision. For example, [0006](./0006-use-drizzle-as-the-orm.md) says the app talks to the database through Drizzle, lists Prisma 5 and Prisma 7 as the options turned down, and says what the choice costs.

## Options considered

1. **Keep the decision log in a single document.** One file to read. But a table row has no room for the options weighed or the honest downside, and editing one row quietly rewrites history.
2. **ADRs in `docs/adr/`, one per decision, append-only.** Same format as Snippr, so the habits carry over. A little overhead per decision.
3. **No written record; let commit messages carry it.** Nothing to maintain. Commits explain a change, not a choice between options, and most of these decisions were made before any commit existed.

## Decision

Option 2. We keep ADRs in `docs/adr/` in the format from [`0000-template.md`](./0000-template.md), copied from Snippr. Each is numbered and append-only: a changed decision gets a new ADR that supersedes the old one.

Every row of the brief's 2026-11-18 decision log, and every stack and auth decision approved that day, is recorded here as ADRs 0002 to 0025. Related rows share an ADR where they were decided together; each ADR says which rows it covers.

## Consequences

- **Good:** The repo is the source of truth from the first commit. A reviewer, or Ryan six months from now, can see why the to-do list has two clocks without asking.
- **Good:** "We chose this on purpose" and "this is how it ended up" stay distinguishable.
- **Bad:** A small amount of overhead per significant change.
- **Bad:** ADRs 0004 to 0025 were accepted before any code existed. Some will meet reality and change. When they do, the new ADR says what was learned, which is the point.
- **Follow-ups:** `docs/DEVELOPMENT.md`'s definition of done includes checking whether a change needs an ADR.
