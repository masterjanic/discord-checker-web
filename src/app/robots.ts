import { type MetadataRoute } from "next";

/**
 * Generates the robots.txt for the website during build time.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/*"],
    },
    sitemap: "https://discord-checker.janic.dev/sitemap.xml",
    host: "https://discord-checker.janic.dev",
  };
}
