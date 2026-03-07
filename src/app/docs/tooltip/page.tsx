"use client";

import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Tooltip } from "@/ui/Tooltip";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Tooltip } from "@/ui/Tooltip";

<Tooltip.Root side="top">
  <Tooltip.Trigger>
    <button type="button">Hover me</button>
  </Tooltip.Trigger>
  <Tooltip.Content>Helpful context for this action</Tooltip.Content>
</Tooltip.Root>`;

const COPY_PASTE_SNIPPET = `import { createContext, useContext, useState, type ReactNode } from "react";

const Ctx = createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

function TooltipRoot({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={{ open, setOpen }}><span className="relative inline-flex">{children}</span></Ctx.Provider>;
}

function TooltipTrigger({ children }: { children: ReactNode }) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Use inside Tooltip.Root");
  return <span onMouseEnter={() => ctx.setOpen(true)} onMouseLeave={() => ctx.setOpen(false)}>{children}</span>;
}

function TooltipContent({ children }: { children: ReactNode }) {
  const ctx = useContext(Ctx);
  if (!ctx || !ctx.open) return null;
  return <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white">{children}</div>;
}

type TooltipCompound = typeof TooltipRoot & { Root: typeof TooltipRoot; Trigger: typeof TooltipTrigger; Content: typeof TooltipContent };
export const Tooltip = Object.assign(TooltipRoot, { Root: TooltipRoot, Trigger: TooltipTrigger, Content: TooltipContent }) as TooltipCompound;`;

export default function TooltipDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Tooltip</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Contextual hint on hover/focus for compact interfaces.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Tooltip.Root side="top">
              <Tooltip.Trigger>
                <button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-sm dark:border-[#1f2937]">Hover for hint</button>
              </Tooltip.Trigger>
              <Tooltip.Content>Only project owners can publish changes</Tooltip.Content>
            </Tooltip.Root>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Tooltip.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Tooltip.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
