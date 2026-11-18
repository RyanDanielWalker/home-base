# 0010. Give each user a time zone, and store each session's local date plus a UTC timestamp

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0011](./0011-single-user-multi-user-ready.md), [0014](./0014-movement-grid-families-and-activity-types.md)

## In plain English

The grid puts each session in a day square. Which day is decided in your time zone, at the moment you log it, and that date is saved with the session. The exact moment is saved too, in UTC. So an 11pm walk in New York lands on the day you took it, not the next day.

## Context

**UTC** is the world's reference clock, with no time zone offset. Servers usually run on it. New York is 5 hours behind UTC in winter, so 11pm on Tuesday in New York is 4am Wednesday in UTC. If the grid used the server's clock, that walk would fill Wednesday's square. Nothing would crash; the square would just be quietly wrong.

The to-do clocks have the same problem: "on the list 2 days" depends on where midnight is.

## Options considered

1. **A time zone per user, plus a stored local date and a UTC timestamp per session.** The square a session lands in never changes after it's logged, even if Ryan later travels or changes his time zone setting. Cons: two date fields per row to keep straight.
2. **Store only a UTC timestamp, and compute the day at read time.** One field. But the day a session belongs to would shift if the time zone setting changed, and every query that groups by day has to do time zone math.
3. **Use the browser's time zone on every request, store nothing.** No setting to manage. Same shifting problem, and server-rendered pages don't know the browser's zone without extra work.

## Decision

Option 1.

- Each user has a time zone setting (an IANA name like `America/New_York`).
- Each logged session stores `localDate` (the calendar date in the user's time zone when it was logged, or the date the user picked) and `loggedAt` (a UTC timestamp).
- The grid reads `localDate`. Nothing else decides which square a session is in.
- Day-based rules elsewhere (stale after 2 days, backlog age) compute "today" in the user's time zone through one helper.

## Consequences

- **Good:** The grid is right on the day you log, and stays right.
- **Good:** Imported history from before the app (a phone note or paper calendar) only has dates, and fits `localDate` directly.
- **Bad:** Two fields can disagree if one is written carelessly. Tests cover the late-night case.
- **Follow-ups:** none.
