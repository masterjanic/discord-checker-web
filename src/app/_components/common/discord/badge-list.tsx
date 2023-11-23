import Image from "next/image";
import { type APIUser, UserPremiumType } from "discord-api-types/v10";
import clsx from "clsx";
import Tooltip from "~/app/_components/common/tooltip";
import { DISCORD_BADGE_FLAGS } from "~/consts/discord";
import { canLogin, hasFlag, isFlagged, toTitleCase } from "~/lib/discord-utils";

interface IBadgeListProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    id: APIUser["id"];
    flags?: APIUser["flags"] | bigint | null;
    premium_type?: APIUser["premium_type"] | null;
  };
  size?: number;
}

const BadgeList: React.FC<IBadgeListProps> = ({
  user,
  className,
  size = 12,
  ...props
}) => {
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
    <div className={clsx("flex items-center space-x-1", className)} {...props}>
      {!!user.flags &&
        Object.keys(DISCORD_BADGE_FLAGS)
          .filter((bit) => hasFlag(user.flags, bit))
          .map((flag) => (
            <Tooltip text={toTitleCase(flag)} key={`f-${flag}-${user.id}`}>
              <Image
                src={`/images/badges/${flag.toLowerCase()}.svg`}
                alt={toTitleCase(flag)}
                width={size}
                height={size}
                draggable={false}
                style={{ height: `${size}px` }}
                className="w-auto flex-shrink-0 select-none"
              />
            </Tooltip>
          ))}

      {additionalBadges.map(({ crieria, tooltip, name, className, badge }) => {
        if (crieria) {
          return (
            <Tooltip text={tooltip} key={`f-${name}-${user.id}`}>
              <Image
                src={`/images/badges/${badge}.svg`}
                alt={name}
                width={size}
                height={size}
                draggable={false}
                style={{ height: `${size}px` }}
                className={clsx("w-auto flex-shrink-0 select-none", className)}
              />
            </Tooltip>
          );
        }
      })}
    </div>
  );
};

export default BadgeList;
