import { PiQuestionDuotone } from "react-icons/pi";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function HelpTooltip({
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TooltipContent>) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger>
          <PiQuestionDuotone className="w-5 h-5" />
        </TooltipTrigger>
        <TooltipContent align="end" {...props}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
