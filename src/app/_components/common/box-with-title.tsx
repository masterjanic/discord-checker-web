import clsx from "clsx";

import Box from "~/app/_components/common/box";

interface IBoxWithTitle extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  extra?: React.ReactNode;
}

export default function TitledBox({
  title,
  className,
  children,
  extra,
  ...props
}: IBoxWithTitle) {
  return (
    <Box className={clsx(className, "flex flex-col !p-0")} {...props}>
      <div className="flex justify-between items-center p-4">
        <h3 className="shrink-0 font-medium">{title}</h3>
        {extra}
      </div>
      <div className="h-full flex-1 overflow-auto border-t border-neutral-100/10 p-4">
        {children}
      </div>
    </Box>
  );
}
