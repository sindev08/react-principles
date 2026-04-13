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
import type { User } from '@/types';

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name',   header: 'Name' },
  { accessorKey: 'email',  header: 'Email' },
  { accessorKey: 'role',   header: 'Role' },
  { accessorKey: 'status', header: 'Status' },
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
  // render table.getHeaderGroups() and table.getRowModel().rows
}`,
  },
  implementation: {
    nextjs: {
      description:
        "In Next.js, prefetch the initial page of data in a Server Component and pass it as initialData. The table renders immediately without a loading state.",
      filename: "app/users/page.tsx",
      code: `import { UserTable } from '@/components/UserTable';
import { getUsers } from '@/services/users';

export default async function UsersPage() {
  const initialData = await getUsers({ page: 1, limit: 20 });
  return <UserTable initialData={initialData} />;
}`,
    },
    vite: {
      description:
        "In Vite, fetch data via a React Query hook and pass it to the table. For datasets under 1,000 rows, all filtering and sorting can stay client-side.",
      filename: "pages/UsersPage.tsx",
      code: `import { useUsers } from '@/hooks/queries/useUsers';
import { UserTable } from '@/components/UserTable';

export function UsersPage() {
  const { data, isLoading } = useUsers({ limit: 100 });

  if (isLoading) return <TableSkeleton />;

  return <UserTable data={data?.data ?? []} />;
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  demoKey: "table",
};
