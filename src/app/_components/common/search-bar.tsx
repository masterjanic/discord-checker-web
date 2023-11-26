import clsx from "clsx";
import { FiSearch } from "react-icons/fi";

type TSearchBarProps = React.HTMLAttributes<HTMLInputElement>;

export default function SearchBar({ className, ...props }: TSearchBarProps) {
  return (
    <div className={clsx("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <FiSearch className="h-4 w-4 text-neutral-300" />
      </div>
      <input
        type="text"
        inputMode="search"
        spellCheck={false}
        className="w-full rounded-md border border-neutral-100/10 bg-blueish-grey-800 px-5 py-3 pl-10 text-sm text-neutral-100 caret-blurple-dark transition-colors duration-300 focus:border-blurple-dark focus:outline-none disabled:opacity-50"
        {...props}
      />
    </div>
  );
}
