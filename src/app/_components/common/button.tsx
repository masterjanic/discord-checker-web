import clsx from "clsx";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const btnVariants = {
  primary: "bg-blurple hover:bg-blurple-dark",
  secondary:
    "!bg-blueish-grey-700 hover:!bg-blueish-grey-800 !border-neutral-100/10",
} as const;

export const btnStyle =
  "inline-flex cursor-pointer items-center justify-center space-x-2 rounded-md border border-blurple-legacy bg-blurple px-2.5 py-1 text-center text-xs text-neutral-100 shadow-sm outline-none outline-0 transition-all duration-300 ease-out hover:bg-blurple-dark disabled:opacity-50";

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: IButtonProps) {
  return (
    <button
      className={clsx(btnStyle, btnVariants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}
