import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Lets tests import "@/lib/..." the same way app code does (tsconfig.json "paths").
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
