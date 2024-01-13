import { Suspense } from "react";

import AccountOverview from "~/app/_components/customer/account-overview";
import SkeletonAccountOverview from "~/app/_components/skeletons/skeleton-account-overview";
import { generateMetadata } from "~/lib/metadata";

export const metadata = generateMetadata({
  title: "Manage Accounts",
  url: "/accounts",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  return (
    <>
      <Suspense fallback={<SkeletonAccountOverview />}>
        <AccountOverview />
      </Suspense>
    </>
  );
}
