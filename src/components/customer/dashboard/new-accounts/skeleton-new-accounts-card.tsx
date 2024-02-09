import TitledCard from "~/components/common/titled-card";
import { Button } from "~/components/ui/button";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonNewAccountsCard() {
  return (
    <TitledCard
      extra={
        <Button variant="outline" size="sm" disabled>
          Filter
        </Button>
      }
      title="New Accounts"
    >
      <Skeleton className="h-full w-full" />
    </TitledCard>
  );
}
