# TanStack Table

## Principle

Why TanStack Table and not another "batteries included" table library? Because TanStack Table is **headless** — it's only logic (sorting, filtering, pagination, selection), without UI. This means we have 100% control over rendering, we style with our own Tailwind, and we don't have to fight the library's CSS. The trade-off: initial setup is more verbose. But long-term, the flexibility is worth it — we'll never be stuck because a library doesn't support a specific use case.

Column definitions as data (not JSX) is powerful because: they can be composed, generated, filtered, and typed. A single `ColumnDef<User>[]` can serve sorting, filtering, and rendering all at once — a single source of truth for table structure.

## Rules

- Column definitions must be typed: `ColumnDef<EntityType>[]`
- Column defs are wrapped in `useMemo` — don't create a new array on every render
- Use `accessorKey` (string) for simple access, `accessorFn` for computed columns
- Cell renderers must be lightweight — no heavy computation in render
- Sorting, filtering, pagination state managed via React state + TanStack callbacks
- Table component must be reusable — logic in hook/parent, rendering in component
- Pagination controls outside the `<table>` element

## Pattern

```
// Column definition — typed array
const columns: ColumnDef<Entity>[] = [
  { accessorKey: "field", header: "Label" },
  { accessorKey: "field", header: "Label", cell: customRenderer },
  { accessorFn: (row) => computed(row), header: "Computed" },
];

// Table instance — single source of truth
const table = useReactTable({
  data,
  columns,
  state: { sorting, globalFilter },
  onSortingChange: setSorting,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

// Render — iterate header groups, rows, cells
table.getHeaderGroups() → headers
table.getRowModel().rows → rows
row.getVisibleCells() → cells
flexRender(cell.column.columnDef.cell, cell.getContext())
```

## Implementation

> **Version:** TanStack Table v8 | Tested on: 2026-02

### Complete Table Component

From `src/features/examples/components/UserTable.tsx`:

```tsx
"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { User } from "@/shared/types/common";

export function UserTable() {
  // State for table features
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // Column definitions — memoized to prevent re-creation
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium">{info.getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium capitalize dark:bg-gray-800">
            {info.getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = info.getValue<string>();
          return (
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status === "active"
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
              }`}
            >
              {status}
            </span>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) =>
          new Date(info.getValue<string>()).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
    ],
    [],
  );

  // Table instance
  const table = useReactTable({
    data: mockUsers,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 8 },
    },
  });

  return (
    <div className="space-y-4">
      {/* Global filter */}
      <input
        type="text"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Filter all columns..."
        className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm"
      />

      {/* Table rendering */}
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className="cursor-pointer select-none px-4 py-3 font-medium"
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{ asc: " ↑", desc: " ↓" }[
                        header.column.getIsSorted() as string
                      ] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </p>
        <div className="flex gap-2">
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </button>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
```

### Column Definition Patterns

```tsx
// Simple — just accessor, auto-renders value as string
{ accessorKey: "email", header: "Email" }

// Custom cell renderer — for badges, formatting, etc.
{
  accessorKey: "status",
  header: "Status",
  cell: (info) => <Badge variant={info.getValue<string>()}>{info.getValue()}</Badge>,
}

// Computed column — accessor function instead of key
{
  accessorFn: (row) => `${row.firstName} ${row.lastName}`,
  id: "fullName",  // id required when using accessorFn
  header: "Full Name",
}

// Date formatting
{
  accessorKey: "createdAt",
  header: "Created",
  cell: (info) => new Date(info.getValue<string>()).toLocaleDateString(),
}

// Action column — no accessor, custom cell
{
  id: "actions",
  header: "",
  cell: ({ row }) => <ActionMenu user={row.original} />,
}
```

### Sorting State

```tsx
const [sorting, setSorting] = useState<SortingState>([]);
// SortingState = Array<{ id: string; desc: boolean }>

// Multi-sort: user holds Shift + click
// Single sort: just click header

// In table config:
onSortingChange: setSorting,
getSortedRowModel: getSortedRowModel(),
```

### Selection Pattern

```tsx
const [rowSelection, setRowSelection] = useState({});

const columns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        checked={row.getIsSelected()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  },
  // ...other columns
];

const table = useReactTable({
  // ...
  state: { rowSelection },
  onRowSelectionChange: setRowSelection,
  enableRowSelection: true,
});

// Get selected rows:
const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
```

### Next.js

- Table component must be `"use client"` because it uses useState and event handlers
- Data can be passed from a Server Component parent to a Client Component table

### Runtime Note

This repository currently demonstrates TanStack Table usage in Next.js client components.

## Common Mistakes

- **Column defs without useMemo** — `const columns = [...]` in a component body creates a new array on every render, triggering table re-initialization. Always wrap in `useMemo`.
- **Heavy computation in cell renderers** — Cell renderers are called for every visible cell on every render. Keep them lightweight.
- **Forgetting `id` on computed columns** — When using `accessorFn` without `id`, TanStack Table can't identify the column. Always provide an `id`.
- **Mixing server-side and client-side pagination** — If data from the API is already paginated, don't use `getPaginationRowModel()`. Handle pagination via query params.
- **Global filter on all columns** — The default global filter checks all columns. For performance, specify `filterFn` or `enableGlobalFilter: false` on columns that don't need it.
- **Not handling empty state** — `table.getRowModel().rows.length === 0` must be handled with an empty state UI, not a blank table.

## Related

- [Component Patterns](./component-patterns.md) — Table as a composed component
- [React Query](./react-query.md) — Data fetching for table data
- [Styling](./styling.md) — Tailwind patterns for table styling
- [TypeScript](./typescript.md) — Generic ColumnDef typing
