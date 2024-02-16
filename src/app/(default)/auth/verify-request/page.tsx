import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiEnvelopeDuotone } from "react-icons/pi";

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
import { getServerAuthSession } from "~/server/auth";

export const metadata = generateMetadata({
  title: "Verification Request",
  description: "Please verify your email address to continue.",
  url: "/auth/verify-request",
  robots: {
    index: false,
    follow: true,
  },
});

export default async function Page() {
  const session = await getServerAuthSession();
  if (session) {
    redirect("/dashboard");
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
            <CardTitle>Verification Request</CardTitle>
            <CardDescription>
              Please verify your email address to continue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <PiEnvelopeDuotone className="h-6 w-6 mx-auto text-primary" />

            <p className="text-sm text-center font-light">
              We've sent you an email with a link to verify your email address.
            </p>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
