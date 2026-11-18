# Home Base: the product

*Last updated: 2026-11-18*

What Home Base is, who it's for, and the principles every feature is checked against. This is the public version of the private product brief written at kickoff ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)). Where they disagree, this file and the ADRs win. Decisions live in [`adr/`](./adr/); this file describes the product they add up to.

## Why this exists

Home Base is a personal daily dashboard: one screen to start the day on, so the day has a shape before it has a chance to wander. Working name; it can change.

The first driver is movement. Exercise has failed before when it was a side quest bolted onto an unchanged life. This time it's a lifestyle shift, and the app exists to support that shift, not to replace it.

Ryan works best with clear goals and visible progress. GitHub's contribution graph and Duolingo kept him coming back because the progress was visible. Home Base applies that to movement first, then wraps the rest of the morning around it: today's plan, today's calendar, today's focus.

It's also a long-term engineering project, built and maintained the way Snippr is, and a possible portfolio piece.

**Success looks like:**

- Ryan opens Home Base most mornings without being reminded.
- The movement grid fills in, across more than one color family.
- Strength numbers go up over months.
- The codebase is something he can walk an interviewer through with confidence.

## Design principles

The screen shows the day, records what happened, and rewards showing up. It never nags. Every feature gets checked against these:

1. **No new ways to fail.** No streak counters, no "you're behind" messages, no social deadlines. A missed day is just an empty square. One deliberate exception: the to-do list, where Ryan opted into some pressure. The movement grid never gets any ([0013](./adr/0013-no-streaks-nudges-or-step-tracking.md)).
2. **The grid is the reward.** Seeing a cluster of filled days is the motivation. Nothing else needs to keep score.
3. **Finite, not infinite.** Every panel ends. Five headlines, not a feed. A few flagged emails, not an inbox. Too many options means wandering, and wandering means bedtime.
4. **Trust the user.** Ryan logs his own sessions and the app believes him. No auto-imports deciding what counts ([0017](./adr/0017-trust-logged-sessions.md)).
5. **Rest is legitimate.** Rest and sick days get their own marker, so a sick week reads as "I was sick," not "I did nothing."
6. **Facts, not pressure.** Insights like "Strength: 6 days ago" are stated plainly, never as warnings.
7. **The app supports the habit, it doesn't gate it.** Logging can start before any code exists, in a phone note or on a paper calendar. The app imports that history, so the grid is already filled in when it ships.
8. **Logging takes seconds.** A planned session is one tap. An unplanned one, like a skate session or a walk, is a couple of taps on the phone: pick the type, done. If logging is slow it gets skipped, and then the grid lies.

## Scope and users

One user to start: Ryan. The design is multi-user-ready, so going public later doesn't mean tearing up the foundation: every record has an owner, login is real from day one, settings are data, each user has a time zone, and integration tokens are stored per user and encrypted ([0011](./adr/0011-single-user-multi-user-ready.md)).

**Deferred until there's a reason:** signup flow, billing, admin tools, scaling work, Google app verification.

## The daily screen

The morning view answers "what am I doing today?" at a glance. Features are tiered by how strongly they earn a spot; [the roadmap](./ROADMAP.md) says when each ships.

| Feature | Tier | What it shows |
| --- | --- | --- |
| Running to-do list | Core | A backlog plus a short current list. One of the most important parts of the app. |
| Today's workout | Core | The planned session from Ryan's program, with a one-tap "done" that fills in the grid. |
| Movement grid | Core | The GitHub-style color-coded grid. |
| Strength progress | Core | Weights and reps over time. |
| Today's calendar | Core | Today's events only, read-only. |
| Building grid | Core | Ryan's GitHub contributions, next to the movement grid. |
| One line for today | Probable | A single focus for the day, written in the morning. |
| Weather | Probable | Today's forecast. Decides whether movement happens outside. |
| News | Probable | A few chosen sources, a fixed number of headlines, then it ends. |
| Lab results | Maybe | Numbers from routine bloodwork, logged by hand and charted over time. Slow feedback on whether the lifestyle change is working. |
| Quote | Maybe | One line, possibly from a collection Ryan writes or saves himself. |
| Email | Deprioritized | At most a count plus flagged threads ([0019](./adr/0019-build-gmail-last.md)). |
| Evening check-in | Maybe | An optional close to the day. Undefined so far. |

