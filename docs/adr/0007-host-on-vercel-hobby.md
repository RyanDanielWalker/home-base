# 0007. Host on Vercel's Hobby plan

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0004](./0004-one-nextjs-app-with-server-actions.md), Snippr [0002](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0002-nextjs-full-stack-on-vercel.md)

## In plain English

The app is deployed on Vercel, the company behind Next.js, on its free Hobby plan. Every push to `main` deploys, the same way Snippr works.

## Context

Next.js runs best on Vercel, and Snippr already deploys there, so the setup is known. Home Base has one user and small traffic.

From [Vercel's Hobby plan page](https://vercel.com/docs/plans/hobby), checked 2026-11-18: free, with monthly included usage (for example 1,000,000 function invocations and 4 CPU-hours), 5-minute maximum function duration, and **1 hour of runtime logs** (Pro keeps 1 day). Runtime logs are what the server printed while handling requests; with 1 hour, an error from last night is gone by morning.

The kickoff conversation noted that Hobby is reportedly for personal, non-commercial use only. That page doesn't say so; it wasn't confirmed elsewhere. Home Base is personal and non-commercial either way.

## Options considered

1. **Vercel Hobby.** Free, known from Snippr, zero server setup. Short log retention.
2. **Vercel Pro.** Longer logs and more headroom. $20 a month for one user's dashboard.
3. **A container host or small server** (Fly.io, Railway, a VPS). More control and full logs. More to run and more to learn before v1 is useful.

## Decision

Option 1: Vercel Hobby, deploying from `main`.

## Consequences

- **Good:** Free and familiar. Pushing to `main` is the deploy.
- **Bad:** 1 hour of runtime logs means a bug Ryan notices the next morning has no logs left. If that bites, the fix is logging errors somewhere that keeps them, or upgrading.
- **Bad:** A push to `main` is a production deploy, so Ryan's review before pushing is the safety check ([0002](./0002-carry-over-snippr-working-rules.md)).
- **Follow-ups:** confirm whether the Hobby plan's terms restrict commercial use before Home Base is ever offered to other people.
