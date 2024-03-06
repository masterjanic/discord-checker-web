"use client";

import Link from "next/link";
import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

import BadgeList from "~/app/_components/common/discord/badge-list";
import DiscordAvatar from "~/app/_components/common/discord/discord-avatar";
import TitledCard from "~/components/common/titled-card";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { usernameOrTag } from "~/lib/discord-utils";
import { getRelativeTime } from "~/lib/time";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function NewAccountsCard() {
  const [filters, setFilters] = useState<
    Record<"verified" | "nitro", true | undefined>
  >({
    verified: undefined,
    nitro: undefined,
  });

  const [accounts] = api.dashboard.getNewAccounts.useSuspenseQuery(filters, {
    refetchInterval: 30_000,
  });

  function FilterMenu() {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            Filter
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            checked={filters.verified}
            onCheckedChange={(value) =>
              setFilters((prev) => ({ ...prev, verified: value || undefined }))
            }
          >
            Verified
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={filters.nitro}
            onCheckedChange={(value) =>
              setFilters((prev) => ({ ...prev, nitro: value || undefined }))
            }
          >
            Nitro
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <TitledCard extra={<FilterMenu />} title="New Accounts">
      {accounts.length === 0 && (
        <div className="h-full w-full grid place-items-center">
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold">No Accounts</h2>
            <p className="text-sm">
              There are no new accounts that match the current search criteria.
            </p>
          </div>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="divide-y">
          {accounts.map((account, index) => (
            <div
              className={cn(
                "flex items-center justify-between",
                index !== 0 && "pt-3",
                index !== accounts.length - 1 && "pb-3",
              )}
              key={`new-account-${account.id}`}
            >
              <div className="flex space-x-4 items-center">
                <div className="inline-flex">
                  <div className="pointer-events-none inline-block h-10 w-10 select-none">
                    <DiscordAvatar user={account} />
                  </div>
                </div>
                <div className="flex flex-col space-y-0.5">
                  <div className="flex items-center space-x-1.5">
                    <div className="max-w-[160px] md:max-w-[200px]">
                      <Link href={`/accounts/${account.id}`}>
                        <p className="text-sm font-medium text-primary hover:text-primary/80 truncate transition duration-300">
                          {usernameOrTag(account)}
                        </p>
                      </Link>
                    </div>
                    <BadgeList user={account} />
                  </div>
                  <span className="text-xs font-light truncate">
                    {getRelativeTime(account.createdAt)}
                  </span>
                </div>
              </div>

              <Link href={`/accounts/${account.id}`} className="flex-shrink-0">
                <FiChevronRight className="w-6 h-6 hover:text-muted-foreground transition duration-300" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </TitledCard>
  );
}
