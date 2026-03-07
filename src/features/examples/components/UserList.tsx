"use client";

import { useState } from "react";
import { useUsers } from "@/features/examples/hooks/useUsers";
import { LoadingState } from "@/shared/components/LoadingState";
import { EmptyState } from "@/shared/components/EmptyState";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

function UserListInner() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, error } = useUsers({
    search,
    page,
    limit: 5,
  });

  if (isLoading) {
    return <LoadingState rows={5} message="Loading users..." />;
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center dark:border-red-900 dark:bg-red-950">
        <p className="text-sm text-red-600 dark:text-red-400">
          Failed to load users: {error.message}
        </p>
      </div>
    );
  }

  const users = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        placeholder="Search by name or email..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
      />

      {/* List */}
      {users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try adjusting your search query."
        />
      ) : (
        <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-800 dark:border-gray-800">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize dark:bg-gray-800">
                  {user.role}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page >= meta.totalPages}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function UserList() {
  return (
    <ErrorBoundary>
      <UserListInner />
    </ErrorBoundary>
  );
}
