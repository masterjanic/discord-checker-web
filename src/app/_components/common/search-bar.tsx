import { PiMagnifyingGlassDuotone } from "react-icons/pi";

import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export default function SearchBar({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-4">
        <PiMagnifyingGlassDuotone className="h-4 w-4" />
      </div>
      <Input
        type="text"
        inputMode="search"
        spellCheck={false}
        className="w-full pl-10 caret-primary"
        {...props}
      />
    </div>
  );
}
