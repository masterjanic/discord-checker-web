"use client";

import { signIn } from "next-auth/react";
import clsx from "clsx";
import Link from "next/link";

interface ISignInButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  authed?: boolean;
}

const style =
  "relative hidden cursor-pointer items-center justify-center space-x-2 rounded-md border border-blurple-legacy bg-blurple px-2.5 py-1 text-center text-xs text-neutral-100 shadow-sm outline-none outline-0 transition-all duration-300 ease-out hover:bg-blurple-dark lg:block";

export default function SignInButton({
  authed,
  className,
  children,
  ...props
}: ISignInButtonProps) {
  if (!authed) {
    return (
      <button
        className={clsx(style, className)}
        onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
        {...props}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href="/dashboard" className={clsx(style, className)}>
      {children}
    </Link>
  );
}
