"use client";

import { signIn } from "next-auth/react";

import { Button } from "~/components/ui/button";

export default function SignInButton({
  children,
  variant = "default",
  size = "sm",
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={() => signIn("discord", { callbackUrl: "/dashboard" })}
      {...props}
    >
      {children}
    </Button>
  );
}
