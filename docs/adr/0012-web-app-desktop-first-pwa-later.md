# 0012. Make it a web app, desktop-first and phone-friendly, with a PWA later

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0004](./0004-one-nextjs-app-with-server-actions.md), `docs/PRODUCT.md` (Platform)

## In plain English

Home Base is a website. The full morning dashboard is designed for a computer screen; on a phone, it leads with the grids and makes logging a session a couple of taps. Later it can be installed to the phone's home screen like an app, without an app store.

## Context

Covers the decision log row "Web app, desktop-first, phone-friendly; PWA later," decided 2026-11-18.

Ryan mostly starts his day at a computer, and checks the grids on his phone. Logging needs to work on the phone right after a session ends, or it gets skipped and the grid lies.

A **PWA** (progressive web app) is a regular website that can be installed from the phone's browser to the home screen, where it opens full-screen with its own icon. Same codebase, a manifest file and a little setup, no app store.

## Options considered

1. **Web app, desktop-first, phone-friendly; PWA in v4.** One codebase. Phone layout from v1. Install comes later.
2. **Native app.** Best phone experience. A second codebase and app store reviews, and nothing on the feature list needs native access, since steps aren't tracked ([0013](./0013-no-streaks-nudges-or-step-tracking.md)).
3. **PWA from day one.** Installable early. Adds setup to v1 that isn't needed to use it.

## Decision

Option 1. The PWA install is in v4.

## Consequences

- **Good:** One codebase, and v1 is usable on the phone.
- **Bad:** Until v4, logging from the phone means opening a browser tab, which is a little slower than tapping an icon.
- **Follow-ups:** none.
