import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountTokensCard() {
  return (
    <TitledCard title="Account Tokens">
      <Skeleton className="w-full h-full min-h-[63px]" />
    </TitledCard>
  );
}
