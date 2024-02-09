"use client";

import React from "react";

import SubscriptionRequiredCard from "~/app/_components/customer/subscription-required-card";
import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";

export default function AccountPaymentMethodsSubscriptionPlaceholder() {
  return (
    <TitledCard
      title="Payment Methods"
      extra={
        <HelpTooltip>Shows saved payment methods for this account</HelpTooltip>
      }
    >
      <SubscriptionRequiredCard feature="the saved payment methods" />
    </TitledCard>
  );
}
