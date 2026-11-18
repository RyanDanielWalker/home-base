# Development guide

How work on Home Base gets done. How to get a fresh clone running, what each command does, and how a change gets made.

## Setup

From a fresh clone to the app running on your machine. Plan step 4 adds the local database here, and step 5 adds Google sign-in and the `.env` file.

### 1. Node 24

The project runs on **Node 24**, the long-term support (LTS) line. An LTS release gets security fixes for about two and a half years, so it's the one to build on. Odd-numbered releases like Node 25 are short-lived and already past their end of life.

Three files say "24," each for a different reader:

| File | Who reads it | What it does |
| --- | --- | --- |
| `.node-version` | `fnm` (or `nvm`) on your Mac | Switches to Node 24 when you `cd` into the repo |
| `package.json` `"engines"` | npm, and Vercel | Vercel builds with the Node version it names. npm checks it on install |
| `.npmrc` `engine-strict=true` | npm | Turns that check from a warning into a refusal, so `npm install` on the wrong Node stops instead of half-working |

A **Node version manager** keeps several Node versions installed side by side and picks one per folder. This Mac has `fnm`. For it to switch automatically, its shell hook needs to be in `~/.zshrc`:

```sh
eval "$(fnm env --use-on-cd --shell zsh)"
```

Then open a new terminal, `cd` into the repo, and `node --version` should print `v24.something`. If it doesn't, `fnm install 24`.

Why 24 and not 26, which is also LTS now: 24 is what this Mac already had installed, and it's supported until April 2028. Moving to 26 later is a one-line change in each of the three files.

### 2. Install and run

```sh
npm install
npm run dev
```

Open http://localhost:3000. The page says "Home Base" and nothing else yet. Edits to files under `src/` show up on save.

`npm install` installs the exact versions in `package-lock.json`. New dependencies are saved as exact versions too (`save-exact=true` in `.npmrc`), so `package.json` says `"next": "16.4.6"`, not `"^16.4.6"`. A caret means "this or any newer 16.x," which lets a fresh install quietly pick up a version nobody tested. Exact versions mean an upgrade is always a commit you can see.

## Commands

| Command | What it does | When |
| --- | --- | --- |
| `npm run dev` | Starts the development server with Turbopack, Next.js's bundler, and reloads on save | While working |
| `npm run build` | The production build, the same one Vercel runs. It also type-checks | Before the last commit of a task |
| `npm start` | Serves the output of `build` | Rarely; to check a production build locally |
| `npm run lint` | ESLint, with Next.js's rules for React, hooks, accessibility, and performance. Any warning fails the run | Before every commit |
| `npm run typecheck` | `next typegen`, then `tsc --noEmit` | Before every commit |
| `npm test` | Runs every `src/**/*.test.ts` with Vitest, once | Before every commit |
| `npm run test:watch` | Vitest in watch mode: re-runs the affected tests on every save | While writing tests |
| `npm run format:check` | Prettier, reporting files that aren't formatted | Before every commit |
| `npm run format` | Prettier, rewriting files in place | When `format:check` complains |

CI (plan step 9) will run `lint`, `typecheck`, `test`, and `format:check` on every push.

### What each tool is, and the choices in its config

- **TypeScript** (`tsconfig.json`) checks that values match their types before the code runs. For example, passing a date string where a number is expected is an error in the editor, not a bug in production. `strict` is on. The `@/*` path alias means `import { x } from "@/lib/days"` works from any folder instead of `../../lib/days`.
- **`next typegen`** writes type definitions that Next.js derives from the folders under `src/app/`. For example, the root layout's props are typed `LayoutProps<"/">`, a type that only exists after `typegen` (or `dev`, or `build`) has run. That's why `typecheck` runs it first: on a fresh clone, plain `tsc` would fail with "cannot find name `LayoutProps`."
- **ESLint** (`eslint.config.mjs`) finds likely mistakes that still type-check: a variable that's never used, an `<img>` with no `alt` text, a React hook called inside an `if`. It uses Next.js's two presets, `core-web-vitals` and `typescript`. Those presets report most problems as *warnings*, and a warning alone doesn't fail ESLint, so a missing `alt` would sail through CI. `--max-warnings=0` makes any warning a failure.
- **Prettier** (`.prettierrc.json`, empty, so the defaults) formats code: indentation, quotes, line breaks. It ends arguments about style, and a diff only shows changes that mean something. `.prettierignore` skips Markdown: Prettier re-pads every row of a Markdown table when one cell changes, which would make each docs edit look much bigger than it is.
- **Vitest** (`vitest.config.mts`) runs the tests. It runs them in plain Node, with no browser, because the code worth testing here is business rules and database queries ([0032](./adr/0032-test-with-vitest-against-a-local-test-database.md)). It understands the `@/*` alias through `resolve.tsconfigPaths`. Until the first test exists (plan step 6), `passWithNoTests` keeps `npm test` from failing on an empty project. The step that adds the first test removes that line, so a mistyped `include` pattern can never pass silently.
- **Tailwind CSS** (`src/app/globals.css`) is loaded by its own Turbopack loader, configured in `next.config.ts`, rather than through PostCSS, the older route. The colors are CSS variables with light and dark values ([0034](./adr/0034-tailwind-dnd-kit-and-no-date-library.md)).

## How a change gets made

Home Base is built with Claude Code, the same way as Snippr ([0002](./adr/0002-carry-over-snippr-working-rules.md)).

1. **Pick the work.** `/next` takes the first unchecked item in the current phase of [`ROADMAP.md`](./ROADMAP.md), or the item you name. Items in "Before v1" need Ryan in the loop and aren't picked automatically.
2. **Decide before building.** A mechanical change gets a short plan and goes. A real decision (a new dependency, a data model change, a trade-off) gets 2 or 3 options in plain English and a recommendation, and waits for Ryan. Big decisions get an ADR.
3. **Build and test.** Logic worth testing goes in plain TypeScript modules with the database passed in, so tests run against fakes. After tests pass, break the code on purpose once and confirm a test fails.
4. **Keep the docs true.** Tick the roadmap item. Fix `ARCHITECTURE.md`, `PRODUCT.md`, or this file if the change made them wrong.
5. **Commit, never push.** Small Conventional Commits (`feat:`, `fix:`, `docs:`, ...), subject says what, body says why, one commit per logical change. Claude can't run `git push`: `.claude/settings.json` denies it.
6. **Review cold.** Read the diff as someone who didn't write it.
7. **Report.** Open with "Needs you," then what shipped.
8. **Ryan reviews and pushes.** `git log origin/main..HEAD` shows what's waiting. A push to `main` deploys to production once Vercel is connected.

`/audit`, in a fresh session, reviews the whole repo as an outsider would and reports without fixing anything.

## Definition of done

- The roadmap item is ticked, and anything discovered along the way is a new roadmap item.
- Docs that the change made wrong are fixed in the same commits.
- A significant decision has an ADR ([`adr/README.md`](./adr/README.md) says when).
- No real data anywhere in the diff: fixtures, seeds, and screenshots are invented ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)).
- Checks pass: `typecheck`, `lint`, `test`, and `format:check` before every commit, and `build` before the last one.

## Privacy

The repo is public and the app holds health data ([0003](./adr/0003-keep-real-data-and-the-private-brief-out-of-the-repo.md)). Real data never goes in the repo. Keep private files (the product brief, an export of your log) in a `private/` folder at the repo root, which `.gitignore` ignores, or outside the repo entirely.
