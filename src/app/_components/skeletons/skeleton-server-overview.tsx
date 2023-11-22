import clsx from "clsx";

export default function SkeletonServerOverview() {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          className={clsx(
            "h-[66px] animate-pulse cursor-pointer border-x border-t border-blueish-grey-500/20 bg-blueish-grey-700 p-2 hover:bg-blueish-grey-600/80",
            index === 0 && "rounded-t",
            index === 4 && "rounded-b border-b",
          )}
          key={`skel-guild-preview-${index}`}
        />
      ))}
    </>
  );
}
