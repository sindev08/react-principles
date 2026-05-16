"use client";

import { useShallow } from "zustand/shallow";
import { useFilterStore, useHasActiveFilters } from "@/shared/stores/useFilterStore";
import { Input } from "@/ui/Input";
import { NativeSelect } from "@/ui/NativeSelect";
import type { UserRole } from "@/shared/types/common";

export function UserFilters() {
  const { search, role, setSearch, setRole, reset } = useFilterStore(
    useShallow((s) => ({
      search: s.search,
      role: s.role,
      setSearch: s.setSearch,
      setRole: s.setRole,
      reset: s.reset,
    })),
  );
  const hasFilters = useHasActiveFilters();

  return (
    <div className="space-y-3">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users..."
        label="Search"
      />
      <NativeSelect
        value={role ?? ""}
        onChange={(e) =>
          setRole((e.target.value || null) as UserRole | null)
        }
        label="Role"
      >
        <option value="">All roles</option>
        <option value="admin">Admin</option>
        <option value="editor">Editor</option>
        <option value="viewer">Viewer</option>
      </NativeSelect>
      {hasFilters && (
        <button
          type="button"
          onClick={reset}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
