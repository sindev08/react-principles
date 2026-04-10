"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Command } from "@/ui/Command";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Command } from "@/ui/Command";

<Command>
  <Command.Input placeholder="Search commands..." />
  <Command.List>
    <Command.Group>
      <Command.Label>Navigation</Command.Label>
      <Command.Item value="go-home">Go to home</Command.Item>
      <Command.Item value="open-docs">Open docs</Command.Item>
    </Command.Group>
  </Command.List>
</Command>`;

const COPY_PASTE_SNIPPET = `import { createContext, useContext, useMemo, useState, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CommandContextValue {
  query: string;
  setQuery: (query: string) => void;
}`;

const PROPS_ROWS = [
  { prop: "Command.Input", type: "InputHTMLAttributes<HTMLInputElement>", default: "—", description: "Search field bound to the internal command query state." },
  { prop: "Command.List", type: "HTMLAttributes<HTMLDivElement>", default: "—", description: "Scrollable container for filtered command groups and items." },
  { prop: "Command.Item.value", type: "string", default: "—", description: "Primary searchable string used for filtering the item." },
  { prop: "Command.Item.keywords", type: "string[]", default: "—", description: "Additional search terms matched against the current query." },
  { prop: "Command.Group", type: "HTMLAttributes<HTMLDivElement>", default: "—", description: "Logical grouping wrapper for related command items." },
  { prop: "Command.Label", type: "HTMLAttributes<HTMLParagraphElement>", default: "—", description: "Uppercase section label for a command group." },
  { prop: "Command.Separator", type: "HTMLAttributes<HTMLDivElement>", default: "—", description: "Visual divider between command groups." },
  { prop: "Command.Empty", type: "{ className?: string; children?: ReactNode }", default: '"No results"', description: "Fallback message shown when the query has no matches." },
];

export default function CommandDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Navigation</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Command</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Command
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Search-first command palette surface for app navigation, shortcuts, and filtered action
            discovery with a small set of composable subcomponents.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode", "Keyboard Nav"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="command" />

        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Command>
              <Command.Input placeholder="Search commands..." />
              <Command.List>
                <Command.Group>
                  <Command.Label>Navigation</Command.Label>
                  <Command.Item value="go-home" keywords={["dashboard", "landing"]}>Go to home</Command.Item>
                  <Command.Item value="open-docs" keywords={["guide", "reference"]}>Open docs</Command.Item>
                </Command.Group>
                <Command.Separator />
                <Command.Group>
                  <Command.Label>Actions</Command.Label>
                  <Command.Item value="create-project" keywords={["new", "workspace"]}>Create project</Command.Item>
                  <Command.Item value="invite-team" keywords={["members", "collaborators"]}>Invite team</Command.Item>
                </Command.Group>
                <Command.Empty>No matching command</Command.Empty>
              </Command.List>
            </Command>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Command.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Command.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
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
