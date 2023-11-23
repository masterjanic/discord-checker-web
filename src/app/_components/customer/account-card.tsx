import { type DiscordAccount } from "@prisma/client";
import clsx from "clsx";
import Box from "~/app/_components/common/box";
import AccountRating from "~/app/_components/common/discord/account-rating";
import BadgeList from "~/app/_components/common/discord/badge-list";
import DiscordAvatar from "~/app/_components/common/discord/discord-avatar";
import { isMigratedUser, usernameOrTag } from "~/lib/discord-utils";

interface IAccountCardProps extends React.HTMLAttributes<HTMLDivElement> {
  account: Pick<
    DiscordAccount,
    "id" | "username" | "discriminator" | "flags" | "avatar" | "rating"
  >;
}

export default function AccountCard({
  account,
  className,
  ...props
}: IAccountCardProps) {
  return (
    <Box
      className={clsx(
        "relative !px-3 !py-4 text-center transition duration-200 hover:-translate-y-1",
        className,
      )}
      {...props}
    >
      <div className="absolute right-4 top-4">
        <AccountRating user={account} />
      </div>
      <div className="flex items-center">
        <DiscordAvatar user={account} />
        <div className="ml-4 text-left">
          <div className="flex items-center space-x-2 truncate text-sm">
            {isMigratedUser(account.discriminator) ? (
              <span className="font-medium">{usernameOrTag(account)}</span>
            ) : (
              <div className="truncate">
                <span className="font-medium">{account.username}</span>
                <span className="text-xs text-neutral-300">
                  #{account.discriminator}
                </span>
              </div>
            )}
            <BadgeList user={account} className="hidden md:flex" />
          </div>
          <small className="text-xs text-neutral-300">{account.id}</small>
        </div>
      </div>
    </Box>
  );
}
