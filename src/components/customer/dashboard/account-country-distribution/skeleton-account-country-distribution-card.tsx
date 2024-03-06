import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountCountryDistributionCard() {
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
      <Skeleton className="w-full h-[600px]" />
    </TitledCard>
  );
}
