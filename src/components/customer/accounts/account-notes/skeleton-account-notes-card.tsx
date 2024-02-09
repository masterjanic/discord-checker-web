import TitledCard from "~/components/common/titled-card";
import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountNotesCard() {
  return (
    <TitledCard title="Personal Notes">
      <div className="flex flex-col space-y-2">
        <Skeleton className="w-full h-[118px]" />
        <Skeleton className="ml-1.5 w-[114px] h-[19px]" />
      </div>
    </TitledCard>
  );
}
