# Home Base

A personal daily dashboard: one screen to start the day on. A to-do list, a GitHub-style grid of movement colored by kind, and eventually the rest of the morning (calendar, weather, a few headlines) on one page that ends.

**Status:** building v1. The app is scaffolded and its one page says "Home Base." The approved [build plan](docs/V1-BUILD-PLAN.md) says what comes next. To run it locally, see [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md).

## What v1 will be

- A to-do list with a backlog and a short current list, with gentle pressure on tasks that sit around
- Logging a movement session in a couple of taps
- A grid with one square per day, colored by the kind of movement, with no streaks and no "you're behind"

The full product, and the principles every feature is checked against, are in [`docs/PRODUCT.md`](docs/PRODUCT.md). What ships when is in [`docs/ROADMAP.md`](docs/ROADMAP.md).

## How it will be built

One Next.js app on Vercel, with Postgres on Neon through Drizzle, and Better Auth for Google sign-in. Every decision so far, including the ones about the product, has a record in [`docs/adr/`](docs/adr/) with the options that were turned down and what each choice costs.

Home Base is built with [Claude Code](https://claude.com/claude-code). Commits don't carry a co-author line because this sentence says it once ([0002](docs/adr/0002-carry-over-snippr-working-rules.md)).

## License

[MIT](LICENSE)
