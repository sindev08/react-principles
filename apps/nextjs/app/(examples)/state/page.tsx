"use client";

import { useAppStore, useFilterStore } from "@react-principles/shared/stores";

export default function StatePage() {
  const { theme, sidebarOpen, toggleTheme, toggleSidebar } = useAppStore();
  const { search, role, status, setSearch, setRole, setStatus, reset } =
    useFilterStore();

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold tracking-tight">
        Zustand State Management
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        Global state with Zustand stores, actions, and computed selectors.
      </p>

      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {/* App Store */}
        <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold">App Store</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Theme
              </span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-mono dark:bg-gray-800">
                {theme}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Sidebar
              </span>
              <span className="rounded bg-gray-100 px-2 py-0.5 text-sm font-mono dark:bg-gray-800">
                {sidebarOpen ? "open" : "closed"}
              </span>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={toggleTheme}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                Toggle Theme
              </button>
              <button
                onClick={toggleSidebar}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Toggle Sidebar
              </button>
            </div>
          </div>
        </section>

        {/* Filter Store */}
        <section className="rounded-xl border border-gray-200 p-6 dark:border-gray-800">
          <h2 className="text-xl font-semibold">Filter Store</h2>
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Search
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search users..."
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Role
              </label>
              <select
                value={role ?? ""}
                onChange={(e) =>
                  setRole(
                    (e.target.value || null) as "admin" | "editor" | "viewer" | null,
                  )
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">All roles</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400">
                Status
              </label>
              <select
                value={status ?? ""}
                onChange={(e) =>
                  setStatus(
                    (e.target.value || null) as "active" | "inactive" | null,
                  )
                }
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900"
              >
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <button
              onClick={reset}
              className="mt-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Reset Filters
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
