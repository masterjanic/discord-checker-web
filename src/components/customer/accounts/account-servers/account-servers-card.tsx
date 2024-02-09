"use client";

import Link from "next/link";
import React from "react";
import { FiChevronRight } from "react-icons/fi";
import {
  PiCircleDuotone,
  PiCrownDuotone,
  PiMagnifyingGlassDuotone,
  PiUsersDuotone,
} from "react-icons/pi";

import GuildIcon from "~/app/_components/common/discord/guild-icon";
import TitledCard from "~/components/common/titled-card";
import { buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

// TODO: Add sorting dropdown
export default function AccountServersCard({ userId }: { userId: string }) {
  const [allGuilds] = api.account.guild.getAll.useSuspenseQuery(userId);

  const guilds = allGuilds
    .sort(
      (a, b) =>
        Number(b.approximate_member_count) - Number(a.approximate_member_count),
    )
    .sort((a, b) => Number(b.owner) - Number(a.owner))
    .sort((a, b) => Number(b.permissions) - Number(a.permissions))
    .slice(0, 4);

  return (
    <TitledCard title="Account Servers">
      {guilds.length === 0 && (
        <div className="grid place-items-center h-full p-4">
          <p className="text-center font-light">This account has no servers.</p>
        </div>
      )}

      <div className="space-y-2">
        {guilds.map((guild) => (
          <Card key={`account-${userId}-guild-${guild.id}`} className="p-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Link href={`/accounts/${userId}/guilds/${guild.id}`}>
                  <div className="pointer-events-none h-12 w-12 select-none rounded-full border border-blueish-grey-500/20">
                    <GuildIcon guild={guild} />
                  </div>
                </Link>
                <div className="flex flex-col">
                  <Link href={`/accounts/${userId}/guilds/${guild.id}`}>
                    <h3 className="font-medium text-sm tracking-tight">
                      {guild.name}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-1.5">
                    <div className="flex items-center space-x-1">
                      <PiUsersDuotone className="text-muted-foreground" />
                      <span className="text-xs font-light">
                        {guild.approximate_member_count}
                      </span>
                    </div>
                    <Separator
                      orientation="horizontal"
                      className="w-[3px] h-[3px] rounded-full"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className="flex items-center space-x-1">
                            <PiCircleDuotone className="text-green-500" />
                            <span className="text-xs font-light">
                              {guild.approximate_presence_count}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Online members</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    {guild.owner && (
                      <>
                        <Separator
                          orientation="horizontal"
                          className="w-[4px] h-[4px] rounded-full"
                        />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <PiCrownDuotone className="text-yellow-400" />
                            </TooltipTrigger>
                            <TooltipContent>Server Owner</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <Link
                href={`/accounts/${userId}/guilds/${guild.id}`}
                className="flex-shrink-0"
              >
                <FiChevronRight className="w-6 h-6 hover:text-muted-foreground transition duration-300" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
      <Link
        href={`/accounts/${userId}/guilds`}
        className={cn(
          buttonVariants({
            variant: "default",
            size: "sm",
          }),
          "mt-4",
        )}
      >
        <PiMagnifyingGlassDuotone className="h-4 w-4 mr-2" />
        <span>Show all {allGuilds.length} servers</span>
      </Link>
    </TitledCard>
  );
}
