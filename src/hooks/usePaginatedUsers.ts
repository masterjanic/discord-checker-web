import usePagination from "~/hooks/usePagination";
import { api } from "~/trpc/react";

type TPaginatedUsersProps = Parameters<
  typeof api.user.getWithCursor.useSuspenseInfiniteQuery
>[0];

export default function usePaginatedUsers(props: TPaginatedUsersProps) {
  const {
    pageIndex: page,
    nextPage,
    resetPage,
    previousPage,
  } = usePagination(1);
  const [users, { fetchNextPage, isFetching }] =
    api.user.getWithCursor.useSuspenseInfiniteQuery(props, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  return {
    users,
    page,
    fetchNextPage,
    nextPage,
    previousPage,
    resetPage,
    isFetching,
  };
}
