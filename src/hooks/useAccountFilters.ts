import { useState } from "react";

export default function useAccountFilters() {
  const defaultState = {
    limit: 30,
    search: "",
    verified: false,
    nitro: false,
    phone: false,
    unflagged: false,
  };
  const [filters, setFilters] = useState<typeof defaultState>(defaultState);

  const resetFilters = () => {
    setFilters(defaultState);
  };

  const setFilter = (key: string, value: string | number | boolean) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return {
    filters,
    resetFilters,
    setFilter,
  };
}
