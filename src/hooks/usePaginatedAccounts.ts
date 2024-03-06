import { api } from "~/trpc/react";

type TPaginatedAccountProps = Parameters<
  typeof api.account.getWithCursor.useSuspenseInfiniteQuery
>[0];

export default function usePaginatedAccounts(props: TPaginatedAccountProps) {
  const [accounts, { fetchNextPage, isFetching, hasNextPage }] =
    api.account.getWithCursor.useSuspenseInfiniteQuery(props, {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    });

  return {
    accounts,
    fetchNextPage,
    isFetching,
    hasNextPage,
  };
}
