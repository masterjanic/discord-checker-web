import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountCountStats() {
  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-4 overflow-hidden md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton
          className="h-[118px] w-full"
          key={`skeleton-account-count-stats-${index}`}
        />
      ))}
    </div>
  );
}
