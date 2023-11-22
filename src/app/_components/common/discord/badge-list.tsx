import Image from "next/image";
import { type APIUser, UserPremiumType } from "discord-api-types/v10";
import clsx from "clsx";
import Tooltip from "~/app/_components/common/tooltip";
import { DISCORD_BADGE_FLAGS } from "~/consts/discord";
import { hasFlag, toTitleCase } from "~/lib/discord-utils";

interface IBadgeListProps extends React.HTMLAttributes<HTMLDivElement> {
  user: {
    id: APIUser["id"];
    flags?: APIUser["flags"] | bigint | null;
    premium_type?: APIUser["premium_type"] | null;
  };
}

const BadgeList: React.FC<IBadgeListProps> = ({
  user,
  className,
  ...props
}) => {
  return (
    <div className={clsx("flex items-center space-x-1", className)} {...props}>
      {user.flags
        ? Object.keys(DISCORD_BADGE_FLAGS)
            .filter((bit) => hasFlag(user.flags, bit))
            .map((flag) => (
              <Tooltip text={toTitleCase(flag)} key={`f-${flag}-${user.id}`}>
                <Image
                  src={`/images/badges/${flag.toLowerCase()}.svg`}
                  alt={toTitleCase(flag)}
                  width={12}
                  height={12}
                  draggable={false}
                  className="h-3 w-auto flex-shrink-0 select-none"
                />
              </Tooltip>
            ))
        : null}

      {user.premium_type && user.premium_type > UserPremiumType.None ? (
        <Tooltip
          text={
            ["Nitro Classic", "Nitro Full", "Nitro Basic"][
              user.premium_type - 1
            ] ?? "Unknown"
          }
        >
          <Image
            src={`/images/badges/nitro.svg`}
            alt="Discord Nitro"
            width={12}
            height={12}
            className="h-3 w-auto flex-shrink-0 select-none"
            draggable={false}
          />
        </Tooltip>
      ) : null}
    </div>
  );
};

export default BadgeList;
