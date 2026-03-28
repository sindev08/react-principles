"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Skeleton } from "@/ui/Skeleton";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Skeleton } from "@/components/ui/Skeleton";

<div className="space-y-3">
  <Skeleton variant="line" width="70%" />
  <Skeleton variant="line" width="45%" />
  <Skeleton variant="rect" className="h-24" />
</div>`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

export type SkeletonVariant = "line" | "rect" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ variant = "line", width, height, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-pulse bg-slate-200 dark:bg-[#1f2937]",
        variant === "line" && "h-4 w-40 rounded-md",
        variant === "rect" && "h-24 w-full rounded-xl",
        variant === "circle" && "h-10 w-10 rounded-full",
        className
      )}
      style={{ width, height }}
    />
  );
}`;

export default function SkeletonDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Skeleton</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Loading placeholder to maintain layout stability while data is being fetched.
        </p>

        <CliInstallBlock name="skeleton" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" />
              <div className="flex-1 space-y-2">
                <Skeleton variant="line" width="50%" />
                <Skeleton variant="line" width="35%" />
              </div>
            </div>
            <Skeleton variant="rect" className="h-24" />
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Skeleton.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Skeleton.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
