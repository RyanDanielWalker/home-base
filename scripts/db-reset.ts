// npm run db:reset: empties the local development database, so the migrations
// can rebuild it from nothing. The npm script runs db:migrate right after.
//
// Refuses to run unless DATABASE_URL points at this machine (ADR 0028).
// Run by plain Node, which strips the TypeScript types, so it imports with
// the .ts extension and can't use the "@/" alias.
import { existsSync } from "node:fs";
import pg from "pg";
import {
  assertLocalDatabaseUrl,
  requireDatabaseUrl,
} from "../src/db/database-url.ts";

if (existsSync(".env")) process.loadEnvFile(".env");

let url: string;
try {
  url = requireDatabaseUrl(process.env);
  assertLocalDatabaseUrl(url);
} catch (error) {
  console.error((error as Error).message);
  process.exit(1);
}

const client = new pg.Client({ connectionString: url });
await client.connect();
try {
  // `public` holds the app's tables. `drizzle` holds the table where Drizzle
  // records which migrations have run; dropping it makes db:migrate apply
  // every migration again, from the first.
  await client.query(`
    DROP SCHEMA IF EXISTS drizzle CASCADE;
    DROP SCHEMA IF EXISTS public CASCADE;
    CREATE SCHEMA public;
  `);
  console.log(
    `Emptied database "${client.database}". Applying migrations next.`,
  );
} finally {
  await client.end();
}
