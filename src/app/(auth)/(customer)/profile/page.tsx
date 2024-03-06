import { Suspense } from "react";

import ProfileAccountActionsCard from "~/components/customer/profile/account-management/profile-account-actions-card";
import SkeletonProfileAccountActionsCard from "~/components/customer/profile/account-management/skeleton-profile-account-actions-card";
import DeveloperSettingsCard from "~/components/customer/profile/developer-settings/developer-settings-card";
import SkeletonDeveloperSettingsCard from "~/components/customer/profile/developer-settings/skeleton-developer-settings-card";
import ManageSubscriptionCard from "~/components/customer/profile/manage-subscription-card";
import { generateMetadata } from "~/lib/metadata";
import { auth } from "~/server/auth";

export const metadata = generateMetadata({
  title: "Manage Profile",
  url: "/profile",
  robots: {
    index: true,
    follow: true,
  },
});

export default async function Page() {
  const session = await auth();
  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full overflow-hidden md:col-span-6">
          <ManageSubscriptionCard session={session} />
        </div>
        <div className="col-span-full overflow-hidden md:col-span-6">
          <Suspense fallback={<SkeletonProfileAccountActionsCard />}>
            <ProfileAccountActionsCard />
          </Suspense>
        </div>

        <div className="col-span-full overflow-hidden md:col-span-6">
          <Suspense fallback={<SkeletonDeveloperSettingsCard />}>
            <DeveloperSettingsCard />
          </Suspense>
        </div>
      </div>
    </>
  );
}
