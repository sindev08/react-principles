"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Spinner } from "@/ui/Spinner";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-spinner--default";

const CODE_SNIPPET = `import { Spinner } from "@/ui/Spinner";

// Basic usage
<Spinner />

// Sizes
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

// Variants
<Spinner variant="default" />
<Spinner variant="muted" />

// With custom label
<Spinner label="Loading data..." />`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerVariant = "default" | "muted";

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const VARIANT_CLASSES: Record<SpinnerVariant, string> = {
  default: "text-primary",
  muted: "text-slate-400 dark:text-slate-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Spinner({ size = "md", variant = "default", label }: SpinnerProps) {
  return (
    <div role="status" aria-live="polite" className="inline-flex">
      <svg
        aria-hidden="true"
        className={cn("animate-spin", SIZE_CLASSES[size], VARIANT_CLASSES[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}`;

const PROPS_ROWS = [
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Size of the spinner. sm is 16px, md is 20px, lg is 24px." },
  { prop: "variant", type: '"default" | "muted"', default: '"default"', description: "Visual style. default uses primary color, muted is subtle for colored backgrounds." },
  { prop: "label", type: "string", default: '"Loading..."', description: "Accessible label for screen readers. Override to provide context-specific message." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SpinnerDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Feedback</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Spinner</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Spinner
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Animated circular loading indicator. Displays loading state with accessibility support and multiple size options.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "3 Sizes", "2 Variants", "Animated"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="spinner" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
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

          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Sizes</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Spinner size="sm" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Small</span>
                </div>
                <div className="flex items-center gap-2">
                  <Spinner size="md" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Spinner size="lg" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Large</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Variants</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Spinner variant="default" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Default (primary color)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Spinner variant="muted" />
                  <span className="text-sm text-slate-600 dark:text-slate-400">Muted (subtle)</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">With Text</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Spinner />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Loading data...</span>
                </div>
                <div className="flex items-center gap-3">
                  <Spinner size="sm" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Saving changes...</span>
                </div>
                <div className="flex items-center gap-3">
                  <Spinner size="lg" />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Processing file...</span>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">On Colored Backgrounds</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="p-4 bg-primary rounded-lg flex items-center gap-2">
                  <Spinner variant="muted" />
                  <span className="text-sm text-white">Primary background</span>
                </div>
                <div className="p-4 bg-slate-900 dark:bg-white rounded-lg flex items-center gap-2">
                  <Spinner variant="muted" />
                  <span className="text-sm text-white dark:text-slate-900">Dark background</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Spinner.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Spinner.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
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
