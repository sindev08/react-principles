"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { SearchDialog } from "@/ui/SearchDialog";
import type { SearchItem } from "@/ui/SearchDialog";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-searchdialog--default";

const DEMO_ITEMS: SearchItem[] = [
  { title: "Getting Started", href: "/docs/introduction", description: "Learn the basics of the platform", group: "Docs" },
  { title: "Installation", href: "/docs/installation", description: "Set up your development environment", group: "Docs" },
  { title: "Theming", href: "/docs/theming", description: "Customize colors and typography", group: "Docs" },
  { title: "Server State", href: "/cookbook/server-state", description: "Manage server data with React Query", group: "Cookbook" },
  { title: "Form Validation", href: "/cookbook/form-validation", description: "Validate forms with React Hook Form + Zod", group: "Cookbook" },
  { title: "Component Anatomy", href: "/cookbook/component-anatomy", description: "Build composable UI components", group: "Cookbook" },
];

const CODE_SNIPPET = `import { useState } from "react";
import { SearchDialog } from "@/ui/SearchDialog";

function MyApp() {
  const [open, setOpen] = useState(false);

  return (
    <SearchDialog
      open={open}
      items={searchItems}
      onClose={() => setOpen(false)}
      onNavigate={(href) => {
        router.push(href);
        setOpen(false);
      }}
    />
  );
}`;

const COPY_PASTE_SNIPPET = `"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";
import { cn } from "@/lib/utils";

export interface SearchItem {
  title: string;
  href: string;
  description?: string;
  group: "Docs" | "Cookbook";
  section?: string;
  icon?: string;
}

interface SearchDialogProps {
  open: boolean;
  items: SearchItem[];
  onClose: () => void;
  onNavigate: (href: string) => void;
  savedSlugs?: string[];
  initialQuery?: string;
}

export function SearchDialog({
  open,
  items,
  onClose,
  onNavigate,
  savedSlugs = [],
  initialQuery = "",
}: SearchDialogProps) {
  // See component file for full implementation
}`;

const PROPS_ROWS = [
  { prop: "open", type: "boolean", default: "—", description: "Whether the search dialog is visible." },
  { prop: "items", type: "SearchItem[]", default: "—", description: "Array of searchable items with title, href, description, group, and optional section/icon." },
  { prop: "onClose", type: "() => void", default: "—", description: "Called when the dialog should close (Escape, backdrop click)." },
  { prop: "onNavigate", type: "(href: string) => void", default: "—", description: "Called when a search result is selected with the target href." },
  { prop: "savedSlugs", type: "string[]", default: "[]", description: "Slugs of bookmarked/saved cookbook recipes for the bookmark indicator." },
  { prop: "initialQuery", type: "string", default: '""', description: "Pre-populates the search input when the dialog opens." },
];

export default function SearchDialogDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Navigation</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Search Dialog</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Search Dialog
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Full-screen command-palette-style search dialog with keyboard navigation,
            grouped results, animated enter/exit transitions, and focus trap.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Keyboard Nav", "Focus Trap", "Animated", "Bookmark Support"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="search-dialog" />

        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">Explore all variants and interactive states in Storybook.</p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              The Search Dialog is a full-screen overlay. Open a live demo via the{" "}
              <strong>Storybook link above</strong> or click below to trigger an inline
              preview.
            </p>
            <div className="mt-4">
              <InlineSearchPreview items={DEMO_ITEMS} />
            </div>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/SearchDialog.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="SearchDialog.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {row.description}
                    </td>
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

function InlineSearchPreview({ items }: { items: SearchItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">search</span>
        Search docs...
        <kbd className="ml-auto rounded-sm border border-slate-200 dark:border-[#1f2937] px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
          Ctrl K
        </kbd>
      </button>
      {open && (
        <SearchDialog
          open={open}
          items={items}
          onClose={() => setOpen(false)}
          onNavigate={(href) => {
            window.location.href = href;
          }}
        />
      )}
    </>
  );
}
