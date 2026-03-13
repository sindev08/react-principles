"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { DropdownMenu } from "@/ui/DropdownMenu";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { DropdownMenu } from "@/ui/DropdownMenu";

<DropdownMenu>
  <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Profile</DropdownMenu.Label>
    <DropdownMenu.Item onSelect={() => console.log("Edit")}>Edit profile</DropdownMenu.Item>
    <DropdownMenu.Item onSelect={() => console.log("Invite")}>Invite member</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onSelect={() => console.log("Delete")}>Delete project</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`;

const COPY_PASTE_SNIPPET = `import { useState, type ReactNode } from "react";

function DropdownMenuRoot({ children }: { children: ReactNode }) {
  return <div className="relative inline-block">{children}</div>;
}

function DropdownMenuContent({ open, children }: { open: boolean; children: ReactNode }) {
  if (!open) return null;
  return <div className="absolute right-0 top-[calc(100%+8px)] min-w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-xl">{children}</div>;
}

function DropdownMenuItem({ onClick, children }: { onClick?: () => void; children: ReactNode }) {
  return <button type="button" onClick={onClick} className="flex w-full rounded-lg px-2.5 py-2 text-left text-sm hover:bg-slate-50">{children}</button>;
}

type DropdownMenuCompound = typeof DropdownMenuRoot & {
  Root: typeof DropdownMenuRoot;
  Content: typeof DropdownMenuContent;
  Item: typeof DropdownMenuItem;
};

export const DropdownMenu = Object.assign(DropdownMenuRoot, { Root: DropdownMenuRoot, Content: DropdownMenuContent, Item: DropdownMenuItem }) as DropdownMenuCompound;

function Example() {
  const [open, setOpen] = useState(false);
  return (
    <DropdownMenu>
      <button onClick={() => setOpen((v) => !v)}>Open</button>
      <DropdownMenu.Content open={open}>
        <DropdownMenu.Item onClick={() => setOpen(false)}>Edit</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}`;

export default function DropdownMenuDocPage() {
  const [lastAction, setLastAction] = useState("None");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Dropdown Menu</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Compact action menu for contextual operations.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <DropdownMenu>
              <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Project</DropdownMenu.Label>
                <DropdownMenu.Item onSelect={() => setLastAction("Edit profile")}>Edit profile</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setLastAction("Invite member")}>Invite member</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => setLastAction("Delete project")}>Delete project</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last action: {lastAction}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/DropdownMenu.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="DropdownMenu.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
