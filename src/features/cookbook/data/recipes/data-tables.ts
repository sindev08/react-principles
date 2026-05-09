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
    filename: "components/UserTable.tsx",
    code: `import { useMemo, useState } from 'react';
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getFilteredRowModel, getPaginationRowModel,
  flexRender, type ColumnDef, type SortingState,
} from '@tanstack/react-table';
import type { User } from '@/shared/types/user';

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    // accessorFn combines two fields into one sortable, filterable column
    accessorFn: (row) => \`\${row.firstName} \${row.lastName}\`,
  },
  { accessorKey: 'email',  header: 'Email' },
  { accessorKey: 'age',    header: 'Age' },
  { accessorKey: 'gender', header: 'Gender' },
];

export function UserTable({ data }: { data: User[] }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const cols = useMemo(() => columns, []);

  const table = useReactTable({
    data, columns: cols,
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
import { getQueryClient } from '@/lib/query-client';
import { queryKeys } from '@/lib/query-keys';
import { usersService } from '@/lib/services/users';
import { UserTable } from '@/features/users';

export default async function UsersPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: queryKeys.users.all,
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
        "In Vite, fetch data via a React Query hook and pass it to the table. DummyJSON returns users under data.users. For datasets under 1,000 rows, all filtering and sorting can stay client-side.",
      filename: "pages/UsersPage.tsx",
      code: `import { useUsers, UserTable } from '@/features/users';

export function UsersPage() {
  const { data, isLoading } = useUsers({ limit: 100 });

  if (isLoading) return <TableSkeleton />;

  return <UserTable data={data?.users ?? []} />;
}`,
    },
  },
  lastUpdated: "May 10, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "table",
  starterLink: {
    label: "View UserTable in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/blob/main/src/features/users/components/UserTable.tsx",
  },
};