## The to-do list

Built into Home Base, not synced from another app, so it follows Home Base's principles instead of another app's red overdue badges. It ships in v1 ([0020](./adr/0020-built-in-to-do-list-backlog-and-current-list.md)).

**Two lists.**

- **Backlog:** everything that needs doing, however long it gets. This is the one place Ryan is fine feeling some pressure.
- **Current list:** the short set of tasks he's working on now, pulled from the backlog. The daily screen shows this first. Tasks can move back to the backlog and out again.

**Two kinds of dates, shown differently** ([0021](./adr/0021-two-clocks-and-optional-due-dates.md)).

| Property | Age | Time on current list | Due date |
| --- | --- | --- | --- |
| What it is | Days since the task was created | Days since the task last entered the current list | A deadline Ryan adds himself |
| Default | Every task has one | Every task on the current list has one | Optional, off by default |
| Where it shows | Backlog | Current list, once it hits 2 days | Anywhere the task appears |
| Resets? | Never | Yes, each time the task re-enters the current list | Only if Ryan changes it |
| Purpose | Gentle pressure on tasks that sit around, plus a nudge at 10+ days | A push to finish or move tasks that stall | Real deadlines, like paying a bill |

Age counts from creation, so bouncing a task between lists never hides how old it really is. Time on the current list counts from the latest entry, so a task moved back to the backlog and later re-added starts fresh. Each kind of date needs its own visibly different style, so a pressure number is never mistaken for a deadline.

**Current list rules** ([0022](./adr/0022-current-list-never-resets-soft-cap-and-stale-label.md), [0023](./adr/0023-deal-with-stale-tasks-before-adding.md)).

