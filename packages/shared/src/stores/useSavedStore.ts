import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedState {
  savedSlugs: string[];
  toggleSaved: (slug: string) => void;
  isSaved: (slug: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  persist(
    (set, get) => ({
      savedSlugs: [],
      toggleSaved: (slug) =>
        set((s) => ({
          savedSlugs: s.savedSlugs.includes(slug)
            ? s.savedSlugs.filter((id) => id !== slug)
            : [...s.savedSlugs, slug],
        })),
      isSaved: (slug) => get().savedSlugs.includes(slug),
    }),
    { name: "saved-patterns" },
  ),
);
