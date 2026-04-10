"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Tooltip } from "@/ui/Tooltip";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const TOOLTIP_SIDES = [
  { side: "top" as const, label: "Top" },
  { side: "bottom" as const, label: "Bottom" },
  { side: "left" as const, label: "Left" },
  { side: "right" as const, label: "Right" },
];

const CODE_SNIPPET = `import { Tooltip } from "@/ui/Tooltip";

<Tooltip side="top">
  <Tooltip.Trigger>
    <button type="button">Hover me</button>
  </Tooltip.Trigger>
  <Tooltip.Content>Helpful context for this action</Tooltip.Content>
</Tooltip>`;

const COPY_PASTE_SNIPPET = `import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: TooltipSide;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("Tooltip sub-components must be used inside <Tooltip>");
  return context;
}

export interface TooltipProps {
  defaultOpen?: boolean;
  side?: TooltipSide;
  children: ReactNode;
  className?: string;
}`;

const PROPS_ROWS = [
  { prop: "defaultOpen", type: "boolean", default: "false", description: "Controls the initial open state before hover or focus interactions occur." },
  { prop: "side", type: '"top" | "bottom" | "left" | "right"', default: '"top"', description: "Positions the tooltip relative to its trigger." },
  { prop: "className", type: "string", default: "—", description: "Additional classes applied to the tooltip root wrapper." },
  { prop: "Tooltip.Trigger", type: "HTMLAttributes<HTMLSpanElement>", default: "—", description: "Wraps the interactive element that opens the tooltip on hover or focus." },
  { prop: "Tooltip.Content", type: "HTMLAttributes<HTMLDivElement>", default: "—", description: "Renders the floating tooltip message surface." },
];

export default function TooltipDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Overlay</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Tooltip</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Tooltip
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Contextual helper text for compact actions and icon-only controls. Tooltips appear on
            hover and focus while keeping the surrounding layout unchanged.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode", "Animated", "Keyboard Nav"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="tooltip" />

        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22] sm:grid-cols-2">
            {TOOLTIP_SIDES.map(({ side, label }) => (
              <div key={side} className="flex min-h-24 items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-[#1f2937]">
                <Tooltip side={side}>
                  <Tooltip.Trigger>
                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-[#1f2937]"
                    >
                      {label} tooltip
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Content>{label} aligned guidance</Tooltip.Content>
                </Tooltip>
              </div>
            ))}
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Tooltip.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Tooltip.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
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
                    <td className="px-4 py-3 max-w-[260px]"><code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
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
