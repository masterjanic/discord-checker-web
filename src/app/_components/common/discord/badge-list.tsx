import { UserPremiumType, type APIUser } from "discord-api-types/v10";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { DISCORD_BADGE_FLAGS } from "~/consts/discord";
import { canLogin, hasFlag, isFlagged, toTitleCase } from "~/lib/discord-utils";
import { cn } from "~/lib/utils";

interface BadgeListProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    id: APIUser["id"];
    flags?: APIUser["flags"] | bigint | null;
    premium_type?: APIUser["premium_type"] | null;
  };
  size?: number;
}

export default function BadgeList({
  user,
  className,
  size = 12,
  ...props
}: BadgeListProps) {
  const additionalBadges = [
    {
      name: "Discord Nitro",
      badge: "nitro",
      tooltip: ["Nitro Classic", "Nitro Full", "Nitro Basic", "Unknown"][
        (user.premium_type ?? 4) - 1
      ]!,
      className: "",
      crieria: user.premium_type && user.premium_type > UserPremiumType.None,
    },
    {
      name: "Flagged Badge",
      badge: "flagged",
      tooltip: "Flagged Account",
      className: "p-px",
      crieria: isFlagged(user.flags),
    },
    {
      name: "Disabled Badge",
      badge: "disabled",
      tooltip: "Account Disabled",
      className: "",
      crieria: !canLogin(user.flags),
    },
  ] as const;

  return (
    <div className={cn("flex items-center space-x-1", className)} {...props}>
      {!!user.flags &&
        Object.keys(DISCORD_BADGE_FLAGS)
          .filter((bit) => hasFlag(user.flags, bit))
          .map((flag) => (
            <div key={`f-${flag}-${user.id}`}>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipContent>{toTitleCase(flag)}</TooltipContent>
                  <TooltipTrigger>
                    <Image
                      src={`/images/badges/${flag.toLowerCase()}.svg`}
                      alt={toTitleCase(flag)}
                      width={size}
                      height={size}
                      draggable={false}
                      style={{ height: `${size}px` }}
                      className="w-auto flex-shrink-0 select-none"
                    />
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          ))}

      {additionalBadges
        .filter((badge) => badge.crieria)
        .map(({ tooltip, name, className, badge }) => {
          return (
            <div key={`f-${name}-${user.id}`}>
              <TooltipProvider>
                <Tooltip delayDuration={300}>
                  <TooltipContent>{tooltip}</TooltipContent>
                  <TooltipTrigger>
                    <Image
                      src={`/images/badges/${badge}.svg`}
                      alt={name}
                      width={size}
                      height={size}
                      draggable={false}
                      style={{ height: `${size}px` }}
                      className={cn(
                        "w-auto flex-shrink-0 select-none",
                        className,
                      )}
                    />
                  </TooltipTrigger>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        })}
    </div>
  );
}
