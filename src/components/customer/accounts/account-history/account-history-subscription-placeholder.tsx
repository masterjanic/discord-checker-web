"use client";

import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function AccountHistorySubscriptionPlaceholder() {
  return (
    <TitledCard
      title="Account History"
      extra={
        <HelpTooltip>Shows recent profile changes of this account</HelpTooltip>
      }
    >
      <SubscriptionRequiredCard
        feature="the account history"
        skeleton={<Skeleton className="w-full h-full min-h-[127px]" />}
      />
    </TitledCard>
  );
}
