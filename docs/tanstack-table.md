# TanStack Table

## Principle

Kenapa TanStack Table dan bukan table library lain yang "batteries included"? Karena TanStack Table itu **headless** — dia cuma logic (sorting, filtering, pagination, selection), tanpa UI. Ini berarti kita 100% control rendering, styling pakai Tailwind kita sendiri, dan ga perlu fight library's CSS. Trade-off-nya: setup awal lebih verbose. Tapi long-term, flexibility-nya worth it — kita ga akan pernah stuck karena library ga support use case tertentu.

Column definitions sebagai data (bukan JSX) itu powerful karena: bisa di-compose, di-generate, di-filter, dan di-type. Satu `ColumnDef<User>[]` bisa serve sorting, filtering, rendering sekaligus — single source of truth untuk table structure.

## Rules

- Column definitions harus typed: `ColumnDef<EntityType>[]`
- Column defs di-wrap `useMemo` — jangan buat array baru setiap render
- Gunakan `accessorKey` (string) untuk simple access, `accessorFn` untuk computed columns
- Cell renderers harus lightweight — no heavy computation in render
- Sorting, filtering, pagination state di-manage via React state + TanStack callbacks
- Table component harus reusable — logic di hook/parent, rendering di component
- Pagination controls di luar `<table>` element

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

> **Version:** TanStack Table v8 | Tested on: 2025-05

### Complete Table Component

Dari `apps/nextjs/components/examples/UserTable.tsx`:

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
import type { User } from "@react-principles/shared/types";

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

- Table component harus `"use client"` karena pakai useState dan event handlers
- Data bisa di-pass dari Server Component parent ke Client Component table

### Vite

- Tidak ada perbedaan — table works out of the box

## Common Mistakes

- **Column defs tanpa useMemo** — `const columns = [...]` di component body creates new array setiap render, triggering table re-initialization. Selalu wrap di `useMemo`.
- **Heavy computation di cell renderer** — Cell renderers dipanggil untuk setiap visible cell setiap render. Keep them lightweight.
- **Lupa `id` di computed columns** — Kalau pakai `accessorFn` tanpa `id`, TanStack Table ga bisa identify column. Selalu kasih `id`.
- **Mixing server-side dan client-side pagination** — Kalau data dari API sudah paginated, jangan pakai `getPaginationRowModel()`. Handle pagination via query params.
- **Global filter di semua columns** — Default global filter checks semua columns. Untuk performance, specify `filterFn` atau `enableGlobalFilter: false` di columns yang ga perlu.
- **Tidak handle empty state** — `table.getRowModel().rows.length === 0` harus di-handle dengan empty state UI, bukan blank table.

## Related

- [Component Patterns](./component-patterns.md) — Table sebagai composed component
- [React Query](./react-query.md) — Data fetching untuk table data
- [Styling](./styling.md) — Tailwind patterns untuk table styling
- [TypeScript](./typescript.md) — Generic ColumnDef typing
