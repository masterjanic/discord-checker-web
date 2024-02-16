import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import BackgroundGrid from "~/components/common/background-grid";
import Container from "~/components/common/container";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { generateMetadata } from "~/lib/metadata";
import { cn } from "~/lib/utils";

export const metadata = generateMetadata({
  title: "Failed to Sign In",
  description: "An error occurred while trying to sign in.",
  url: "/auth/error",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page({
  searchParams: { error },
}: {
  searchParams: { error: string };
}) {
  if (!error) {
    redirect("/auth/login");
  }

  return (
    <div className="pt-16 lg:pt-20">
      <BackgroundGrid />
      <Container className="relative max-w-md space-y-3">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="DTC-Web: Logo"
            width={48}
            height={48}
            className="mx-auto pointer-events-none select-none"
            draggable={false}
          />
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Failed to Sign In</CardTitle>
            <CardDescription>
              Your sign in request could not be completed.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-center font-light">
              {error === "Verification"
                ? "Your verification link has expired or has already been used. Please sign in again to receive a new link."
                : "Unknown error."}
            </p>
            <Link
              href="/auth/login"
              className={cn(buttonVariants({ variant: "default" }), "w-full")}
            >
              Back to Sign In
            </Link>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
