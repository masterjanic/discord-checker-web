"use client";

import { type Session } from "next-auth";
import Link from "next/link";

import SignInButton from "~/components/common/sign-in-button";
import { buttonVariants } from "~/components/ui/button";

export default function NavbarActions({
  session,
}: {
  session: Session | null;
}) {
  if (!session) {
    return <SignInButton>Sign In</SignInButton>;
  }

  return (
    <Link
      href="/dashboard"
      className={buttonVariants({ variant: "default", size: "sm" })}
    >
      Dashboard
    </Link>
  );
}
