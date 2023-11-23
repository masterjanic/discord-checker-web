import { Suspense } from "react";
import Box from "~/app/_components/common/box";
import AccountCountryDistribution from "~/app/_components/customer/account-country-distribution";
import AccountStats from "~/app/_components/customer/account-stats";
import ChromeExtensionBanner from "~/app/_components/customer/chrome-extension-banner";
import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import SkeletonAccountStats from "~/app/_components/skeletons/skeleton-account-stats";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import { isUserSubscribed } from "~/lib/auth";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Dashboard - Discord Token Checker",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <ChromeExtensionBanner />

      {/**
       * TODO: Import tokens button, check button
       */}

      <Suspense fallback={<SkeletonAccountStats />}>
        <AccountStats />
      </Suspense>

      <div className="mt-5">
        <div className="pb-5 leading-[15px]">
          <h1 className="text-xl font-bold">Country Overiew</h1>
          <span className="text-base text-neutral-300">
            Stored accounts by their location
          </span>
        </div>

        <Box className="h-96 w-full bg-opacity-80 !p-2">
          {isUserSubscribed(session?.user) ? (
            <Suspense fallback={<SkeletonDefault />}>
              <AccountCountryDistribution />
            </Suspense>
          ) : (
            <SubscriptionRequiredCard feature="the country distribution" />
          )}
        </Box>
      </div>
    </>
  );
}
