import clsx from "clsx";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const styles = {
  primary: "bg-blurple hover:bg-blurple-dark",
  secondary: "bg-blueish-grey-700 hover:bg-blueish-grey-800",
} as const;

export default function Button({
  variant = "primary",
  children,
  className,
  ...props
}: IButtonProps) {
  return (
    <button
      className={clsx(
        "inline-flex cursor-pointer items-center justify-center space-x-2 rounded-md border border-blurple-legacy bg-blurple px-2.5 py-1 text-center text-xs text-neutral-100 shadow-sm outline-none outline-0 transition-all duration-300 ease-out hover:bg-blurple-dark disabled:opacity-50",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
