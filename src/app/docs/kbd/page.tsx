"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Kbd } from "@/ui/Kbd";
import type { KbdSize } from "@/ui/Kbd";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-kbd--default";

// ─── Forced-theme preview ─────────────────────────────────────────────────────

const KBD_BASE_LIGHT =
  "inline-flex items-center justify-center rounded-sm border border-slate-200 bg-white text-slate-700 font-mono transition-colors";

const KBD_BASE_DARK =
  "inline-flex items-center justify-center rounded-sm border border-[#1f2937] bg-[#0d1117] text-slate-300 font-mono transition-colors";

const KBD_SIZE_CLASSES: Record<KbdSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 font-medium",
  md: "text-xs px-2 py-1 font-medium",
};

function ThemedKbdGrid({ theme }: { theme: "light" | "dark" }) {
  const d = theme === "dark";
  const bg = d ? "bg-[#0d1117]" : "bg-white";
  const border = d ? "border-[#1f2937]" : "border-slate-200";
  const base = d ? KBD_BASE_DARK : KBD_BASE_LIGHT;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-6`}>
      <div className="flex flex-wrap items-center gap-3">
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>⌘</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>K</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.md}`}>⌘</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.md}`}>K</kbd>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>Ctrl</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>Shift</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>Alt</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>Esc</kbd>
        <kbd className={`${base} ${KBD_SIZE_CLASSES.sm}`}>Enter</kbd>
      </div>
    </div>
  );
}

// ─── Code Snippets ────────────────────────────────────────────────────────────

const CODE_SNIPPET = `import { Kbd } from "@/ui/Kbd";

// Single key
<Kbd>⌘</Kbd>

// Key combination
<span className="inline-flex items-center gap-1">
  <Kbd>⌘</Kbd>
  <Kbd>K</Kbd>
</span>

// With description
<div className="flex items-center gap-2">
  <span>Search</span>
  <Kbd size="sm">⌘</Kbd>
  <Kbd size="sm">K</Kbd>
</div>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type KbdSize = "sm" | "md";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: KbdSize;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<KbdSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 font-medium",
  md: "text-xs px-2 py-1 font-medium",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center " +
  "rounded-sm " +
  "border border-slate-200 dark:border-[#1f2937] " +
  "bg-white dark:bg-[#0d1117] " +
  "text-slate-700 dark:text-slate-300 " +
  "font-mono " +
  "transition-colors";

// ─── Component ────────────────────────────────────────────────────────────────

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  function KbdRoot({ size = "md", className, children, ...rest }, ref) {
    return (
      <kbd
        ref={ref}
        className={cn(BASE_CLASSES, SIZE_CLASSES[size], className)}
        {...rest}
      >
        {children}
      </kbd>
    );
  }
);`;

const PROPS_ROWS = [
  { prop: "size", type: '"sm" | "md"', default: '"md"', description: "Size of the key display. sm is compact (10px), md is default (12px)." },
  { prop: "className", type: "string", default: "—", description: "Additional CSS classes to apply (merged with base styles)." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function KbdDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Typography</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Kbd</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Kbd
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Keyboard shortcut and key combination display. Renders semantic HTML element with consistent styling for keys and shortcuts.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "2 Sizes", "Semantic", "Lightweight"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="kbd" />

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Both sizes across both themes — forced styling for
            accurate side-by-side comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shadow-xs bg-amber-400 shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedKbdGrid theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedKbdGrid theme="dark" />
            </div>
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
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

          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Common Keys</h3>
              <div className="flex flex-wrap items-center gap-2">
                <Kbd>⌘</Kbd>
                <Kbd>Ctrl</Kbd>
                <Kbd>Shift</Kbd>
                <Kbd>Alt</Kbd>
                <Kbd>Enter</Kbd>
                <Kbd>Esc</Kbd>
                <Kbd>Tab</Kbd>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Key Combinations</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Search</span>
                  <span className="inline-flex items-center gap-1">
                    <Kbd size="sm">⌘</Kbd>
                    <Kbd size="sm">K</Kbd>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Copy</span>
                  <span className="inline-flex items-center gap-1">
                    <Kbd size="sm">⌘</Kbd>
                    <Kbd size="sm">C</Kbd>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-slate-600 dark:text-slate-400 w-24">Save</span>
                  <span className="inline-flex items-center gap-1">
                    <Kbd size="sm">⌘</Kbd>
                    <Kbd size="sm">S</Kbd>
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Size Variants</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Small:</span>
                  <Kbd size="sm">⌘</Kbd>
                  <Kbd size="sm">K</Kbd>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Medium:</span>
                  <Kbd size="md">⌘</Kbd>
                  <Kbd size="md">K</Kbd>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Inline Usage</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Press <Kbd size="sm">?</Kbd> to see all available keyboard shortcuts.
                Use <Kbd size="sm">Esc</Kbd> to close any dialog or dropdown.
                Navigate with <Kbd size="sm">↑</Kbd> <Kbd size="sm">↓</Kbd> <Kbd size="sm">←</Kbd> <Kbd size="sm">→</Kbd> keys.
              </p>
            </div>
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Kbd.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Kbd.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Extends all native <code className="font-mono">HTMLElement</code> attributes.
          </p>
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
                    <td className="px-4 py-3 max-w-[180px]">
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
