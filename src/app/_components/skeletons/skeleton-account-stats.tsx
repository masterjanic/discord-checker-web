export default function SkeletonAccountStats() {
  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-4 overflow-hidden md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          className="h-[118px] w-full animate-pulse rounded-md border border-neutral-100/10 bg-blueish-grey-700"
          key={`skel-account-stats-${i}`}
        />
      ))}
    </div>
  );
}
