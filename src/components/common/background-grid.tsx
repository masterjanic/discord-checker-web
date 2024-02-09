import { cn } from "~/lib/utils";

export default function BackgroundGrid({
  className,
  isometric = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { isometric?: boolean }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 select-none opacity-[7.5%]",
        !isometric ? "background-grid" : "background-grid-isometric",
        className,
      )}
      {...props}
    />
  );
}
