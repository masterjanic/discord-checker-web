import clsx from "clsx";

interface ITooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
}

export default function Tooltip({
  children,
  className,
  text,
  ...props
}: ITooltipProps) {
  return (
    <div className={clsx("group hover:cursor-pointer", className)} {...props}>
      <span className="invisible absolute -mt-8 rounded-md border border-blueish-grey-500/60 bg-blueish-grey-600 px-2 py-1 text-xs transition duration-200 group-hover:visible group-hover:z-50">
        {text}
      </span>
      {children}
    </div>
  );
}
