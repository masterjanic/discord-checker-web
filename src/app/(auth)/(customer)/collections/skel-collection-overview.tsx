export default function SkeletonCollectionOverview() {
  return (
    <div className="max-w-screen-2xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6">
        {Array.from({ length: 16 }).map((_, i) => (
          <div
            className="w-44 h-44 animate-pulse rounded-md bg-blueish-grey-700"
            key={`skel-collection-overview-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
