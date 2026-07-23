import type { RecipeDetail } from "../types";

export const dataTables: RecipeDetail = {
  slug: "data-tables",
  title: "Data Tables with TanStack Table",
  breadcrumbCategory: "Patterns",
  description:
    "Headless, sortable, filterable, and paginated tables using TanStack Table v8. Full styling control with no component library lock-in.",
  principle: {
    text: "TanStack Table is a headless engine — it computes row models, manages sorting, filtering, and pagination state, but renders nothing. You own the markup. This separation means complete styling control without fighting a component library.",
    tip: "Wrap column definitions in useMemo with an empty dependency array. Column definitions are stable references — recreating them on every render causes unnecessary row model recalculations.",
  },
  rules: [
    { title: "Columns are stable", description: "Wrap column definitions in useMemo(() => [...], []). Redefining them each render triggers unnecessary re-sorts and re-filters." },
    { title: "Own the render loop", description: "Use flexRender() for both headers and cells. Never manually extract cell values — let the column definition handle rendering." },
    { title: "Server-side for large data", description: "Client-side filtering and sorting works up to ~1,000 rows. Beyond that, move pagination and filtering to the server." },
    { title: "Global vs column filters", description: "Use globalFilter for quick full-text search. Use column-level filters for advanced filtering UI with per-field controls." },
  ],
  pattern: {
    filename: "features/examples/components/UserTable.tsx",
    code: `import { useMemo, useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import type { User } from '@/shared/types/common';
import { useUsers } from '@/features/examples/hooks/useUsers';

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name',   header: 'Name' },
  { accessorKey: 'email',  header: 'Email' },
  { accessorKey: 'role',   header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
];

// The table owns its data: it calls the query hook internally, so pages render
// <UserTable /> with no props. Server state stays in React Query's cache.
export function UserTable() {
  const { data } = useUsers({ limit: 100 });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const cols = useMemo(() => columns, []);

  const table = useReactTable({
    data: data?.users ?? [], columns: cols,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div>
      <input
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        placeholder="Filter all columns..."
      />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {{ asc: ' ↑', desc: ' ↓' }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </button>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
        <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </button>
      </div>
    </div>
  );
}`,
  },
  implementation: {
    nextjs: {
      description:
        "In Next.js, prefetch user data in a Server Component and hydrate it via HydrationBoundary. The table renders immediately with cached data while staying reactive to updates.",
      filename: "app/users/page.tsx",
      code: `import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/get-query-client';
import { queryKeys } from '@/lib/query-keys';
import { usersService } from '@/lib/services/users';
import { UserTable } from '@/features/examples';

export default async function UsersPage() {
  const queryClient = getQueryClient();
  // Match the key UserTable's internal useUsers({ limit: 100 }) reads from,
  // so the hydrated cache resolves on first render — no loading flash.
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.list({ limit: 100 }),
    queryFn: () => usersService.getAll({ limit: 100 }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserTable />
    </HydrationBoundary>
  );
}`,
    },
    vite: {
      description:
        "In Vite, the page stays declarative — UserTable calls the useUsers hook internally, so it owns its own data. For datasets under 1,000 rows, all filtering, sorting, and pagination can stay client-side.",
      filename: "pages/UsersPage.tsx",
      code: `import { UserTable } from '@/features/examples';

export function UsersPage() {
  return <UserTable />;
}`,
    },
  },
  lastUpdated: "Jul 23, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "table",
  starterLink: {
    label: "View UserTable in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/blob/main/src/features/users/components/UserTable.tsx",
  },
};
