// Drizzle Kit's settings: where the schema is, where migrations go, and which
// database db:migrate and db:studio connect to.
// Why migrations work this way: docs/adr/0030-generate-sql-migrations-and-run-them-in-the-production-build.md
import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";
import { requireDatabaseUrl } from "./src/db/database-url";

// Next.js reads .env by itself; Drizzle Kit doesn't. Variables already set in
// the shell win over the file. On Vercel there is no .env, and DATABASE_URL
// comes from the project's environment variables.
if (existsSync(".env")) process.loadEnvFile(".env");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  // Generated SQL files, committed and read in review. Never hand-edited
  // after they've been pushed.
  out: "./drizzle",
  dbCredentials: { url: requireDatabaseUrl(process.env) },
});
