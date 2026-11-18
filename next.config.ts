import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Both are create-next-app's defaults in Next.js 16.4, and the next major
  // version turns them on for every app. Data is fetched fresh on every
  // request unless a function opts into caching with "use cache".
  cacheComponents: true,
  partialPrefetching: true,
  // Tailwind's own Turbopack loader processes CSS files, in place of PostCSS.
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
