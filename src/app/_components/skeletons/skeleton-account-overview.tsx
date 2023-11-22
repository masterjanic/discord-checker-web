import SkeletonAccountCard from "~/app/_components/skeletons/skeleton-account-card";

export default function SkeletonAccountOverview() {
  return (
    <div className="mt-5 grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 27 }).map((_, i) => (
        <SkeletonAccountCard key={`skel-account-card-${i}`} />
      ))}
    </div>
  );
}
