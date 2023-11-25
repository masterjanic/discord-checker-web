import usePagination from "~/hooks/usePagination";
import { api } from "~/trpc/react";

type TPaginatedAccountProps = Parameters<
  typeof api.account.getWithCursor.useSuspenseInfiniteQuery
>[0];

export default function usePaginatedCollections(props: TPaginatedAccountProps) {
  const {
    pageIndex: page,
    nextPage,
    resetPage,
    previousPage,
  } = usePagination(1);
  const [collections, { fetchNextPage, isFetching }] =
    api.collection.getWithCursor.useSuspenseInfiniteQuery(props, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
    });

  return {
    collections,
    page,
    fetchNextPage,
    nextPage,
    previousPage,
    resetPage,
    isFetching,
  };
}
