import usePagination from "~/hooks/usePagination";
import { api } from "~/trpc/react";

type TPaginatedCollectionsProps = Parameters<
  typeof api.collection.getWithCursor.useSuspenseInfiniteQuery
>[0];

export default function usePaginatedCollections(
  props: TPaginatedCollectionsProps,
) {
  const {
    pageIndex: page,
    nextPage,
    resetPage,
    previousPage,
  } = usePagination(1);
  const [collections, { fetchNextPage, isFetching }] =
    api.collection.getWithCursor.useSuspenseInfiniteQuery(props, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
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
