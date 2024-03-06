"use client";

import React from "react";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountPaymentMethodsCard() {
  return (
    <TitledCard
      title="Payment Methods"
      extra={
        <HelpTooltip>Shows saved payment methods for this account</HelpTooltip>
      }
    >
      <div className="space-y-2">
        <Skeleton className="w-full h-[70px]" />
        <Skeleton className="w-full h-[70px]" />
      </div>
    </TitledCard>
  );
}
