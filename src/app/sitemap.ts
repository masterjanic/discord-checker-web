import { type MetadataRoute } from "next";

import { NAV_LINKS } from "~/consts/nav";

const BASE_URL = "https://discord-checker.janic.dev";

/**
 * Generates the sitemap for the website during build time.
 * Each page that should be indexed by search engines should be added here.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = NAV_LINKS.map((link) => {
    return link.components?.map((component) => component.href) ?? [link.href];
  })
    .flat()
    .filter((path) => path !== "/");

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    ...pages.map((url) => ({
      url: BASE_URL + url,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
