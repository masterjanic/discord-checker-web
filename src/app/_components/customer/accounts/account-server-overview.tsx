"use client";

import clsx from "clsx";
import { FaCircle, FaCrown } from "react-icons/fa";
import { FiHash, FiSearch, FiUser } from "react-icons/fi";

import Button from "~/app/_components/common/button";
import GuildIcon from "~/app/_components/common/discord/guild-icon";
import { api } from "~/trpc/react";

interface IAccountServerOverviewProps {
  userId: string;
}

export default function AccountServerOverview({
  userId,
}: IAccountServerOverviewProps) {
  const [guilds] = api.account.getGuilds.useSuspenseQuery(userId);

  const previewGuilds = guilds
    .sort(
      (a, b) =>
        Number(b.approximate_member_count) - Number(a.approximate_member_count),
    )
    .sort((a, b) => Number(b.owner) - Number(a.owner))
    .sort((a, b) => Number(b.permissions) - Number(a.permissions))
    .slice(0, 5);

  return (
    <>
      {guilds.length === 0 && (
        <div className="grid place-items-center h-full p-4 text-neutral-200">
          <p>This account has no servers.</p>
        </div>
      )}

      {previewGuilds.map((guild, index) => (
        <div
          className={clsx(
            "cursor-pointer border-x border-t border-blueish-grey-500/20 bg-blueish-grey-700 p-2 transition duration-300 hover:bg-blueish-grey-600/80",
            index === 0 && "rounded-t",
            index === previewGuilds.length - 1 && "rounded-b border-b",
          )}
          key={`guild-preview-${guild.id}`}
        >
          <div className="flex space-x-4">
            <div className="pointer-events-none h-12 w-12 select-none rounded-full border border-blueish-grey-500/20">
              <GuildIcon guild={guild} />
            </div>
            <div>
              <p className="mb-1 text-sm font-medium">{guild.name}</p>
              <div className="flex items-center space-x-2 text-sm font-light text-neutral-200">
                <div className="flex items-center space-x-1.5">
                  <FiHash className="h-3 w-3" />
                  <span>{guild.id}</span>
                </div>
                <hr className="h-3 border-l border-blueish-grey-500/40" />
                <div className="flex items-center space-x-1.5">
                  <FiUser className="h-3 w-3" />
                  <span>{guild.approximate_member_count}</span>
                </div>
                <hr className="h-3 border-l border-blueish-grey-500/40" />
                <div className="flex items-center space-x-1.5">
                  <FaCircle className="h-3 w-3 text-green-300" />
                  <span>{guild.approximate_member_count}</span>
                </div>
                {guild.owner && (
                  <>
                    <hr className="h-3 border-l border-blueish-grey-500/40" />
                    <div className="flex items-center space-x-1.5">
                      <FaCrown className="h-3 w-3 text-yellow-300" />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {guilds.length > previewGuilds.length && (
        <Button className="mt-4">
          <FiSearch className="h-4 w-4" />
          <span>Show all {guilds.length} servers</span>
        </Button>
      )}
    </>
  );
}
