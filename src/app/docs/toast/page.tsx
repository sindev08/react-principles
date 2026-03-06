"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import { Toast } from "@/ui/Toast";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Toast } from "@/ui/Toast";

<Toast.Root open={open} onOpenChange={setOpen} variant="success">
  <Toast.Title>Saved successfully</Toast.Title>
  <Toast.Description>Your profile changes are now live.</Toast.Description>
  <Toast.Footer>
    <Toast.Close>Dismiss</Toast.Close>
  </Toast.Footer>
</Toast.Root>`;

const COPY_PASTE_SNIPPET = `import { useEffect, useState, type ReactNode } from "react";

function ToastRoot({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onOpenChange(false), 3000);
    return () => clearTimeout(t);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-full max-w-sm rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
      {children}
    </div>
  );
}

type ToastCompound = typeof ToastRoot & { Root: typeof ToastRoot };
export const Toast = Object.assign(ToastRoot, { Root: ToastRoot }) as ToastCompound;`;

export default function ToastDocPage() {
  const [open, setOpen] = useState(false);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Toast</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Lightweight notification for async feedback and quick confirmations.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Button.Root onClick={() => setOpen(true)}>Show success toast</Button.Root>
            <Toast.Root open={open} onOpenChange={setOpen} variant="success">
              <Toast.Title>Saved successfully</Toast.Title>
              <Toast.Description>Your profile changes are now live.</Toast.Description>
              <Toast.Footer>
                <Toast.Close>Dismiss</Toast.Close>
              </Toast.Footer>
            </Toast.Root>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Toast.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Toast.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
