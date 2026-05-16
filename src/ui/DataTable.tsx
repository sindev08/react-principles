"use client";

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
import { cn } from "@/shared/utils/cn";
import { Table } from "./Table";
import { Button } from "./Button";
import { Skeleton } from "./Skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DataTableProps<TData> {
  /** TanStack Table column definitions. */
  columns: Array<ColumnDef<TData>>;
  /** Row data array. */
  data: TData[];
  /** Controlled sorting state. */
  sorting?: SortingState;
  /** Controlled sorting state change handler. */
  onSortingChange?: OnChangeFn<SortingState>;
  /** Controlled global filter string. */
  globalFilter?: string;
  /** Controlled global filter change handler. */
  onGlobalFilterChange?: OnChangeFn<string>;
  /** Controlled pagination state. */
  pagination?: PaginationState;
  /** Controlled pagination change handler. */
  onPaginationChange?: OnChangeFn<PaginationState>;
  /** Initial page size (uncontrolled mode). */
  pageSize?: number;
  /** Shows skeleton rows while true. */
  isLoading?: boolean;
  /** Custom content rendered when no rows match the filter. */
  emptyState?: ReactNode;
  /** Placeholder text for the filter input. */
  filterPlaceholder?: string;
  /** Extra classes on the wrapper div. */
  className?: string;
}

// ─── Sort indicator ──────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: false | "asc" | "desc" }) {
  if (!direction) return null;
  return (
    <span className="material-symbols-outlined text-[14px]">
      {direction === "asc" ? "arrow_upward" : "arrow_downward"}
    </span>
  );
}

// ─── Skeleton rows ────────────────────────────────────────────────────────────

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

// ─── Component ───────────────────────────────────────────────────────────────

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
      {/* Filter input */}
      <div className="relative" role="search">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] text-slate-400">
          search
        </span>
        <input
          type="text"
          value={globalFilter}
          onChange={(e) => handleFilterChange(e.target.value)}
          placeholder={filterPlaceholder}
          aria-label={filterPlaceholder}
          className={cn(
            "h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-900 outline-hidden transition-all",
            "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600",
          )}
        />
      </div>

      {/* Table */}
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const sortDir = header.column.getIsSorted();
                return (
                <Table.Head
                  key={header.id}
                  aria-sort={
                    sortDir === "asc" ? "ascending" :
                    sortDir === "desc" ? "descending" :
                    header.column.getCanSort() ? "none" : undefined
                  }
                  className={cn(
                    header.column.getCanSort() && "cursor-pointer select-none",
                  )}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-1">
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                    <SortIcon direction={sortDir} />
                  </div>
                </Table.Head>
                );
              })}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {isLoading ? (
            <DataTableSkeleton
              colCount={columns.length}
              rowCount={pagination.pageSize}
            />
          ) : isEmpty ? (
            <Table.Row>
              <Table.Cell
                colSpan={columns.length}
                className="h-48 text-center"
              >
                {emptyState ?? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No results found.
                  </p>
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

      {/* Pagination */}
      {!isEmpty && !isLoading && (
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
      )}
    </div>
  );
}
