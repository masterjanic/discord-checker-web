import { useState } from "react";

export default function usePagination(increment = 21) {
  const [pageIndex, setPageIndex] = useState<number>(0);

  const previousPage = () =>
    setPageIndex(pageIndex - increment < 0 ? 0 : pageIndex - increment);

  const nextPage = () => setPageIndex(pageIndex + increment);

  const resetPage = () => setPageIndex(0);

  return {
    pageIndex,
    previousPage,
    nextPage,
    resetPage,
  };
}
