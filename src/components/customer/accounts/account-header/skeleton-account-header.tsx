import { Skeleton } from "~/components/ui/skeleton";

export default function SkeletonAccountHeader() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between mt-2">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="flex flex-col">
          <Skeleton className="h-8 w-[160px] mb-1.5" />
          <div className="flex items-center space-x-1">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Skeleton className="w-[99px] h-8" />
        <Skeleton className="h-8 w-[108px]" />
        <Skeleton className="h-[36px] w-[36px]" />
      </div>
    </div>
  );
}
