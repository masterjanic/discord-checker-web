import HelpTooltip from "~/components/common/help-tooltip";
import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountsOverTimeCard() {
  return (
    <TitledCard
      title="Accounts over Time"
      extra={
        <HelpTooltip>
          Shows the number of accounts created over the past 14 days
        </HelpTooltip>
      }
    >
      <Skeleton className="h-full w-full" />
    </TitledCard>
  );
}
