import { type Session } from "next-auth";
import Link from "next/link";
import { Suspense } from "react";
import { FiCheck } from "react-icons/fi";

import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import TitledCard from "~/components/common/titled-card";
import SubscribeButton from "~/components/customer/profile/subscribe-button";
import { buttonVariants } from "~/components/ui/button";
import { isAdministrator, isUserSubscribed } from "~/lib/auth";

export default function ManageSubscriptionCard({
  session,
}: {
  session: Session | null;
}) {
  const user = session?.user;
  const isSubscribed = isUserSubscribed(user);
  const isAdmin = isAdministrator(user);

  return (
    <TitledCard title="Manage Subscription" className="h-full">
      {isSubscribed && !isAdmin && (
        <div>
          <p className="text-base font-light">
            You are currently subscribed. <br />
            The subscription ends on{" "}
            <strong>
              {new Date(user!.subscribedTill!).toLocaleString("en-US")}
            </strong>
            . <br />
            <br />
            You don&apos;t need to do anything, the subscription will not be
            renewed automatically.
          </p>
        </div>
      )}

      {isAdmin && (
        <div className="h-full grid place-items-center">
          <p className="text-base">Admin users do not need to subscribe :)</p>
        </div>
      )}

      {!isSubscribed && !isAdmin && (
        <div>
          <p className="text-sm font-light">
            You are currently <b>not</b> subscribed. <br />
            The Discord Token Checker can still be used, but you will not be
            able to use all features.
          </p>
          <hr className="my-4 border-neutral-100/10" />
          <div>
            <p className="text-xs font-light text-muted-foreground">
              Subscribe now to unlock all features:
            </p>
            <ul role="list" className="mt-2 text-[13px]">
              <li className="flex items-center py-1 first:mt-0">
                <FiCheck className="h-4 w-4 text-primary" />
                <span className="mb-0 ml-3">Unlimited Discord accounts</span>
              </li>
              <li className="flex items-center py-1 first:mt-0">
                <FiCheck className="h-4 w-4 text-primary" />
                <span className="mb-0 ml-3">Advanced account analytics</span>
              </li>
              <li className="flex items-center py-1 first:mt-0">
                <FiCheck className="h-4 w-4 text-primary" />
                <span className="mb-0 ml-3">
                  Unlimited Token Collections for categorizing tokens
                </span>
              </li>
              <li className="flex items-center py-1 first:mt-0">
                <FiCheck className="h-4 w-4 text-primary" />
                <span className="mb-0 ml-3">
                  Interval Token Checks up to every hour
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <Link
              href="/pricing"
              className={buttonVariants({ variant: "secondary", size: "sm" })}
            >
              View all features
            </Link>

            <Suspense
              fallback={<SkeletonDefault className="!h-[26px] !w-[150px]" />}
            >
              <SubscribeButton />
            </Suspense>
          </div>
        </div>
      )}
    </TitledCard>
  );
}
