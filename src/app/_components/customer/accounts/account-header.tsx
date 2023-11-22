"use client";

import BadgeList from "~/app/_components/common/discord/badge-list";
import DiscordAvatar from "~/app/_components/common/discord/discord-avatar";
import { isMigratedUser } from "~/lib/discord-utils";
import { api } from "~/trpc/react";

interface IAccountHeaderProps {
  userId: string;
}

export default function AccountHeader({ userId }: IAccountHeaderProps) {
  const [account] = api.account.get.useSuspenseQuery(userId);

  return (
    <div className="flex items-center space-x-4">
      <DiscordAvatar user={account} />
      <div>
        <div className="mb-1.5">
          {isMigratedUser(account.discriminator) ? (
            <h1 className="text-2xl font-medium">@{account.username}</h1>
          ) : (
            <h1 className="text-2xl font-medium">
              <span>{account.username}</span>
              <small className="text-base text-neutral-300">
                #{account.discriminator}
              </small>
            </h1>
          )}
        </div>

        <BadgeList user={account} size={16} />
      </div>
    </div>
  );
}
