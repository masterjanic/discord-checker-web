"use client";

import debounce from "lodash/debounce";
import Link from "next/link";
import { type ChangeEvent } from "react";
import { PiArrowLeftDuotone, PiArrowRightDuotone } from "react-icons/pi";

import SearchBar from "~/app/_components/common/search-bar";
import AccountCard from "~/app/_components/customer/account-card";
import HelpTooltip from "~/components/common/help-tooltip";
import AccountContextMenu from "~/components/customer/accounts/account-context-menu";
import { Button, buttonVariants } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Skeleton } from "~/components/ui/skeleton";
import useAccountsOverview from "~/hooks/useAccountsOverview";
import usePaginatedAccounts from "~/hooks/usePaginatedAccounts";
import { toTitleCase } from "~/lib/discord-utils";

export default function AccountOverview() {
  const { filters, setFilter, page, nextPage, prevPage } =
    useAccountsOverview();
  const { accounts, fetchNextPage, isFetching, hasNextPage } =
    usePaginatedAccounts(filters);

  const toShow = accounts?.pages[page]?.items;

  return (
    <>
      {accounts && (
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
          <SearchBar
            className="col-span-full md:col-span-2 lg:col-span-1"
            placeholder="Search by username or ID..."
            onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
              setFilter("search", e.target.value);
            }, 500)}
            defaultValue={filters.search}
          />

          <div className="col-span-full flex items-center space-x-2 md:col-span-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Filters</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["verified", "nitro", "phone", "unflagged"].map((filter) => (
                  <DropdownMenuCheckboxItem
                    key={`filter-${filter}`}
                    checked={!!filters[filter as keyof typeof filters]}
                    onCheckedChange={(checked) => setFilter(filter, checked)}
                  >
                    {toTitleCase(filter)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Limit ({filters.limit})</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Limit</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[10, 20, 30, 50, 100].map((limit) => (
                  <DropdownMenuCheckboxItem
                    key={`account-limit-${limit}`}
                    checked={filters.limit === limit}
                    onCheckedChange={() => setFilter("limit", limit)}
                  >
                    {limit}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <HelpTooltip align="center" side="bottom" sideOffset={15}>
              You can right-click on the account card for more options.
            </HelpTooltip>
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {toShow && toShow.length === 0 && (
          <Card className="col-span-full grid place-items-center py-12">
            <h3 className="text-lg font-bold mb-2">No Results :(</h3>
            <p className="text-muted-foreground text-sm">
              There were no accounts matching your query or there are no
              accounts stored in the database yet.
            </p>

            <div className="mt-6 flex items-center space-x-1.5">
              <Link
                href="/dashboard"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                Back to Dashboard
              </Link>
              <Link
                href="/import"
                className={buttonVariants({ variant: "default", size: "sm" })}
              >
                Import Accounts
              </Link>
            </div>
          </Card>
        )}

        {!toShow || (isFetching && filters.search)
          ? Array.from({ length: filters.limit ?? 30 }).map((_, i) => (
              <Skeleton
                className="h-[98px] w-full"
                key={`skel-loading-account-card-${i}`}
              />
            ))
          : toShow?.map((account) => (
              <AccountContextMenu
                account={account}
                key={`account-card-${account.id}`}
              >
                <AccountCard account={account} />
              </AccountContextMenu>
            ))}
      </div>

      {toShow && toShow.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-1">
            <Button
              size="icon"
              onClick={() => prevPage()}
              disabled={page === 0}
            >
              <PiArrowLeftDuotone className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              onClick={async () => {
                await fetchNextPage();
                nextPage();
              }}
              disabled={!hasNextPage}
            >
              <PiArrowRightDuotone className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
