"use client";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountHistoryCard() {
  return (
    <TitledCard
      title="Account History"
      extra={
        <HelpTooltip>Shows recent profile changes of this account</HelpTooltip>
      }
    >
      <Skeleton className="w-full h-full min-h-[127px]" />
    </TitledCard>
  );
}
