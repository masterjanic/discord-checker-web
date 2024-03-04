import "~/styles/globals.css";

import { type Viewport } from "next";
import { Poppins } from "next/font/google";

import { DEFAULT_META } from "~/consts/meta";
import { cn } from "~/lib/utils";
import { TRPCReactProvider } from "~/trpc/react";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata = DEFAULT_META;

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#5865F2",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("font-sans antialiased dark", poppins.variable)}>
        <TRPCReactProvider>{children}</TRPCReactProvider>
      </body>
    </html>
  );
}