1. **It never resets.** Tasks stay until Ryan finishes them or moves them back to the backlog.
2. **Ryan sets the order.** Drag to reorder; new tasks land at the bottom.
3. **Soft cap of 6.** A dashed line after the sixth task reads "past 6: probably not today," and tasks below it sit on a pale amber tint (not yellow, which is yoga's color on the grid). Nothing is blocked. Since new tasks land at the bottom, a new task added to a full list arrives past the cap.
4. **Stale after 2 days.** A task on the current list for 2+ days gets a quiet label, like "on the list 3 days," in its own style.
5. **Deal with it first.** While any task is stale, tapping "add" first shows the stale tasks with three buttons: done, back to backlog, or "keep, I'm on it." One tap each, then the add form opens. Friction, not a wall.
6. **Moving a task back to the backlog** returns it to normal backlog behavior, where its age still counts from creation.

**Backlog rule** ([0024](./adr/0024-getting-old-group-at-the-top-of-the-backlog.md)). Tasks 10+ days old float into a "getting old" group at the top of the backlog, with quick buttons: move to current list, keep, or delete. It's visible whenever Ryan looks at the backlog and never pops up on its own.

**How the states look** ([0025](./adr/0025-task-states-three-shapes-three-meanings.md)). Three shapes, three meanings. A deadline is a boxed date with a calendar icon ("Due Fri, Nov 20"; a missed one says "Was due Mon, Nov 16" with no red). A pressure number is quiet italic text with an hourglass that always counts days ("on the list 3 days," "12 days old"). The cap is a line in the list, not a badge on a task.

## The movement grid

One square per day, colored by the kind of movement. Variety shows up at a glance, so "I've been avoiding strength" is something Ryan sees, not something he has to work out ([0014](./adr/0014-movement-grid-families-and-activity-types.md)).

| Family | Color | Activity types |
| --- | --- | --- |
| Strength | Blue | Dumbbell sessions, bodyweight work |
| Yoga | Yellow | Yin, flow, any other style added later |
| Walking | Green | Intentional walks, hikes |
| Skate | Orange | Skateboarding |
| Play | Purple | Rock climbing, racquet sports, pickup basketball, anything else |
| Rest / sick | Gray outline | Not movement, but not a blank either |

Activity types are rows in the database, each pointing at a family. Adding "swimming" next summer is a data change, not a code change.

**No "how much."** A session happened or it didn't. Every day in a family gets the same flat color; subtypes show on hover or tap, in the breakdown chart, and in the "last done" line. The color logic lives in one function, so this stays cheap to change ([0015](./adr/0015-a-session-happened-or-it-didnt.md)).

**Two-activity days split the square diagonally.** For the rare three-activity day, the square shows two and the details list the rest ([0016](./adr/0016-split-two-activity-days-diagonally.md)).

**What counts.** Any session Ryan logs counts; the app doesn't second-guess him. A walk counts when it's intentional, not when it's getting around the city. Steps aren't tracked at all ([0017](./adr/0017-trust-logged-sessions.md)).

**Which day.** A session lands on the day it happened in Ryan's time zone, not the server's ([0010](./adr/0010-store-each-sessions-local-date-and-utc-time.md)).

**Accessibility.** Color is never the only signal. Every square has a text description on hover, tap, and for screen readers.

**Prior art that shaped this:**

- [Strava's Training Log](https://support.strava.com/hc/en-us/articles/206535704) colors each sport type differently and filters by type.
- [Garmin Connect users pushed back](https://forum.slowtwitch.com/t/garmin-connect-calendar-activity-color-schemes-removed/798849) when activity colors were removed from the calendar, because the colors showed whether training was balanced.
- [intervals.icu](https://forum.intervals.icu/t/customise-calendar-colours/5642) pairs a color per sport with an optional intensity scale.
- [Gentler Streak](https://apps.apple.com/us/app/gentler-streak-fitness-tracker/id1576857102) lets users mark rest, sick, or injured days so recovery doesn't read as failure.

## Planned vs. logged sessions

The app keeps two separate things: what Ryan planned to do, and what he actually did. The grid only ever reads what he did.

- **Planned session:** comes from his program, like "Wednesday: upper body, rows, presses, curls." It shows up as today's workout.
- **Logged session:** what happened, like "Upper body, rows at 15 lb." This is what fills a square.
- **Completing a plan** creates a logged session linked to it, prefilled so it's one tap.
- **Skipping a plan** creates nothing. There is no "missed" state, per the first design principle.
- **Unplanned sessions,** like a skate session or a walk, are logged directly with no plan behind them.

How the program itself is stored (a weekly template, a list of dated sessions, or something else) is the trickiest data-modeling question in the app, and it's still open. It isn't needed until v3, so v1 ships without answering it.

## Progress and insight

The grid shows consistency; these show growth and balance (v2).

- **Strength progress.** Each strength session logs exercises, weight, sets, and reps. Charts show each lift over time.
- **Last done, per family.** One quiet line each, like "Strength: 6 days ago." A fact, not a warning.
- **Breakdown.** How recent movement splits across the five families, so balance is visible beyond the grid.
- **Session notes.** An optional one-line note per session, like a commit message: "Felt strong, bumped to 20 lb rows." Inspired by [CommitLife](https://apps.apple.com/us/app/commitlife/id6762560133), which frames habits as commits.

**Why balance matters.** The [HHS Physical Activity Guidelines, 2nd edition](https://pmc.ncbi.nlm.nih.gov/articles/PMC9582631) treat aerobic activity and muscle-strengthening as separate requirements for adults: at least 150 minutes of moderate aerobic activity a week, plus strength work on 2 or more days. They also advise inactive people to start low and increase gradually. The color families make both visible without turning them into targets.

## Platform

A web app, designed desktop-first, with a phone layout that leads with the grids ([0012](./adr/0012-web-app-desktop-first-pwa-later.md)).

- **Desktop** is where the full morning dashboard lives.
- **Phone** is for quick checks: the grids first, then logging a session in a few taps, ideally right after it ends.
- **PWA later.** A progressive web app is a regular website that can be installed from the phone's browser to the home screen, where it opens full-screen with its own icon. Same codebase, no app store. v4.
- **No native app** for now. Nothing on the feature list requires one.

The stack is in ADRs [0004](./adr/0004-one-nextjs-app-with-server-actions.md) to [0010](./adr/0010-store-each-sessions-local-date-and-utc-time.md).

## Integrations

Each integration is a separate module the app works fine without. Email is last because it's the most expensive one to take public.

| Integration | Priority | Notes | Verified? |
| --- | --- | --- | --- |
| Google Calendar | High (v3) | Read today's events via Google OAuth, using the narrowest read-only scope, on the same Google account used to sign in ([0009](./adr/0009-one-google-account-with-incremental-consent.md)). Calendar scopes are sensitive, not restricted: verification to go public, no security assessment. Under the personal-use exception, no verification at all. | Tier from third-party docs ([Nylas](https://developer.nylas.com/docs/cookbook/calendar/google-calendar-oauth/)). Personal-use exception verified in Google's docs. |
| GitHub | High (v3) | Contribution data for the building grid via GitHub's GraphQL API: `contributionsCollection` → `contributionCalendar` → per-day `date` and `contributionCount`. One known quirk: [a developer reported](https://github.com/orgs/community/discussions/201216) a day where the API count didn't match the profile graph. | Yes, in [GitHub's GraphQL reference](https://docs.github.com/en/enterprise-server@3.17/graphql/reference/users). |
| Weather | Medium (v4) | Source not chosen. | Not yet |
| News | Medium (v4) | Likely RSS feeds from sources Ryan picks. Source not chosen. | Not yet |
| Gmail | Low, deprioritized | See below. | Yes, except the cost estimate. |

**Why Gmail is last** ([0019](./adr/0019-build-gmail-last.md)). Every Gmail scope that reads mail is restricted, including read-only and headers-only. Google's own scope table lists `gmail.readonly` and `gmail.metadata` as restricted. Going public with a restricted scope means restricted-scope verification, plus a security assessment by a Google-approved third party if the data is stored on or passes through a server, renewed at least every 12 months. One third-party source estimates about $500 a year; Google doesn't publish a price.

**The personal-use path.** Google exempts personal use: if Ryan is the only user, or one of a few people he knows, the app can skip verification. Each person clicks through an "unverified app" warning, and a cap limits how many Google accounts can connect. This is the path Home Base takes.

**The weekly re-login problem, solved.** In "Testing" status, refresh tokens expire after 7 days. Moving the app to "In production" status fixes that: refresh tokens then generally last until revoked or unused for about six months. Unverified apps can be in production with a 100-user cap. So the setup is: In production, unverified, personal use. No weekly re-login, no verification, no assessment.

Sources, all checked 2026-11-18: [Gmail API scopes](https://developers.google.com/workspace/gmail/api/auth/scopes) and [restricted scope verification](https://developers.google.com/identity/protocols/oauth2/production-readiness/restricted-scope-verification) (Google's personal-use and Testing exceptions, security assessment, 12-month renewal); [Google Health API OAuth setup](https://developers.google.com/health/setup) (7-day Testing tokens, production token lifetime, 100-user cap for unverified clients); [Unipile scopes guide](https://www.unipile.com/gmail-api-scopes-guide/) (cost estimate only, third-party).

## Out of scope

Out on purpose, not just postponed ([0013](./adr/0013-no-streaks-nudges-or-step-tracking.md)):

- **Streak counters** of any kind, including gentle ones. The grid is enough.
- **Relationship nudges** and social deadlines. Reminders to contact people add stress.
- **Step counting** and automatic activity imports.
- **A full email inbox.**
- **Infinite feeds** of any kind.
