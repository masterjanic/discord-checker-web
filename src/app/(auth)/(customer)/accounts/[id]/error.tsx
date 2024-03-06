"use client";

import Link from "next/link";

import Container from "~/components/common/container";
import { Button, buttonVariants } from "~/components/ui/button";
import { isTRPCClientError } from "~/trpc/react";

export const metadata = {
  title: "An error occurred",
  description: "There was an error while trying to load the account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // TODO: Better messages according to status code
  return (
    <div className="pt-32 grid place-items-center">
      <Container className="text-center">
        <span className="text-9xl font-bold text-primary mb-4 tracking-tight font-mono">
          {isTRPCClientError(error) ? error.data?.httpStatus ?? 500 : "500"}
        </span>
        <h1 className="text-2xl font-semibold">
          {isTRPCClientError(error)
            ? error.data?.code ?? "An error occurred"
            : "An error occurred"}
        </h1>
        <p className="mt-2 text-base max-w-md">
          {isTRPCClientError(error)
            ? error.shape?.message ??
              "An error occurred while trying to load this page. Please try again later."
            : "An error occurred while trying to load this page. Please try again later."}
        </p>

        <div className="flex items-center justify-center space-x-2 mt-12">
          <Button onClick={() => reset()} variant="secondary">
            Try again
          </Button>
          <Link
            href="/accounts"
            className={buttonVariants({ variant: "default" })}
          >
            Go back
          </Link>
        </div>
      </Container>
    </div>
  );
}
