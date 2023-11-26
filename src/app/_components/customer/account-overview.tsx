"use client";

import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useMemo, useState, type ChangeEvent } from "react";
import {
  FiArrowLeft,
  FiArrowRight,
  FiCheck,
  FiChevronDown,
} from "react-icons/fi";

import Box from "~/app/_components/common/box";
import Button from "~/app/_components/common/button";
import SearchBar from "~/app/_components/common/search-bar";
import AccountCard from "~/app/_components/customer/account-card";
import SkeletonAccountCard from "~/app/_components/skeletons/skeleton-account-card";
import useAccountFilters from "~/hooks/useAccountFilters";
import usePaginatedAccounts from "~/hooks/usePaginatedAccounts";
import { toTitleCase } from "~/lib/discord-utils";

export default function AccountOverview() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

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
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
          <SearchBar
            className="col-span-full md:col-span-2 lg:col-span-1"
            placeholder="Search by username or ID..."
            onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
              resetPage();
              setFilter("search", e.target.value);
            }, 500)}
          />

          <div className="col-span-full flex items-center space-x-2 md:col-span-1">
            <div className="w-full max-w-[120px]">
              <Listbox
                multiple
                value={activeFilters}
                onChange={(value) => {
                  setActiveFilters(value);

                  for (const filter of [
                    "verified",
                    "nitro",
                    "phone",
                    "unflagged",
                  ]) {
                    setFilter(filter, value.includes(filter));
                  }

                  resetPage();
                }}
              >
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-neutral-100/10 bg-blueish-grey-800 p-2.5 text-left text-neutral-100 shadow-md focus:outline-none sm:text-sm">
                  <span className="block truncate">
                    Filters ({activeFilters.length})
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 overflow-auto rounded-md border border-neutral-100/10 bg-blueish-grey-700">
                  {["verified", "nitro", "phone", "unflagged"].map((filter) => (
                    <Listbox.Option
                      key={`filter-${filter}`}
                      value={filter}
                      className={({ active }) =>
                        clsx(
                          "relative w-full select-none py-2 pl-10 pr-4",
                          active && "bg-blurple-dark/50 text-indigo-100",
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`tesxt-sm block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {toTitleCase(filter)}
                          </span>
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FiCheck
                              className={clsx(
                                "h-5 w-5",
                                selected ? "text-blurple" : "opacity-50",
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>

            <div className="w-full max-w-[120px]">
              <Listbox
                value={filters.limit}
                onChange={(value) => {
                  setFilter("limit", value);
                  resetPage();
                }}
              >
                <Listbox.Button className="relative w-full cursor-default rounded-md border border-neutral-100/10 bg-blueish-grey-800 p-2.5 text-left text-neutral-100 shadow-md focus:outline-none sm:text-sm">
                  <span className="block truncate">
                    Limit ({filters.limit})
                  </span>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <FiChevronDown
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>
                <Listbox.Options className="absolute z-10 overflow-auto rounded-md border border-neutral-100/10 bg-blueish-grey-700">
                  {[10, 20, 30, 50, 100].map((limit) => (
                    <Listbox.Option
                      key={`limit-${limit}`}
                      value={limit}
                      className={({ active }) =>
                        clsx(
                          "relative w-full select-none py-2 pl-10 pr-4",
                          active && "bg-blurple-dark/50 text-indigo-100",
                        )
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={`tesxt-sm block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {limit}
                          </span>
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <FiCheck
                              className={clsx(
                                "h-5 w-5",
                                selected ? "text-blurple" : "opacity-50",
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Listbox>
            </div>
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
          ? Array.from({ length: filters.limit ?? 30 }).map((_, i) => (
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
