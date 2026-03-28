"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Separator } from "@/ui/Separator";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Separator } from "@/components/ui/Separator";

<div className="space-y-4">
  <p>Account</p>
  <Separator />
  <p>Billing</p>
</div>`;

const COPY_PASTE_SNIPPET = `import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
}

export function Separator({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-slate-200 dark:bg-[#1f2937]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}`;

export default function SeparatorDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Separator</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Visual divider for grouping related content.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <p className="text-sm font-medium text-slate-900 dark:text-white">Profile Settings</p>
            <Separator />
            <p className="text-sm font-medium text-slate-900 dark:text-white">Billing Settings</p>
            <div className="flex h-8 items-center gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">Daily</span>
              <Separator orientation="vertical" className="h-full" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Weekly</span>
            </div>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Separator.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Separator.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
