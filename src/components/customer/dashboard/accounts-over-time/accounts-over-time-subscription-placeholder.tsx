"use client";

import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";

export default function AccountsOverTimeSubscriptionPlaceholder() {
  return (
    <TitledCard
      title="Accounts over Time"
      extra={
        <HelpTooltip>
          Shows the number of accounts created over the past 14 days
        </HelpTooltip>
      }
    >
      <SubscriptionRequiredCard feature="the accounts over time" />
    </TitledCard>
  );
}
