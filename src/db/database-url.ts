// Reading and checking the database connection string.
//
// Kept free of imports so the scripts in scripts/ can load it with plain Node
// (Node runs TypeScript files directly by stripping the types), and so the
// tests need no database.

/** Host names that mean "this machine." `URL` keeps the brackets on IPv6. */
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/**
 * Returns `DATABASE_URL`, or throws a message that says how to fix it.
 *
 * Without this, `pg` falls back to its own defaults (a server on this machine,
 * your macOS user name) and fails later with an error that hides the cause.
 */
export function requireDatabaseUrl(
  env: Record<string, string | undefined>,
): string {
  const url = env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. For local development, copy .env.example to .env " +
        "(see docs/DEVELOPMENT.md, Local database).",
    );
  }
  return url;
}

/**
 * The guard from ADR 0028. Throws unless the URL points at a database on this
 * machine, so destructive commands (db:reset, and the seed script from plan
 * step 6) can't run against Neon even if a production URL ends up in `.env`.
 *
 * It checks the host only. It's a guardrail for the commands that call it,
 * not a wall: anything that doesn't call it will use whatever URL it's given.
 */
export function assertLocalDatabaseUrl(url: string): void {
  let host: string;
  try {
    // Lowercased by hand: `URL` only lowercases hosts for schemes it knows,
    // like http:, and postgres: isn't one of them.
    host = new URL(url).hostname.toLowerCase();
  } catch {
    // Don't echo the URL: if it's a real one, it contains a password.
    throw new Error("Refusing to run: DATABASE_URL is not a valid URL.");
  }
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Refusing to run: DATABASE_URL points at "${host}", not this machine. ` +
        "This command deletes data, so it only runs against localhost.",
    );
  }
}
