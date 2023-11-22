import clsx from "clsx";

type TBackgroundGridProps = React.HTMLAttributes<HTMLDivElement>;

export default function BackgroundGrid({
  className,
  ...props
}: TBackgroundGridProps) {
  return (
    <div
      className={clsx(
        "background-grid pointer-events-none absolute inset-0 select-none opacity-[7.5%]",
        className,
      )}
      {...props}
    />
  );
}
