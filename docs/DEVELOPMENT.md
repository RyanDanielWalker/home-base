# Development guide

How work on Home Base gets done. How to get a fresh clone running, what each command does, and how a change gets made.

## Setup

From a fresh clone to the app running on your machine, with its local database. Plan step 5 adds Google sign-in, and the secrets it needs in `.env`.

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

The page doesn't use the database yet, so `npm run dev` works without the next section. From plan step 5 on, it needs it.

`npm install` installs the exact versions in `package-lock.json`. New dependencies are saved as exact versions too (`save-exact=true` in `.npmrc`), so `package.json` says `"next": "16.4.6"`, not `"^16.4.6"`. A caret means "this or any newer 16.x," which lets a fresh install quietly pick up a version nobody tested. Exact versions mean an upgrade is always a commit you can see.

### 3. Local database

The app's data lives in Postgres. On your Mac, that's a Postgres server running in Docker, never the production database on Neon ([0028](./adr/0028-run-postgres-in-docker-for-local-development.md)).

**Docker** runs programs in isolated containers. A **container** is a small, throwaway Linux machine running one program, here the Postgres server. Deleting it deletes nothing on your Mac except what it stored. You need **Docker Desktop** installed and running (the whale icon in the menu bar). This Mac has it.

```sh
cp .env.example .env        # once: the local DATABASE_URL
npm run db:up               # start Postgres, wait until it accepts connections
npm run db:migrate          # create the tables
```

That's it. `db:up` runs `docker compose up -d --wait`: it reads `docker-compose.yml`, downloads the `postgres:18` image the first time, starts a container in the background (`-d`), and waits (`--wait`) until Postgres reports it's ready. The first start also runs `docker/postgres-init/01-create-test-database.sql`, which creates the second database. The container keeps running until you run `npm run db:down` or quit Docker Desktop. The data survives both: it's stored in a Docker **volume**, a folder Docker manages outside the container, named `home-base_postgres-data`.

`.env` holds settings for your machine only and is never committed. Right now it's one line, `DATABASE_URL`, the address of the local database. A **connection string** like `postgres://home_base:home_base@localhost:5433/home_base` reads as: user `home_base`, password `home_base`, on this machine, port 5433, database `home_base`. The password doesn't need to be secret: the container only accepts connections from this Mac.

#### Why it's set up this way

- **Postgres 18**, because Neon creates new projects on 18 and a Neon project's major version can never change. Plan step 8 creates the production project on 18 to match. A **major version** is the first number; between majors, SQL features and defaults can change, so "works locally" only means something if both sides run the same one. Minor versions (18.1, 18.7) are bug fixes and can differ.
- **Port 5433**, not Postgres's usual 5432, because Snippr's local Postgres already uses 5432 on this Mac. With different ports, both can run at once. A **port** is a numbered door on a machine; two programs can't listen on the same one.
- **Two databases**, `home_base` for development and `home_base_test` for tests, in the same server. The database tests (from plan step 6) empty their database between tests, so they get one of their own and never wipe what you were looking at in the app ([0032](./adr/0032-test-with-vitest-against-a-local-test-database.md)). Step 6 adds the setting that points the tests at it.
- **The volume mounts at `/var/lib/postgresql`.** Postgres 18's Docker image moved its data into a versioned folder under there. Older guides (and Snippr, on 17) mount `/var/lib/postgresql/data`, which makes an 18 container refuse to start.

#### Changing the schema

The schema lives in `src/db/schema.ts`, in TypeScript. To change the database's shape:

1. Edit `src/db/schema.ts`. For example, add a `note: text("note")` column to a table.
2. `npm run db:generate`. Drizzle Kit compares the schema with the last migration and writes the SQL for the difference into a new file in `drizzle/`, such as `drizzle/0003_add_note.sql` containing `ALTER TABLE ... ADD COLUMN "note" text;`. It also updates `drizzle/meta/`, its record of what the schema looked like after each migration.
3. Read the SQL file. It's what will run against production.
4. `npm run db:migrate` to apply it locally.
5. Commit the schema change and the generated files together.

The rules ([0030](./adr/0030-generate-sql-migrations-and-run-them-in-the-production-build.md), also in `CLAUDE.md`):

- **Always `generate`, never `drizzle-kit push`.** `push` changes a database to match the schema with no file, so there's nothing to review and no history. There's deliberately no npm script for it.
- **Never edit a migration that's been pushed.** Production has already run it, and won't run it again. Fix it with a new migration.
- **Add first, remove in a later push.** From plan step 8, the production build runs new migrations before the new code goes live, so the old code briefly runs against the new schema. Adding a table or column doesn't bother old code. Dropping or renaming one that old code still uses breaks it, so that happens only after an earlier push has stopped using it.

#### Starting over

- `npm run db:reset` empties the development database and re-applies every migration. Use it when local data is in a mess, or to check that the migrations build the schema from nothing.
- `docker compose down -v` deletes the container *and* the volume: both databases, gone. The next `db:up` starts completely fresh and re-runs the init script. Use it when something about the server itself is wrong.

