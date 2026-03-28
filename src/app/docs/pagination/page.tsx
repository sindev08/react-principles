"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Pagination } from "@/ui/Pagination";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Pagination } from "@/components/ui/Pagination";

<Pagination
  page={page}
  totalPages={24}
  onPageChange={setPage}
  siblingCount={1}
/>`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

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
          <span key={\`ellipsis-\${index}\`} className="px-1 text-xs text-slate-400">
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
}`;

export default function PaginationDocPage() {
  const [page, setPage] = useState(5);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Pagination</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Page navigation control with previous/next and adaptive page range.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Pagination page={page} totalPages={24} onPageChange={setPage} />
            <p className="text-xs text-slate-500 dark:text-slate-400">Current page: {page}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Pagination.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Pagination.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
