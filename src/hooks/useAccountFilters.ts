import { useState } from "react";

export default function useAccountFilters() {
  const defaultState = {
    limit: 30,
    search: "",
    nitroOnly: false,
    verifiedOnly: false,
  };
  const [filters, setFilters] = useState<typeof defaultState>(defaultState);

  const resetFilters = () => {
    setFilters(defaultState);
  };

  const setFilter = (
    key: keyof typeof defaultState,
    value: string | number | boolean,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    resetFilters,
    setFilter,
  };
}
