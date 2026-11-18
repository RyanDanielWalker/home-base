# 0004. Build one Next.js app, with Server Components for reads and Server Actions for writes

- **Status:** Accepted
- **Date:** 2026-11-18
- **Related:** [0005](./0005-postgres-on-neon-free-plan.md), [0006](./0006-use-drizzle-as-the-orm.md), [0007](./0007-host-on-vercel-hobby.md), Snippr [0002](https://github.com/RyanDanielWalker/snippr/blob/main/docs/adr/0002-nextjs-full-stack-on-vercel.md)

## In plain English

Home Base is one Next.js app. Pages fetch their data on the server, and forms and buttons save data by calling server functions directly. There's no separate API to build. The rules that make the to-do list work, like "stale after 2 days," live in plain TypeScript files that don't know about Next.js, so an API could wrap them later without rewriting them.

## Context

The thing most likely to kill this project is taking too long to become useful. v1 needs a to-do list, session logging, and a grid, used by one person. Ryan's existing stack is React, TypeScript, Next.js, Node.js, GraphQL, and NestJS. Snippr is a Next.js monolith on Vercel and has held up well.

Two terms:

- A **Server Component** is a React component that runs only on the server. It can query the database directly and send finished HTML to the browser. For example, the current list page could read this user's tasks and render them with no fetch call in the browser.
- A **Server Action** is a function marked `"use server"` that a form or button can call as if it were local. Next.js turns the call into a request behind the scenes. For example, `markDone(taskId)` called from a button runs on the server and updates the database.

## Options considered

1. **One Next.js app: Server Components read, Server Actions write.** Least code and fewest moving parts. Same shape as Snippr. Cons: no public API by default, and Server Actions are only as safe as the checks inside them, because anyone can call them with any arguments.
2. **Next.js with Route Handlers as a REST API** (Snippr's approach). A clear request/response boundary that's easy to test. More boilerplate per feature, and the only client is the app itself.
3. **Next.js front end plus a NestJS GraphQL API.** Matches Ryan's day-job stack and shows it off. Two deployables, a schema layer, and much more setup before v1 is useful.

## Decision

Option 1.

- Reads happen in Server Components. Writes happen in Server Actions.
- Every Server Action resolves the signed-in user first, validates its input, and checks that every id it touches belongs to that user ([0011](./0011-single-user-multi-user-ready.md)).
- Business rules (the stale clock, the soft cap, which day a session belongs to) live in plain TypeScript modules with the database passed in, so they can be unit-tested against fakes and reused by an API later.
- Next.js 16.4.x, the line Snippr is on.

## Consequences

- **Good:** The fastest path to a v1 Ryan uses every day.
- **Good:** Business rules stay portable. If a phone app or API ever happens, the rules move, not the pages.
- **Bad:** No API to show off. GraphQL or NestJS on a resume has to come from somewhere else.
- **Bad:** Server Actions look like local function calls, which makes it easy to forget they're public endpoints. The ownership check is a house rule in `CLAUDE.md` and something `/audit` looks for.
- **Follow-ups:** the v1 build plan picks the validation library and the pattern every Server Action follows.
