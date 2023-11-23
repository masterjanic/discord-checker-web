import clsx from "clsx";
import Link from "next/link";
import { type HTMLAttributes, type ReactNode } from "react";
import { btnStyle } from "~/app/_components/common/button";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";

interface ISubscriptionRequiredCardProps
  extends HTMLAttributes<HTMLDivElement> {
  skeleton?: ReactNode;
  feature?: string;
  message?: string | ReactNode;
}

export default function SubscriptionRequiredCard({
  className,
  skeleton = <SkeletonDefault />,
  feature,
  message,
  ...props
}: ISubscriptionRequiredCardProps) {
  return (
    <div
      className={clsx(
        "relative grid h-full min-h-[190px] w-full place-items-center",
        className,
      )}
      {...props}
    >
      <div className="absolute h-full w-full opacity-80">{skeleton}</div>
      <div className="relative text-center">
        <h1 className="mb-2 text-xl font-medium">Subscription required</h1>
        {feature && !message && (
          <p className="text-sm text-neutral-200">
            This is an advanced feature. <br />
            You need to be subscribed to see {feature}.
          </p>
        )}

        {message && <p className="text-sm text-neutral-200">{message}</p>}

        <Link href="/profile" className={clsx("mt-8 inline-flex", btnStyle)}>
          Manage Subscription
        </Link>
      </div>
    </div>
  );
}