`db:reset` is **guarded**: it refuses to run unless `DATABASE_URL` points at this machine (`localhost`, `127.0.0.1`, or `::1`). It also refuses a URL with a `?host=` or `?hostaddr=` setting, because `pg` connects to that host instead of the one before the `?`: `postgres://...@localhost/db?host=elsewhere.com` goes to `elsewhere.com`. For example, with a Neon URL it stops with `Refusing to run: DATABASE_URL points at "ep-....neon.tech", not this machine`, before connecting. The seed script from plan step 6 gets the same guard. It's a guardrail, not a wall: `db:migrate`, `db:studio`, and `npm run dev` use whatever URL they're given. So never put a production URL in `.env`.

A variable already set in your terminal wins over `.env`. If you ever `export DATABASE_URL=...` in a shell, every command in that shell uses it instead of the local one.

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
| `npm run db:up` | Starts the local Postgres in Docker and waits until it's ready | Once per session, if it isn't running |
| `npm run db:down` | Stops it. The data stays in the volume | When you want Docker quiet |
| `npm run db:generate` | Writes a SQL migration into `drizzle/` from changes to `src/db/schema.ts` | After every schema change |
| `npm run db:migrate` | Applies the migrations the database in `DATABASE_URL` hasn't run yet | After `db:generate`, and after pulling someone else's migration |
| `npm run db:reset` | Empties the local development database, then runs `db:migrate`. Refuses any host but localhost | When local data is a mess |
| `npm run db:studio` | Drizzle Studio: a browser view of the tables and rows, at https://local.drizzle.studio | To look at data |

CI (plan step 9) will run `lint`, `typecheck`, `test`, and `format:check` on every push.

### What each tool is, and the choices in its config

- **TypeScript** (`tsconfig.json`) checks that values match their types before the code runs. For example, passing a date string where a number is expected is an error in the editor, not a bug in production. `strict` is on. The `@/*` path alias means `import { x } from "@/lib/days"` works from any folder instead of `../../lib/days`.
- **`next typegen`** writes type definitions that Next.js derives from the folders under `src/app/`. For example, the root layout's props are typed `LayoutProps<"/">`, a type that only exists after `typegen` (or `dev`, or `build`) has run. That's why `typecheck` runs it first: on a fresh clone, plain `tsc` would fail with "cannot find name `LayoutProps`."
- **ESLint** (`eslint.config.mjs`) finds likely mistakes that still type-check: a variable that's never used, an `<img>` with no `alt` text, a React hook called inside an `if`. It uses Next.js's two presets, `core-web-vitals` and `typescript`. Those presets report most problems as *warnings*, and a warning alone doesn't fail ESLint, so a missing `alt` would sail through CI. `--max-warnings=0` makes any warning a failure.
- **Prettier** (`.prettierrc.json`, empty, so the defaults) formats code: indentation, quotes, line breaks. It ends arguments about style, and a diff only shows changes that mean something. `.prettierignore` skips `drizzle/`, because those files are written by Drizzle Kit and should stay exactly as generated. It also skips Markdown: Prettier re-pads every row of a Markdown table when one cell changes, which would make each docs edit look much bigger than it is.
- **Vitest** (`vitest.config.mts`) runs the tests. It runs them in plain Node, with no browser, because the code worth testing here is business rules and database queries ([0032](./adr/0032-test-with-vitest-against-a-local-test-database.md)). It understands the `@/*` alias through `resolve.tsconfigPaths`. If no test file matches its `include` pattern, `npm test` fails, so a mistyped pattern can't pass silently. (Until plan step 4 added the first test, a `passWithNoTests` setting allowed an empty run.)
- **Drizzle ORM** (`src/db/`) is how the app talks to Postgres. An **ORM** (object-relational mapper) lets code describe tables and queries in the programming language instead of in SQL strings. For example, `db.select().from(task).where(eq(task.userId, userId))` becomes `SELECT ... FROM "task" WHERE "user_id" = $1`, and TypeScript knows the shape of every row that comes back. Drizzle stays close to SQL, so the SQL it writes is predictable ([0006](./adr/0006-use-drizzle-as-the-orm.md)). Underneath it, `pg` is the **driver** that opens connections and carries the queries ([0029](./adr/0029-use-pg-over-tcp-in-development-and-production.md)).
- **Drizzle Kit** (`drizzle.config.ts`) is Drizzle's command-line tool: it generates migrations, applies them, and runs Drizzle Studio. Next.js loads `.env` by itself, but Drizzle Kit doesn't, so the config loads it with Node's built-in `process.loadEnvFile`. It has no `strict` or `verbose` settings: both only affect `drizzle-kit push`, which this project never uses.
- **Scripts in `scripts/`** are TypeScript files run by plain `node`, with no build step. Node 24 runs `.ts` files by **stripping the types**: it deletes the type annotations and runs what's left as JavaScript. For example, `let url: string = "x"` runs as `let url = "x"`. That works only for TypeScript that is "just JavaScript plus types," so these files can't use the `@/` alias (Node doesn't read `tsconfig.json`) and import other files with their `.ts` extension, which `allowImportingTsExtensions` in `tsconfig.json` permits. The `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON` flag in the npm script hides one harmless warning: Node first guesses a `.ts` file is an old-style CommonJS module, sees `import`, and re-reads it as a modern ES module. The alternative fix, `"type": "module"` in `package.json`, changes how every `.js` file in the project is loaded, which wasn't worth the risk to Next.js and Drizzle Kit for a warning. This replaces a dependency like `tsx` that would otherwise run these scripts.
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
