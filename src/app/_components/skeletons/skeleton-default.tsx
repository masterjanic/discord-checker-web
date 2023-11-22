import clsx from "clsx";

type TSkeletonDefaultProps = React.HTMLAttributes<HTMLDivElement>;

export default function SkeletonDefault({
  className,
  ...props
}: TSkeletonDefaultProps) {
  return (
    <div
      className={clsx(
        "h-full w-full animate-pulse rounded-md bg-blueish-grey-700",
        className,
      )}
      {...props}
    />
  );
}
