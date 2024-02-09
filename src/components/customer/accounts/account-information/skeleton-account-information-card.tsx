"use client";

import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountInformationCard() {
  return (
    <TitledCard
      title="User Information"
      extra={<Skeleton className="w-[28px] h-[28px]" />}
    >
      <Skeleton className="h-full w-full min-h-[385px]" />
    </TitledCard>
  );
}
