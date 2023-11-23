import SkeletonDefault from "~/app/_components/skeletons/skeleton-default";

export default function SkeletonAccountActionsRow() {
  return (
    <div className="flex space-x-2">
      <SkeletonDefault className="!h-[29px] !w-[105px]" />
      <SkeletonDefault className="!h-[29px] !w-[137px]" />
    </div>
  );
}
