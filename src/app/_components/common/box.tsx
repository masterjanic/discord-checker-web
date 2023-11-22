import clsx from "clsx";

type TBoxProps = React.HTMLAttributes<HTMLDivElement>;

export default function Box({ className, children, ...props }: TBoxProps) {
  return (
    <div
      className={clsx(
        "rounded-md border border-neutral-100/10 bg-blueish-grey-800 p-8 sm:p-12",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
