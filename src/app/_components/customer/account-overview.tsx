"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Box from "~/app/_components/common/box";
import Button from "~/app/_components/common/button";
import AccountCard from "~/app/_components/customer/account-card";
import SkeletonAccountCard from "~/app/_components/skeletons/skeleton-account-card";
import usePaginatedAccounts from "~/hooks/usePaginatedAccounts";

export default function AccountOverview() {
  const { accounts, page, previousPage, nextPage, fetchNextPage } =
    usePaginatedAccounts({
      limit: 27,
    });

  const toShow = useMemo(() => {
    return accounts?.pages[page]?.items;
  }, [accounts?.pages, page]);

  return (
    <>
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

        {toShow
          ? toShow.map((account) => (
              <Link
                href={`/accounts/${account.id}`}
                key={`account-card-${account.id}`}
              >
                <AccountCard account={account} />
              </Link>
            ))
          : Array.from({ length: 27 }).map((_, i) => (
              <SkeletonAccountCard key={`skel-loading-account-card-${i}`} />
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
