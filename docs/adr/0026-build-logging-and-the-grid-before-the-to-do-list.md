# 0026. Build logging and the grid before the to-do list

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [`V1-BUILD-PLAN.md`](../V1-BUILD-PLAN.md) (E1), [0020](./0020-built-in-to-do-list-backlog-and-current-list.md), [0027](./0027-deploy-a-walking-skeleton-early.md), [0035](./0035-import-the-pre-app-log-through-a-page.md)

## In plain English

v1 has two halves: logging sessions with the movement grid, and the to-do list. The grid half gets built first, because it's smaller, so something real ships sooner and the paper log can stop sooner. The to-do list follows straight after, still inside v1.

## Context

The roadmap lists v1's items but not their order. The thing most likely to kill Home Base is taking too long to become useful ([`ROADMAP.md`](../ROADMAP.md)).

The two halves are not the same size. [0020](./0020-built-in-to-do-list-backlog-and-current-list.md) already notes that the to-do list is most of the v1 work: two lists, two clocks, due dates, a soft cap, stale labels, a "deal with it first" flow, a "getting old" group, and drag to reorder. The grid half is a log form, one color function, and a grid.

Until logging exists, Ryan keeps his log in a phone note or on paper (design principle 7), and that log gets imported once logging ships.

## Options considered

1. **Grid half first, then the to-do list.** Something usable ships sooner, and the paper log ends sooner with a smaller import. Cost: Ryan said he wouldn't open the app daily without the to-do list, so for a few weeks the app is "log and look," not the full morning.
2. **To-do list first.** The most-used part arrives first. The paper log runs longer, the import is bigger, and the first usable version is further away.
3. **Interleave**, a slice of each in turn. Feels balanced. More switching between two unrelated areas, and neither half is finished until the end.

## Decision

Option 1. Chosen by Ryan on 2026-11-18 ("let's go with your recs"). In the plan's step order: log a session (11), the grid (12), import (13), then the to-do list (14, 15) and the daily screen that combines them (16).

## Consequences

- **Good:** The first useful version is the smallest one, and the pre-app log stops early.
- **Bad:** Home Base isn't "the morning screen" until the to-do list lands. The early weeks are a logging app.
- **Follow-ups:** none.
