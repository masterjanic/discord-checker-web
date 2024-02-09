import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountOverview({
  items = 30,
}: {
  items?: number;
}) {
  return (
    <div className="mt-5 grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, i) => (
        <Skeleton className="w-full h-[98px]" key={`skel-account-card-${i}`} />
      ))}
    </div>
  );
}
