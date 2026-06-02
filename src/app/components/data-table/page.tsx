"use client";

import { useMemo } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { DataTable } from "@/ui/DataTable";
import { mockUsers } from "@/lib/mock-data";
import type { ColumnDef } from "@tanstack/react-table";
import type { User } from "@/shared/types/common";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { DataTable } from "@/ui/DataTable";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnDef<User>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "status", header: "Status" },
];

export function UserList() {
  const data = useMemo(() => fetchUsers(), []);

  return (
    <DataTable
      columns={columns}
      data={data}
      pageSize={8}
      filterPlaceholder="Search users..."
    />
  );
}`;

const COPY_PASTE_SNIPPET = `"use client";

import { useState, type ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type PaginationState,
  type OnChangeFn,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Table } from "./Table";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

export interface DataTableProps<TData> {
  columns: Array<ColumnDef<TData>>;
  data: TData[];
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  globalFilter?: string;
  onGlobalFilterChange?: OnChangeFn<string>;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
  pageSize?: number;
  isLoading?: boolean;
  emptyState?: ReactNode;
  filterPlaceholder?: string;
  className?: string;
}

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (!direction) return null;
  return (
    <span className="material-symbols-outlined text-[14px]">
      {direction === "asc" ? "arrow_upward" : "arrow_downward"}
    </span>
  );
}

function DataTableSkeleton({ colCount, rowCount }: { colCount: number; rowCount: number }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, i) => (
        <Table.Row key={i}>
          {Array.from({ length: colCount }).map((__, j) => (
            <Table.Cell key={j}>
              <Skeleton variant="line" className="h-4 w-full" />
            </Table.Cell>
          ))}
        </Table.Row>
      ))}
    </>
  );
}

export function DataTable<TData>({
  columns,
  data,
  sorting: controlledSorting,
  onSortingChange,
  globalFilter: controlledFilter,
  onGlobalFilterChange,
  pagination: controlledPagination,
  onPaginationChange,
  pageSize = 10,
  isLoading = false,
  emptyState,
  filterPlaceholder = "Filter all columns...",
  className,
}: DataTableProps<TData>) {
  const [internalSorting, setInternalSorting] = useState<SortingState>([]);
  const [internalFilter, setInternalFilter] = useState("");
  const [internalPagination, setInternalPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const sorting = controlledSorting ?? internalSorting;
  const globalFilter = controlledFilter ?? internalFilter;
  const pagination = controlledPagination ?? internalPagination;

  const isSortingControlled = controlledSorting !== undefined;
  const isFilterControlled = controlledFilter !== undefined;
  const isPaginationControlled = controlledPagination !== undefined;

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    const next = typeof updater === "function" ? updater(sorting) : updater;
    if (!isSortingControlled) setInternalSorting(next);
    onSortingChange?.(updater);
  };

  const handleFilterChange: OnChangeFn<string> = (updater) => {
    const next = typeof updater === "function" ? updater(globalFilter) : updater;
    if (!isFilterControlled) setInternalFilter(next);
    onGlobalFilterChange?.(updater);
  };

  const handlePaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;
    if (!isPaginationControlled) setInternalPagination(next);
    onPaginationChange?.(updater);
  };

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: handleSortingChange,
    onGlobalFilterChange: handleFilterChange,
    onPaginationChange: handlePaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const isEmpty = !isLoading && table.getRowModel().rows.length === 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-400">
          search
        </span>
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          placeholder={filterPlaceholder}
          className={cn(
            "h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-hidden transition-all",
            "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600",
          )}
        />
      </div>

      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.Head
                  key={header.id}
                  className={cn(header.column.getCanSort() && "cursor-pointer select-none")}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    <SortIcon direction={header.column.getIsSorted()} />
                  </div>
                </Table.Head>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <DataTableSkeleton colCount={columns.length} rowCount={pagination.pageSize} />
          ) : isEmpty ? (
            <Table.Row>
              <Table.Cell colSpan={columns.length} className="h-48 text-center">
                {emptyState ?? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No results found.</p>
                )}
              </Table.Cell>
            </Table.Row>
          ) : (
            table.getRowModel().rows.map((row) => (
              <Table.Row key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Table.Cell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Page {pagination.pageIndex + 1} of {table.getPageCount()}{" "}
          ({table.getFilteredRowModel().rows.length} rows)
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}`;

const PROPS_ROWS = [
  {
    prop: "columns",
    type: "ColumnDef<TData>[]",
    default: "—",
    description: "TanStack Table column definitions.",
  },
  {
    prop: "data",
    type: "TData[]",
    default: "—",
    description: "Array of row data to display.",
  },
  {
    prop: "sorting",
    type: "SortingState",
    default: "—",
    description: "Controlled sorting state.",
  },
  {
    prop: "onSortingChange",
    type: "OnChangeFn<SortingState>",
    default: "—",
    description: "Called when sorting changes.",
  },
  {
    prop: "globalFilter",
    type: "string",
    default: "—",
    description: "Controlled global filter string.",
  },
  {
    prop: "onGlobalFilterChange",
    type: "OnChangeFn<string>",
    default: "—",
    description: "Called when the filter changes.",
  },
  {
    prop: "pagination",
    type: "PaginationState",
    default: "—",
    description: "Controlled pagination state.",
  },
  {
    prop: "onPaginationChange",
    type: "OnChangeFn<PaginationState>",
    default: "—",
    description: "Called when pagination changes.",
  },
  {
    prop: "pageSize",
    type: "number",
    default: "10",
    description: "Initial page size in uncontrolled mode.",
  },
  {
    prop: "isLoading",
    type: "boolean",
    default: "false",
    description: "Shows skeleton rows while loading.",
  },
  {
    prop: "emptyState",
    type: "ReactNode",
    default: "—",
    description: "Custom content rendered when no rows match.",
  },
  {
    prop: "filterPlaceholder",
    type: "string",
    default: '"Filter all columns..."',
    description: "Placeholder text for the filter input.",
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function DataTableDocsPage() {
  const columns = useMemo<Array<ColumnDef<User>>>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: (info) => (
          <span className="font-medium">{info.getValue<string>()}</span>
        ),
      },
      { accessorKey: "email", header: "Email" },
      {
        accessorKey: "role",
        header: "Role",
        cell: (info) => (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium capitalize dark:bg-slate-800">
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
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
              status === "active"
                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
            }`}>
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

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Data Display</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Data Table</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            DataTable
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A fully-featured table built on TanStack Table v8 with sorting,
            filtering, and pagination out of the box. Renders using the Table
            primitive components from Issue #125.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              "TanStack Table v8",
              "Sortable",
              "Filterable",
              "Paginated",
              "Loading State",
              "Empty State",
            ].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="data-table" />

        {/* 01 Features */}
        <section id="features" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Sorting:</strong> click column headers to sort asc/desc/none
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Global filter:</strong> search input filters across all columns
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Pagination:</strong> Previous/Next controls with page info
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Loading state:</strong> skeleton rows while data loads
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Empty state:</strong> custom content when no rows match
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Controlled &amp; uncontrolled:</strong> all state (sorting, filter, pagination) supports both modes
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>TypeScript generic:</strong> <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">DataTable&lt;TData&gt;</code> for type-safe columns
              </span>
            </li>
          </ul>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
            Fully interactive — try sorting columns, filtering rows, and navigating pages.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
            <DataTable
              columns={columns}
              data={mockUsers}
              pageSize={8}
              filterPlaceholder="Search users..."
            />
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/DataTable.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="DataTable.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
