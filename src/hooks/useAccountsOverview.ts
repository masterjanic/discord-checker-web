import { create } from "zustand";

interface AccountFiltersState {
  page: number;
  filters: {
    limit: number;
    search: string;
    verified: boolean;
    nitro: boolean;
    phone: boolean;
    unflagged: boolean;
  };
  nextPage: () => void;
  prevPage: () => void;
  setFilter: (key: string, value: string | number | boolean) => void;
  resetFilters: () => void;
}

const defaultState = {
  limit: 30,
  search: "",
  verified: false,
  nitro: false,
  phone: false,
  unflagged: false,
};

const useAccountsOverview = create<AccountFiltersState>()((set) => ({
  page: 0,
  filters: defaultState,
  nextPage: () => set((state) => ({ page: state.page + 1 })),
  prevPage: () => set((state) => ({ page: state.page - 1 })),
  setFilter: (key, value) =>
    set((state) => ({
      page: 0,
      filters: { ...state.filters, [key]: value },
    })),
  resetFilters: () => set({ filters: defaultState, page: 0 }),
}));

export default useAccountsOverview;
