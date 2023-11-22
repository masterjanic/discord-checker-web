import clsx from "clsx";

type TContainerProps = React.HTMLAttributes<HTMLDivElement>;

export default function Container({
  children,
  className,
  ...props
}: TContainerProps) {
  return (
    <div
      className={clsx("mx-auto max-w-7xl px-4 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </div>
  );
}
