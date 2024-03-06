import { type Metadata } from "next";

import { DEFAULT_META } from "~/consts/meta";

interface GenerateMetadata extends Metadata {
  title?: string;
  description?: string;
  url: string;
}

/**
 * Generates metadata for a page.
 */
export const generateMetadata = ({
  title,
  description,
  url,
  ...rest
}: GenerateMetadata): Metadata => {
  return {
    ...DEFAULT_META,
    title,
    description,
    openGraph: {
      ...DEFAULT_META.openGraph,
      title,
      description,
      url,
      ...rest.openGraph,
    },
    twitter: {
      ...DEFAULT_META.twitter,
      title,
      description,
      ...rest.twitter,
    },
    ...rest,
  };
};
