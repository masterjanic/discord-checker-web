import usePagination from "~/hooks/usePagination";
import { api } from "~/trpc/react";

type TPaginatedAccountProps = Parameters<
  typeof api.account.getWithCursor.useSuspenseInfiniteQuery
>[0];

export default function usePaginatedAccounts(props: TPaginatedAccountProps) {
  const {
    pageIndex: page,
    nextPage,
    resetPage,
    previousPage,
  } = usePagination(1);
  const [accounts, { fetchNextPage }] =
    api.account.getWithCursor.useSuspenseInfiniteQuery(props, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      keepPreviousData: true,
    });

  return {
    accounts,
    page,
    fetchNextPage,
    nextPage,
    previousPage,
    resetPage,
  };
}
