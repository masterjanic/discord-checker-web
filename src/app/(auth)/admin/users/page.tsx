import { Suspense } from "react";

import UserOverview from "~/app/_components/admin/user-overview";
import SkeletonAccountOverview from "~/app/_components/skeletons/skeleton-account-overview";

export const metadata = {
  title: "User Overview | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <>
      <Suspense fallback={<SkeletonAccountOverview />}>
        <UserOverview />
      </Suspense>
    </>
  );
}
