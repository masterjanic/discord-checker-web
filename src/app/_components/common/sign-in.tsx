"use client";

import clsx from "clsx";
import { signIn } from "next-auth/react";
import Link from "next/link";

import Button, { btnStyle } from "~/app/_components/common/button";

interface ISignInButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  authed?: boolean;
  redirect?: string;
}

export default function SignInButton({
  authed,
  className,
  children,
  redirect,
  ...props
}: ISignInButtonProps) {
  if (!authed) {
    return (
      <Button
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        className={className}
        {...props}
      >
        {children}
      </Button>
    );
  }

  return (
    <Link href={redirect ?? "/dashboard"} className={clsx(btnStyle, className)}>
      {children}
    </Link>
  );
}
