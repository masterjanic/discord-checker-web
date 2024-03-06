"use client";

import debounce from "lodash/debounce";
import Link from "next/link";
import { useMemo, useState, type ChangeEvent } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

import UserCard from "~/app/_components/admin/user-card";
import Box from "~/app/_components/common/box";
import Button from "~/app/_components/common/button";
import SearchBar from "~/app/_components/common/search-bar";
import { Skeleton } from "~/components/ui/skeleton";
import usePaginatedUsers from "~/hooks/usePaginatedUsers";

export default function UserOverview() {
  const [search, setSearch] = useState("");
  const {
    users,
    page,
    previousPage,
    nextPage,
    fetchNextPage,
    resetPage,
    isFetching,
  } = usePaginatedUsers({
    search,
  });

  const toShow = useMemo(() => {
    return users?.pages[page]?.items;
  }, [users?.pages, page]);

  return (
    <>
      {users && (
        <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
          <SearchBar
            className="col-span-full md:col-span-2 lg:col-span-1"
            placeholder="Search by name or Discord ID..."
            onChange={debounce((e: ChangeEvent<HTMLInputElement>) => {
              resetPage();
              setSearch(e.target.value);
            }, 500)}
          />
        </div>
      )}

      <div className="mt-5 grid grid-cols-1 grid-rows-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
        {toShow && toShow.length === 0 && (
          <Box className="col-span-full grid place-items-center">
            <h3 className="text-lg font-bold">No Results :(</h3>
            <span className="text-gray-300">
              There were no users matching your query or there are no users
              signed up yet.
            </span>
          </Box>
        )}

        {!toShow || (isFetching && search)
          ? Array.from({ length: 30 }).map((_, i) => (
              <Skeleton
                className="w-full h-[98px]"
                key={`skel-loading-user-card-${i}`}
              />
            ))
          : toShow?.map((user) => (
              <Link
                href={`/admin/users/${user.id}`}
                key={`user-card-${user.id}`}
              >
                <UserCard user={user} />
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
              disabled={!users?.pages[page]?.nextCursor}
            >
              <FiArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
