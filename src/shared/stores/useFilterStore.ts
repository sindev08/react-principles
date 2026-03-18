import { create } from "zustand";
import type { UserRole, UserStatus } from "../types/common";

interface FilterState {
  search: string;
  role: UserRole | null;
  status: UserStatus | null;
  setSearch: (search: string) => void;
  setRole: (role: UserRole | null) => void;
  setStatus: (status: UserStatus | null) => void;
  reset: () => void;
}

const initialState = {
  search: "",
  role: null as UserRole | null,
  status: null as UserStatus | null,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,
  setSearch: (search) => set({ search }),
  setRole: (role) => set({ role }),
  setStatus: (status) => set({ status }),
  reset: () => set(initialState),
}));

/** Selector: returns true when any filter is active. */
export const useHasActiveFilters = () =>
  useFilterStore(
    (state) => state.search !== "" || state.role !== null || state.status !== null,
  );
