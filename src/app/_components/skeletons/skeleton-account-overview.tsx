import SkeletonAccountCard from "~/app/_components/skeletons/skeleton-account-card";

interface ISkeletonAccountOverviewProps {
  items?: number;
}

export default function SkeletonAccountOverview({
  items = 30,
}: ISkeletonAccountOverviewProps) {
  return (
    <div className="mt-5 grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonAccountCard key={`skel-account-card-${i}`} />
      ))}
    </div>
  );
}
