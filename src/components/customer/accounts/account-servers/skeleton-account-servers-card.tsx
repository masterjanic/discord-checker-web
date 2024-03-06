"use client";

import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountServersCard() {
  return (
    <TitledCard title="Account Servers">
      <div className="space-y-2">
        <Skeleton className="w-full h-[66px]" />
        <Skeleton className="w-full h-[66px]" />
        <Skeleton className="w-full h-[66px]" />
        <Skeleton className="w-full h-[66px]" />
      </div>
      <Skeleton className="w-[160px] h-8 mt-4" />
    </TitledCard>
  );
}
