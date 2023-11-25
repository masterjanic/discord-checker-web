import { Suspense } from "react";

import AccountOverview from "~/app/_components/customer/account-overview";
import SkeletonAccountOverview from "~/app/_components/skeletons/skeleton-account-overview";

export const metadata = {
  title: "Manage Accounts | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <>
      <Suspense fallback={<SkeletonAccountOverview />}>
        <AccountOverview />
      </Suspense>
    </>
  );
}
