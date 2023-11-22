import { Suspense } from "react";
import TitledBox from "~/app/_components/common/box-with-title";
import AccountActionsRow from "~/app/_components/customer/accounts/account-actions-row";
import AccountGeneral from "~/app/_components/customer/accounts/account-general";
import AccountServerOverview from "~/app/_components/customer/accounts/account-server-overview";
import AccountTokens from "~/app/_components/customer/accounts/account-tokens";
import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";
import SkeletonServerOverview from "~/app/_components/skeletons/skeleton-server-overview";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-full overflow-hidden">
          <Suspense>
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
          <Suspense fallback={<SkeletonServerOverview />}>
            <AccountServerOverview userId={id} />
          </Suspense>
        </TitledBox>

        <TitledBox
          title="Account Tokens"
          className="col-span-full overflow-hidden md:col-span-6"
        >
          <Suspense fallback={<SkeletonDefault className="!h-[200px]" />}>
            <AccountTokens userId={id} />
          </Suspense>
        </TitledBox>
      </div>
    </>
  );
}
