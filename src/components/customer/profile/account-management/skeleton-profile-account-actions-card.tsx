"use client";

import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonProfileAccountActionsCard() {
  return (
    <TitledCard
      title="Account Management"
      extra={
        <HelpTooltip>
          These actions are immediate and can not be reverted
        </HelpTooltip>
      }
    >
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={`skeleton-profile-action-${i}`}
            className="w-full h-[100px]"
          />
        ))}
      </div>
    </TitledCard>
  );
}
