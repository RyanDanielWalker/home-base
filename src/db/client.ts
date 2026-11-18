// The one database client the app uses. Everything that reads or writes goes
// through `db`, so changing driver later is a change to this file only
// (docs/adr/0029-use-pg-over-tcp-in-development-and-production.md).
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { requireDatabaseUrl } from "./database-url";
import * as schema from "./schema";

// A pool keeps a few connections open and lends them out, so each request
// doesn't pay to open its own. Plan step 8 adds Vercel's attachDatabasePool,
// which closes idle connections before a function instance is suspended.
const pool = new Pool({ connectionString: requireDatabaseUrl(process.env) });

export const db = drizzle(pool, { schema });
