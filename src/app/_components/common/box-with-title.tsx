import clsx from "clsx";
import Box from "~/app/_components/common/box";

interface IBoxWithTitle extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
}

export default function TitledBox({
  title,
  className,
  children,
  ...props
}: IBoxWithTitle) {
  return (
    <Box className={clsx(className, "!p-0")} {...props}>
      <h3 className="p-4 font-medium">{title}</h3>
      <div className="border-t border-neutral-100/10 p-4">{children}</div>
    </Box>
  );
}
