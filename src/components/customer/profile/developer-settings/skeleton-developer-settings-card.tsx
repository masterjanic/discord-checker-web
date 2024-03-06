import TitledCard from "~/components/common/titled-card";
import { Badge } from "~/components/ui/badge";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonDeveloperSettingsCard() {
  return (
    <TitledCard title="Developer Settings" extra={<Badge>Beta</Badge>}>
      <div className="mb-4 space-y-1">
        <Skeleton className="w-full h-[20px]" />
        <Skeleton className="w-1/3 h-[20px]" />
      </div>

      <div className="space-y-1.5">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton
            key={`skeleton-developer-api-key-${i}`}
            className="w-full h-[66px]"
          />
        ))}
      </div>

      <Skeleton className="w-[114px] h-8 mt-4" />
    </TitledCard>
  );
}
