"use client";

import { type APIGuild } from "discord-api-types/v10";
import Link from "next/link";
import { FaCircle, FaCrown } from "react-icons/fa";
import { FiHash, FiUser } from "react-icons/fi";

import Box from "~/app/_components/common/box";
import GuildIcon from "~/app/_components/common/discord/guild-icon";
import { api } from "~/trpc/react";

function AccountGuildCard({ guild }: { guild: APIGuild }) {
  return (
    <Box className="relative !px-3 !py-4 transition duration-200 hover:-translate-y-1">
      <div className="flex items-center gap-3">
        <div className="pointer-events-none h-12 w-12 select-none rounded-full border border-blueish-grey-500/20">
          <GuildIcon guild={guild} />
        </div>
        <div className="flex flex-col">
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
    </Box>
  );
}

export default function AccountGuildList({ userId }: { userId: string }) {
  const [guilds] = api.account.guild.getAll.useSuspenseQuery(userId);

  return (
    <div className="grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
      {guilds.map((guild) => (
        <Link href={`/accounts/${userId}/guilds/${guild.id}`} key={guild.id}>
          <AccountGuildCard guild={guild} />
        </Link>
      ))}
    </div>
  );
}
