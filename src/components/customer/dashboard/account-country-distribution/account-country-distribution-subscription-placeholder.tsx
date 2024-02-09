"use client";

import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";

export default function AccountCountryDistributionSubscriptionPlaceholder() {
  return (
    <TitledCard
      title="Country Overview"
      extra={
        <HelpTooltip>
          Shows accounts grouped by their selected locale
        </HelpTooltip>
      }
      className="h-full"
    >
      <SubscriptionRequiredCard feature="the country distribution" />
    </TitledCard>
  );
}
