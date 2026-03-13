import { cn } from "@/shared/utils/cn";

type PaginationToken = number | "ellipsis";

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

function buildRange(page: number, totalPages: number, siblingCount: number): PaginationToken[] {
  const pages: PaginationToken[] = [];
  const totalButtons = siblingCount * 2 + 5;

  if (totalPages <= totalButtons) {
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }

  const leftSibling = Math.max(page - siblingCount, 1);
  const rightSibling = Math.min(page + siblingCount, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  pages.push(1);

  if (showLeftEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let i = 2; i < leftSibling; i += 1) pages.push(i);
  }

  for (let i = leftSibling; i <= rightSibling; i += 1) {
    if (i !== 1 && i !== totalPages) pages.push(i);
  }

  if (showRightEllipsis) {
    pages.push("ellipsis");
  } else {
    for (let i = rightSibling + 1; i < totalPages; i += 1) pages.push(i);
  }

  if (totalPages > 1) pages.push(totalPages);

  return pages;
}

export function Pagination({ page, totalPages, onPageChange, siblingCount = 1, className }: PaginationProps) {
  const clampedPage = Math.min(Math.max(page, 1), Math.max(totalPages, 1));
  const range = buildRange(clampedPage, totalPages, siblingCount);

  return (
    <nav aria-label="Pagination" className={cn("inline-flex items-center gap-1", className)}>
      <button
        type="button"
        onClick={() => onPageChange(clampedPage - 1)}
        disabled={clampedPage <= 1}
        className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1f2937] dark:text-slate-200 dark:hover:bg-[#161b22]"
      >
        Prev
      </button>

      {range.map((token, index) =>
        token === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-1 text-xs text-slate-400">
            ...
          </span>
        ) : (
          <button
            key={token}
            type="button"
            onClick={() => onPageChange(token)}
            aria-current={token === clampedPage ? "page" : undefined}
            className={cn(
              "min-w-8 rounded-md px-2.5 py-1.5 text-xs font-medium transition-all",
              token === clampedPage
                ? "bg-primary text-white"
                : "border border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-200 dark:hover:bg-[#161b22]"
            )}
          >
            {token}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(clampedPage + 1)}
        disabled={clampedPage >= totalPages}
        className="rounded-md border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700 transition-all hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-[#1f2937] dark:text-slate-200 dark:hover:bg-[#161b22]"
      >
        Next
      </button>
    </nav>
  );
}
