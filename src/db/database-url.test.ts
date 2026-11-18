import { describe, expect, it } from "vitest";
import { assertLocalDatabaseUrl, requireDatabaseUrl } from "./database-url";

describe("requireDatabaseUrl", () => {
  it("returns the URL when it's set", () => {
    const url = "postgres://home_base:home_base@localhost:5433/home_base";
    expect(requireDatabaseUrl({ DATABASE_URL: url })).toBe(url);
  });

  it("trims stray whitespace from a copied value", () => {
    expect(
      requireDatabaseUrl({ DATABASE_URL: "  postgres://localhost/x \n" }),
    ).toBe("postgres://localhost/x");
  });

  it("throws when it's missing, pointing at .env.example", () => {
    expect(() => requireDatabaseUrl({})).toThrow(
      /DATABASE_URL is not set.*\.env\.example/,
    );
  });

  it("throws when it's blank", () => {
    expect(() => requireDatabaseUrl({ DATABASE_URL: "   " })).toThrow(
      /not set/,
    );
  });
});

describe("assertLocalDatabaseUrl", () => {
  it.each([
    "postgres://home_base:home_base@localhost:5433/home_base",
    "postgresql://home_base@127.0.0.1:5433/home_base_test",
    "postgres://home_base@[::1]:5433/home_base",
    "postgres://home_base@LOCALHOST:5433/home_base",
  ])("allows %s", (url) => {
    expect(() => assertLocalDatabaseUrl(url)).not.toThrow();
  });

  it.each([
    // A Neon-shaped URL (made up).
    "postgres://app:secret@ep-quiet-river-a1b2c3.us-east-1.aws.neon.tech/neondb?sslmode=require",
    // Looks local at a glance, isn't.
    "postgres://app@localhost.example.com:5432/db",
    "postgres://app@127.0.0.2:5432/db",
    "postgres://app@db.internal:5432/db",
  ])("refuses %s", (url) => {
    expect(() => assertLocalDatabaseUrl(url)).toThrow(
      /Refusing to run.*not this machine/,
    );
  });

  // pg lets ?host= and ?hostaddr= override the host before the "?", so
  // these would connect to the remote server while looking like localhost.
  it.each([
    "postgres://app@localhost:5433/db?host=ep-quiet-river-a1b2c3.us-east-1.aws.neon.tech",
    "postgres://app@localhost:5433/db?sslmode=disable&hostaddr=10.0.0.5",
  ])("refuses %s", (url) => {
    expect(() => assertLocalDatabaseUrl(url)).toThrow(
      /Refusing to run.*overrides the host/,
    );
  });

  it("refuses a value that isn't a URL, without echoing it", () => {
    let message = "";
    try {
      assertLocalDatabaseUrl("host=prod password=hunter2");
    } catch (error) {
      message = (error as Error).message;
    }
    expect(message).toMatch(/not a valid URL/);
    expect(message).not.toContain("hunter2");
  });
});
