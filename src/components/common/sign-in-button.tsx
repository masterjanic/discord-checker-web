"use client";

import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function SignInButton({
  className,
  children,
  variant = "default",
  size = "sm",
  ...props
}: React.HTMLAttributes<HTMLAnchorElement> &
  Parameters<typeof buttonVariants>[0]) {
  return (
    <Link
      href="/auth/login"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </Link>
  );
}
