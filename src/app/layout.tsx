import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Poppins } from "next/font/google";
import { cookies } from "next/headers";

import { TRPCReactProvider } from "~/trpc/react";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const title = "DTC-Web | Open Source Discord Token Checker";
const description =
  "A fast, web-based Discord token checker. Find verified, unverified and nitro accounts easily.";

export const metadata: Metadata = {
  title,
  description,
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://discord-checker.janic.dev",
    siteName: title,
    title: "Check your Discord Tokens easily",
    description,
    images: [
      {
        url: "https://discord-checker.janic.dev/og.png",
        width: 1200,
        height: 630,
        alt: title,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://discord-checker.janic.dev"),
};

export const viewport: Viewport = {
  themeColor: "#5865F2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable}`}>
        <TRPCReactProvider cookies={cookies().toString()}>
          {children}
        </TRPCReactProvider>
      </body>
    </html>
  );
}
