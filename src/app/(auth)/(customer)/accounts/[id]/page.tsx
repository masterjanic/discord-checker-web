import { redirect } from "next/navigation";
import { Suspense } from "react";

import TitledBox from "~/app/_components/common/box-with-title";
import AccountActionsRow from "~/app/_components/customer/accounts/account-actions-row";
import AccountBilling from "~/app/_components/customer/accounts/account-billing";
import AccountGeneral from "~/app/_components/customer/accounts/account-general";
import AccountHeader from "~/app/_components/customer/accounts/account-header";
import AccountNotes from "~/app/_components/customer/accounts/account-notes";
import AccountServerOverview from "~/app/_components/customer/accounts/account-server-overview";
import AccountTokens from "~/app/_components/customer/accounts/account-tokens";
import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import SkeletonAccountActionsRow from "~/app/_components/skeletons/skeleton-account-actions-row";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import SkeletonServerOverview from "~/app/_components/skeletons/skeleton-server-overview";
import AccountHistory from "~/app/(auth)/(customer)/accounts/[id]/account-history";
import { isUserSubscribed } from "~/lib/auth";
import { isValidSnowflake } from "~/lib/discord-utils";
import { getServerAuthSession } from "~/server/auth";

export const metadata = {
  title: "Account Overview | DTC-Web",
  robots: {
    index: false,
    follow: true,
  },
};

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!isValidSnowflake(id)) {
    redirect("/accounts");
  }

  const session = await getServerAuthSession();

  return (
    <>
      <div className="mb-6">
        <Suspense
          fallback={<SkeletonDefault className="!h-[64px] !w-[500px]" />}
        >
          <AccountHeader userId={id} />
        </Suspense>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full overflow-hidden">
          <Suspense fallback={<SkeletonAccountActionsRow />}>
            <AccountActionsRow userId={id} />
          </Suspense>
        </div>

        <TitledBox
          title="General Information"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          <Suspense fallback={<SkeletonDefault className="!h-[373px]" />}>
            <AccountGeneral userId={id} />
          </Suspense>
        </TitledBox>

        <TitledBox
          title="Server Overview"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          {isUserSubscribed(session?.user) ? (
            <Suspense fallback={<SkeletonServerOverview />}>
              <AccountServerOverview userId={id} />
            </Suspense>
          ) : (
            <SubscriptionRequiredCard
              feature="the server overview"
              skeleton={<SkeletonServerOverview />}
            />
          )}
        </TitledBox>

        <TitledBox
          title="Account Tokens"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          <Suspense fallback={<SkeletonDefault className="!h-[200px]" />}>
            <AccountTokens userId={id} />
          </Suspense>
        </TitledBox>

        <TitledBox
          title="Payment Methods"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          {isUserSubscribed(session?.user) ? (
            <Suspense fallback={<SkeletonDefault className="!h-[160px]" />}>
              <AccountBilling userId={id} />
            </Suspense>
          ) : (
            <SubscriptionRequiredCard feature="the payment methods" />
          )}
        </TitledBox>

        <TitledBox
          title="Account History"
          extra={
            <span className="px-2 rounded bg-blurple border-blurple-legacy border font-medium">
              Beta
            </span>
          }
          className="col-span-full overflow-hidden md:col-span-6"
        >
          {isUserSubscribed(session?.user) ? (
            <Suspense fallback={<SkeletonDefault className="!h-[160px]" />}>
              <AccountHistory userId={id} />
            </Suspense>
          ) : (
            <SubscriptionRequiredCard feature="the account history" />
          )}
        </TitledBox>

        <TitledBox
          title="Notes"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          <Suspense fallback={<SkeletonDefault className="!h-[200px]" />}>
            <AccountNotes userId={id} />
          </Suspense>
        </TitledBox>
      </div>
    </>
  );
}
