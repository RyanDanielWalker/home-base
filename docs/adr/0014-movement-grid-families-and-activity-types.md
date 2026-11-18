# 0014. Color the movement grid by five families plus rest, with activity types stored as data

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0011](./0011-single-user-multi-user-ready.md), [0015](./0015-a-session-happened-or-it-didnt.md), [0016](./0016-split-two-activity-days-diagonally.md), `docs/PRODUCT.md` (The movement grid)

## In plain English

The grid has one square per day, colored by the kind of movement: strength, yoga, walking, skate, or play, plus a gray outline for rest or sick days. Specific activities (like "rock climbing") are rows in the database that point at a family, so adding a new one is a data change, not a code change.

## Context

Covers the decision log rows "Five color families plus rest," "Activity types stored as data," and the rest/sick marker from design principle 5, "Rest is legitimate." All decided 2026-11-18.

The point of color is to make balance visible at a glance: "I've been avoiding strength" is something Ryan sees, not something he works out. Prior art that shaped this: Strava's Training Log colors by sport, Garmin Connect users pushed back when activity colors were removed, intervals.icu pairs a color per sport with intensity, and Gentler Streak gives rest and sick days their own marker. Links are in `docs/PRODUCT.md`.

## Options considered

1. **Five families plus rest, with activity types as rows pointing at a family.** Readable: about the limit before a calendar gets hard to read. New activities are data.
2. **One color per activity type.** More detail. Ten colors stop meaning anything at a glance.
3. **A hardcoded list of types and colors.** Simplest. A code change for every new activity, and impossible to vary per user ([0011](./0011-single-user-multi-user-ready.md)).

## Decision

Option 1.

| Family | Color | Activity types to start |
| --- | --- | --- |
| Strength | Blue | Dumbbell sessions, bodyweight work |
| Yoga | Yellow | Yin, flow, any style added later |
| Walking | Green | Intentional walks, hikes |
| Skate | Orange | Skateboarding |
| Play | Purple | Rock climbing, racquet sports, pickup basketball, anything else |
| Rest / sick | Gray outline | Not movement, but not a blank either |

Color is never the only signal: every square has a text description on hover, tap, and for screen readers.

## Consequences

- **Good:** Adding "swimming" next summer is one row.
- **Good:** A sick week reads as "I was sick," not "I did nothing."
- **Bad:** Families are fixed at five plus rest. A sixth family is a design decision, not just a row.
- **Follow-ups:** the exact color values come with the v1 visual system, checked for contrast in light and dark.
