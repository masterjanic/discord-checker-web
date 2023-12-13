import Link from "next/link";
import { Suspense } from "react";
import { FiCheck } from "react-icons/fi";

import TitledBox from "~/app/_components/common/box-with-title";
import ProfileDangerArea from "~/app/_components/customer/profile/danger-area";
import SubscribeButton from "~/app/_components/customer/profile/subscribe-button";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import DeveloperSettings from "~/app/(auth)/(customer)/profile/_components/developer-settings";
import { isAdministrator, isUserSubscribed } from "~/lib/auth";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Profile | DTC-Web",
  robots: {
    index: true,
    follow: true,
  },
};

export default async function Page() {
  const session = await getServerAuthSession();
  const user = session!.user;

  const isSubscribed = isUserSubscribed(session?.user);

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <TitledBox
          title="Manage Subscription"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          {isSubscribed && !isAdministrator(user) && (
            <div>
              <p className="text-base text-neutral-200">
                You are currently subscribed. <br />
                The subscription ends on{" "}
                <b>{new Date(user.subscribedTill!).toLocaleString("en-US")}</b>
                . <br />
                <br />
                You don&apos;t need to do anything, the subscription will not be
                renewed automatically.
              </p>
            </div>
          )}

          {isAdministrator(user) && (
            <div className="h-full grid place-items-center">
              <p className="text-base text-neutral-200">
                Admin users do not need to subscribe. :)
              </p>
            </div>
          )}

          {!isSubscribed && !isAdministrator(user) && (
            <div>
              <p className="text-base text-neutral-200">
                You are currently <b>not</b> subscribed. <br />
                The Discord Token Checker can still be used, but you will not be
                able to use all features.
              </p>
              <hr className="my-4 border-neutral-100/10" />
              <div>
                <p className="text-xs font-light text-neutral-200">
                  Subscribe now to unlock all features:
                </p>
                <ul role="list" className="mt-2 text-[13px] text-neutral-100">
                  <li className="flex items-center py-1 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Unlimited Discord accounts
                    </span>
                  </li>
                  <li className="flex items-center py-1 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Advanced account analytics
                    </span>
                  </li>
                  <li className="flex items-center py-1 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Unlimited Token Collections for categorizing tokens
                    </span>
                  </li>
                  <li className="flex items-center py-1 first:mt-0">
                    <FiCheck className="h-4 w-4 text-blurple" />
                    <span className="mb-0 ml-3 text-neutral-100">
                      Interval Token Checks up to every hour
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-4">
                <Suspense
                  fallback={
                    <SkeletonDefault className="!h-[26px] !w-[150px]" />
                  }
                >
                  <SubscribeButton />
                </Suspense>
              </div>
            </div>
          )}
        </TitledBox>

        <TitledBox
          title="Danger Area"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          <Suspense fallback={<SkeletonDefault className="min-h-[400px]" />}>
            <ProfileDangerArea />
          </Suspense>
        </TitledBox>

        <TitledBox
          title="Developer Settings"
          className="col-span-full overflow-hidden md:col-span-6"
          extra={
            <span className="px-2 rounded bg-blurple border-blurple-legacy border font-medium">
              Beta
            </span>
          }
        >
          <div className="flex flex-col">
            <p className="text-neutral-200 text-base mb-4">
              Create up to 5 API keys to use the DTC-Web API for external
              services and tools. You can read more about the API{" "}
              <Link
                href="/developers"
                target="_blank"
                className="text-blurple hover:text-blurple-legacy transition duration-300"
              >
                here
              </Link>
              .
            </p>

            <Suspense fallback={<SkeletonDefault className="min-h-[400px]" />}>
              <DeveloperSettings />
            </Suspense>
          </div>
        </TitledBox>
      </div>
    </>
  );
}
