import Link from "next/link";
import { type HTMLAttributes, type ReactNode } from "react";

import { buttonVariants } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";

interface SubscriptionRequiredCardProps extends HTMLAttributes<HTMLDivElement> {
  skeleton?: ReactNode;
  feature?: string;
  message?: string | ReactNode;
}

export default function SubscriptionRequiredCard({
  className,
  skeleton = <Skeleton className="w-full h-full" />,
  feature,
  message,
  ...props
}: SubscriptionRequiredCardProps) {
  return (
    <div
      className={cn(
        "relative grid h-full min-h-[190px] w-full place-items-center",
        className,
      )}
      {...props}
    >
      <div className="absolute h-full w-full opacity-80">{skeleton}</div>
      <div className="relative text-center">
        <h1 className="mb-2 text-xl font-semibold">Subscription required</h1>
        {feature && !message && (
          <p className="text-sm">
            This is an advanced feature. <br />
            You need to be subscribed to see {feature}.
          </p>
        )}

        {message && <p className="text-sm">{message}</p>}

        <Link
          href="/profile"
          className={cn(buttonVariants({ size: "sm" }), "mt-8 inline-flex")}
        >
          Manage Subscription
        </Link>
      </div>
    </div>
  );
}
