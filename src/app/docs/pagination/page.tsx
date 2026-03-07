"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Pagination } from "@/ui/Pagination";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Pagination } from "@/ui/Pagination";

<Pagination.Root
  page={page}
  totalPages={24}
  onPageChange={setPage}
  siblingCount={1}
/>`;

const COPY_PASTE_SNIPPET = `function PaginationRoot({ page, totalPages, onPageChange }: { page: number; totalPages: number; onPageChange: (page: number) => void }) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
  return (
    <nav className="inline-flex items-center gap-1">
      <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>Prev</button>
      {pages.map((token) => (
        <button key={token} type="button" onClick={() => onPageChange(token)} className={token === page ? "bg-primary text-white" : ""}>{token}</button>
      ))}
      <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>Next</button>
    </nav>
  );
}

type PaginationCompound = typeof PaginationRoot & { Root: typeof PaginationRoot };
export const Pagination = Object.assign(PaginationRoot, { Root: PaginationRoot }) as PaginationCompound;`;

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
            <Pagination.Root page={page} totalPages={24} onPageChange={setPage} />
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
