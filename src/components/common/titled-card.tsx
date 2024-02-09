import { Card } from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface TitledCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string;
  extra?: React.ReactNode;
}

export default function TitledCard({
  title,
  className,
  children,
  extra,
  ...props
}: TitledCardProps) {
  return (
    <Card className={cn(className, "flex flex-col p-0")} {...props}>
      <div className="flex justify-between items-center p-4 bg-secondary/30 rounded-t-md">
        <h3 className="shrink-0 font-medium">{title}</h3>
        {extra}
      </div>
      <div className="h-full flex-1 overflow-auto border-t p-4">{children}</div>
    </Card>
  );
}
