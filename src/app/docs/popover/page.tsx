"use client";

import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Popover } from "@/ui/Popover";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Popover } from "@/ui/Popover";

<Popover.Root>
  <Popover.Trigger>Open profile card</Popover.Trigger>
  <Popover.Content>
    <h4 className="text-sm font-semibold">Project Access</h4>
    <p className="mt-1 text-xs text-slate-500">Invite teammates and set role permissions.</p>
    <div className="mt-3">
      <Popover.Close>Done</Popover.Close>
    </div>
  </Popover.Content>
</Popover.Root>`;

const COPY_PASTE_SNIPPET = `import { useState, type ReactNode } from "react";

function PopoverRoot({ children }: { children: ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

function PopoverTrigger({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">{children}</button>;
}

function PopoverContent({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">{children}</div>;
}

type PopoverCompound = typeof PopoverRoot & {
  Root: typeof PopoverRoot;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
};

export const Popover = Object.assign(PopoverRoot, { Root: PopoverRoot, Trigger: PopoverTrigger, Content: PopoverContent }) as PopoverCompound;

// usage
function Example() {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root>
      <Popover.Trigger onClick={() => setOpen((v) => !v)}>Toggle</Popover.Trigger>
      <Popover.Content open={open}>Popover content</Popover.Content>
    </Popover.Root>
  );
}`;

export default function PopoverDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Popover</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Click-triggered floating panel for contextual actions and details.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Popover.Root>
              <Popover.Trigger>Open profile card</Popover.Trigger>
              <Popover.Content>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Project Access</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Invite teammates and set role permissions.
                </p>
                <div className="mt-3">
                  <Popover.Close>Done</Popover.Close>
                </div>
              </Popover.Content>
            </Popover.Root>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Popover.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Popover.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
