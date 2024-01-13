import type { Metadata } from "next";

const title = "DTC-Web: Open Source Discord Token Checker";
const description =
  "A fast, web-based Discord token checker. Find verified, unverified and nitro accounts easily.";

export const DEFAULT_META: Metadata = {
  title: {
    template: "%s | DTC-Web",
    default: title,
  },
  description,
  keywords:
    "discord,discord token,token checker,discord token checker,discord account checker,discord accounts",
  icons: [
    { rel: "shortcut icon", url: "/favicon.ico", type: "image/x-icon" },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "mask-icon",
      color: "#5bbad5",
      url: "/safari-pinned-tab.svg",
    },
  ],
  manifest: "/site.webmanifest",
  applicationName: "DTC-Web",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "DTC-Web",
    title,
    description,
    images: [
      {
        url: "/images/og.png",
        width: 1200,
        height: 630,
        alt: title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://discord-checker.janic.dev"),
  referrer: "no-referrer",
};
