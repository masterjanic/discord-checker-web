import { type DiscordAccount } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

import AccountRating from "~/app/_components/common/discord/account-rating";
import BadgeList from "~/app/_components/common/discord/badge-list";
import DiscordAvatar from "~/app/_components/common/discord/discord-avatar";
import { Card } from "~/components/ui/card";
import { isMigratedUser, usernameOrTag } from "~/lib/discord-utils";
import { cn } from "~/lib/utils";

interface AccountCardProps extends React.HTMLAttributes<HTMLDivElement> {
  demo?: boolean;
  account: Pick<
    DiscordAccount,
    | "id"
    | "username"
    | "discriminator"
    | "flags"
    | "avatar"
    | "rating"
    | "locale"
  >;
}

function AccountName({ account }: { account: AccountCardProps["account"] }) {
  if (isMigratedUser(account.discriminator)) {
    return <span className="font-medium">{usernameOrTag(account)}</span>;
  }

  return (
    <div className="truncate">
      <span className="font-medium">{account.username}</span>
      <span className="text-xs text-neutral-300">#{account.discriminator}</span>
    </div>
  );
}

export default function AccountCard({
  account,
  demo,
  className,
  ...props
}: AccountCardProps) {
  return (
    <Card
      className={cn(
        "relative !px-3 !py-4 text-center transition duration-200 hover:-translate-y-[2px]",
        className,
      )}
      {...props}
    >
      <div className="absolute right-4 top-4">
        <AccountRating user={account} />
      </div>
      <div className="flex items-center">
        {!demo && (
          <Link href={`/accounts/${account.id}`} className="flex-shrink-0">
            <DiscordAvatar user={account} />
          </Link>
        )}
        {demo && (
          <div className="flex-shrink-0">
            <Image
              src={account.avatar!}
              alt={`DTC-Web: Demo Avatar`}
              width={64}
              height={64}
              className="select-none rounded-full bg-background border pointer-events-none"
              draggable={false}
            />
          </div>
        )}

        <div className="ml-4 text-left">
          <div className="flex items-center space-x-1.5 text-sm">
            {!demo && (
              <Link
                href={`/accounts/${account.id}`}
                className="truncate max-w-[160px] md:max-w-[180px] lg:max-w-full"
              >
                <AccountName account={account} />
              </Link>
            )}
            {demo && (
              <div className="truncate max-w-[160px] md:max-w-[180px] lg:max-w-full">
                <AccountName account={account} />
              </div>
            )}

            <BadgeList user={account} className="hidden md:flex" />
          </div>
          <small className="text-xs text-neutral-300">{account.id}</small>
        </div>
      </div>
    </Card>
  );
}
