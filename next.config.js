import { withSentryConfig } from "@sentry/nextjs";

await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
  swcMinify: true,
  poweredByHeader: false,
  output: "standalone",
  images: {
    deviceSizes: [420, 768, 1024, 1280, 1536],
    imageSizes: [25, 33, 44, 50, 90, 100],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],
  },
};

export default withSentryConfig(
  config,
  {
    // Suppresses source map uploading logs during build
    silent: true,
    org: "janic-dev",
    project: "dtc-web",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  },
  {
    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,
    transpileClientSDK: false,
    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/science",
    // Hides source maps from generated client bundles
    hideSourceMaps: true,
    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
    // Enables automatic instrumentation of Vercel Cron Monitors.
    automaticVercelMonitors: false,
  },
);
