import { getProviders } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PiXCircleDuotone } from "react-icons/pi";

import SignInForm from "~/components/auth/sign-in-form";
import BackgroundGrid from "~/components/common/background-grid";
import Container from "~/components/common/container";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { generateMetadata } from "~/lib/metadata";
import { auth } from "~/server/auth";

export const metadata = generateMetadata({
  title: "Sign In",
  description: "Sign in to start managing your Discord tokens.",
  url: "/auth/login",
  robots: {
    index: true,
    follow: true,
  },
});

export default async function Page({
  searchParams: { error },
}: {
  searchParams: { error: string | undefined };
}) {
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  const providers = await getProviders();
  const errorMessages = {
    OAuthAccountNotLinked: "This account is not linked to any OAuth provider.",
    EmailCreateAccount:
      "The account could not be created. Please try again later.",
    EmailSignin: "Could not send the verification email.",
    SessionRequired: "Please sign in to continue.",
  } as Record<string, string>;

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
        {error && (
          <Alert variant="destructive">
            <PiXCircleDuotone className="h-5 w-5 self-center" />
            <AlertTitle>Failed to Sign In</AlertTitle>
            <AlertDescription>
              {errorMessages[error] ?? "An unknown error occurred."}
            </AlertDescription>
          </Alert>
        )}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Create an account or sign in to start managing your tokens.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignInForm providers={providers} />
          </CardContent>
        </Card>
        <div className="text-center">
          <small className="text-xs text-muted-foreground font-light font-mono">
            Coded by masterjanic &copy; {new Date().getFullYear()}
          </small>
        </div>
      </Container>
    </div>
  );
}
