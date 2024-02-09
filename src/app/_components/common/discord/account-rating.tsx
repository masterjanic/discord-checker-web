import { type DiscordAccount } from "@prisma/client";

import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export default function AccountRating({
  user,
}: {
  user: Pick<DiscordAccount, "rating">;
}) {
  const rating = user.rating;
  if (rating === null || rating === undefined) {
    return (
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger>
            <Badge variant="outline" className="h-7 w-7">
              ?
            </Badge>
          </TooltipTrigger>
          <TooltipContent align="end" side="bottom">
            This account is not rated yet
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger>
          <Badge
            className={cn(
              "h-7 w-7 inline-flex items-center justify-center",
              rating <= 25 &&
                "border-red-400 bg-red-600 hover:bg-red-600 text-red-100",
              rating > 25 &&
                rating < 50 &&
                "border-orange-400 bg-orange-600 hover:bg-orange-600 text-orange-100",
              rating >= 50 &&
                rating < 70 &&
                "border-yellow-400 bg-yellow-600 hover:bg-yellow-600 text-yellow-100",
              rating >= 70 &&
                "border-green-400 bg-green-600 hover:bg-green-600 text-green-100",
            )}
          >
            {rating}
          </Badge>
        </TooltipTrigger>
        <TooltipContent align="end" side="bottom">
          This is the rating of this account
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
