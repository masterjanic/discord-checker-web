"use client";

import Link from "next/link";
import { type ChangeEvent, useMemo } from "react";
import { FiArrowLeft, FiArrowRight, FiSearch } from "react-icons/fi";
import Box from "~/app/_components/common/box";
import Button from "~/app/_components/common/button";
import AccountCard from "~/app/_components/customer/account-card";
import SkeletonAccountCard from "~/app/_components/skeletons/skeleton-account-card";
import useAccountFilters from "~/hooks/useAccountFilters";
import usePaginatedAccounts from "~/hooks/usePaginatedAccounts";
import debounce from "lodash/debounce";

export default function AccountOverview() {
  const { filters, setFilter } = useAccountFilters();
  const {
    accounts,
    page,
    previousPage,
    nextPage,
    fetchNextPage,
    resetPage,
    isFetching,
  } = usePaginatedAccounts(filters);

  const toShow = useMemo(() => {
    return accounts?.pages[page]?.items;
  }, [accounts?.pages, page]);

  return (
    <>
      {accounts && (
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative col-span-full md:col-span-2 lg:col-span-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <FiSearch className="h-4 w-4 text-neutral-300" />
            </div>
            <input
              type="text"
              inputMode="search"
              spellCheck={false}
              onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
                resetPage();
                setFilter("search", e.target.value);
              }, 500)}
              placeholder="Search by username or ID..."
              className="w-full rounded-md border border-neutral-100/10 bg-blueish-grey-800 px-5 py-3 pl-10 text-sm text-neutral-100 caret-blurple-dark transition-colors duration-300 focus:border-blurple-dark focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {toShow && toShow.length === 0 && (
          <Box className="col-span-full grid place-items-center">
            <h3 className="text-lg font-bold">No Results :(</h3>
            <span className="text-gray-300">
              There were no accounts matching your query or there are no
              accounts stored in the database yet.
            </span>
          </Box>
        )}

        {!toShow || (isFetching && filters.search)
          ? Array.from({ length: filters.limit }).map((_, i) => (
              <SkeletonAccountCard key={`skel-loading-account-card-${i}`} />
            ))
          : toShow?.map((account) => (
              <Link
                href={`/accounts/${account.id}`}
                key={`account-card-${account.id}`}
              >
                <AccountCard account={account} />
              </Link>
            ))}
      </div>

      {toShow && toShow.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-1">
            <Button
              className="!p-2"
              onClick={previousPage}
              disabled={page === 0}
            >
              <FiArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              className="!p-2"
              onClick={() => {
                void fetchNextPage();
                nextPage();
              }}
              disabled={!accounts?.pages[page]?.nextCursor}
            >
              <FiArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
