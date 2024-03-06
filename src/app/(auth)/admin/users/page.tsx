import { Suspense } from "react";

import UserOverview from "~/app/_components/admin/user-overview";
import SkeletonAccountOverview from "~/app/_components/skeletons/skeleton-account-overview";
import { generateMetadata } from "~/lib/metadata";

export const metadata = generateMetadata({
  title: "User Overview",
  url: "/admin/users",
  robots: {
    index: false,
    follow: true,
  },
});

export default function Page() {
  return (
    <>
      <Suspense fallback={<SkeletonAccountOverview />}>
        <UserOverview />
      </Suspense>
    </>
  );
}
