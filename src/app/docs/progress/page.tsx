"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import { Progress } from "@/ui/Progress";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Progress } from "@/ui/Progress";

<Progress value={72} max={100} />`;

const COPY_PASTE_SNIPPET = `import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
}

export function Progress({ value, max = 100, className, ...props }: ProgressProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percentage = (clamped / safeMax) * 100;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.round(clamped)}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-[#1f2937]", className)}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-all duration-300"
        style={{ width: \`\${percentage}%\` }}
      />
    </div>
  );
}`;

export default function ProgressDocPage() {
  const [value, setValue] = useState(35);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Progress</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Linear progress indicator for loading and completion states.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Progress value={value} />
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setValue((v) => Math.max(v - 10, 0))}>-10</Button>
              <Button size="sm" onClick={() => setValue((v) => Math.min(v + 10, 100))}>+10</Button>
              <span className="text-xs text-slate-500 dark:text-slate-400">{value}%</span>
            </div>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Progress.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Progress.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
