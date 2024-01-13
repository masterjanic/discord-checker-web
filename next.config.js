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
    ],
  },
};

export default config;
