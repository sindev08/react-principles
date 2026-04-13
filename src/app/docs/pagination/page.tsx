"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Pagination } from "@/ui/Pagination";
import { Button } from "@/ui/Button";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-pagination--default";

const CODE_SNIPPET = `import { Pagination } from "@/ui/Pagination";

<Pagination
  page={page}
  totalPages={12}
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
}`;

const PROPS_ROWS = [
  { prop: "page", type: "number", default: "—", description: "Current active page number." },
  { prop: "totalPages", type: "number", default: "—", description: "Total number of pages available in the range." },
  { prop: "onPageChange", type: "(page: number) => void", default: "—", description: "Called when users move to the previous, next, or a numbered page." },
  { prop: "siblingCount", type: "number", default: "1", description: "Controls how many pages remain visible on either side of the current page." },
  { prop: "className", type: "string", default: "—", description: "Additional classes applied to the pagination nav wrapper." },
];

export default function PaginationDocPage() {
  const [page, setPage] = useState(5);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Navigation</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Pagination</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Pagination
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Compact page navigation control with clamped prev and next actions plus ellipsis-based
            range collapsing for longer result sets.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="pagination" />

        <section id="demo" className="mb-16">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <span className="text-sm font-bold">01</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0">
              <Link href={STORYBOOK_HREF} target="_blank" rel="noopener noreferrer">
                Open in Storybook
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </Button>
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Pagination page={page} totalPages={12} onPageChange={setPage} />
            <p className="text-xs text-slate-500 dark:text-slate-400">Current page: {page}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Pagination.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Pagination.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3"><code className="text-xs font-mono font-semibold text-primary">{row.prop}</code></td>
                    <td className="px-4 py-3 max-w-[240px]"><code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
                    <td className="px-4 py-3"><code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code></td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{row.description}</td>
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
