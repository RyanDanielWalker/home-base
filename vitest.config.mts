import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Lets tests import "@/lib/..." the same way app code does (tsconfig.json "paths").
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // There are no tests until plan step 6. Remove this line with the first one,
    // so a broken include pattern can never pass silently.
    passWithNoTests: true,
  },
});
