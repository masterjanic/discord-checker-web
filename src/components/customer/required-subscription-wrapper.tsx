"use client";

import { type Session } from "next-auth";

import { isUserSubscribed } from "~/lib/auth";

export default function RequiredSubscriptionWrapper({
  session,
  placeholder,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
  placeholder: React.ReactNode;
}) {
  const isSubscribed = !isUserSubscribed(session?.user);
  return <>{isSubscribed ? children : placeholder}</>;
}
