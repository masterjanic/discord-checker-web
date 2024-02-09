import { Suspense } from "react";

import AccountCountryDistributionCard from "~/components/customer/dashboard/account-country-distribution/account-country-distribution-card";
import AccountCountryDistributionSubscriptionPlaceholder from "~/components/customer/dashboard/account-country-distribution/account-country-distribution-subscription-placeholder";
import SkeletonAccountCountryDistributionCard from "~/components/customer/dashboard/account-country-distribution/skeleton-account-country-distribution-card";
import AccountCountStats from "~/components/customer/dashboard/account-stats/account-count-stats";
import SkeletonAccountCountStats from "~/components/customer/dashboard/account-stats/skeleton-account-count-stats";
import AccountsOverTimeCard from "~/components/customer/dashboard/accounts-over-time/accounts-over-time-card";
import AccountsOverTimeSubscriptionPlaceholder from "~/components/customer/dashboard/accounts-over-time/accounts-over-time-subscription-placeholder";
import SkeletonAccountsOverTimeCard from "~/components/customer/dashboard/accounts-over-time/skeleton-accounts-over-time-card";
import ChromeExtensionBanner from "~/components/customer/dashboard/chrome-extension-banner";
import NewAccountsCard from "~/components/customer/dashboard/new-accounts/new-accounts-card";
import SkeletonNewAccountsCard from "~/components/customer/dashboard/new-accounts/skeleton-new-accounts-card";
import RequiredSubscriptionWrapper from "~/components/customer/required-subscription-wrapper";
import { generateMetadata } from "~/lib/metadata";
import { getServerAuthSession } from "~/server/auth";

export const metadata = generateMetadata({
  title: "Dashboard",
  url: "/dashboard",
  robots: {
    index: false,
    follow: true,
  },
});

export default async function Page() {
  const session = await getServerAuthSession();

  return (
    <>
      <ChromeExtensionBanner />

      <Suspense fallback={<SkeletonAccountCountStats />}>
        <AccountCountStats />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <RequiredSubscriptionWrapper
          session={session}
          placeholder={<AccountCountryDistributionSubscriptionPlaceholder />}
        >
          <Suspense fallback={<SkeletonAccountCountryDistributionCard />}>
            <AccountCountryDistributionCard />
          </Suspense>
        </RequiredSubscriptionWrapper>

        <div className="grid grid-rows-1 md:grid-rows-2 gap-4">
          <Suspense fallback={<SkeletonNewAccountsCard />}>
            <NewAccountsCard />
          </Suspense>

          <RequiredSubscriptionWrapper
            session={session}
            placeholder={<AccountsOverTimeSubscriptionPlaceholder />}
          >
            <Suspense fallback={<SkeletonAccountsOverTimeCard />}>
              <AccountsOverTimeCard />
            </Suspense>
          </RequiredSubscriptionWrapper>
        </div>
      </div>
    </>
  );
}
