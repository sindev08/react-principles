"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Badge } from "@/ui/Badge";
import type { BadgeVariant, BadgeSize } from "@/ui/Badge";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

type VariantMeta = { variant: BadgeVariant; label: string };

const VARIANTS: VariantMeta[] = [
  { variant: "default", label: "Default" },
  { variant: "success", label: "Success" },
  { variant: "warning", label: "Warning" },
  { variant: "error", label: "Error" },
  { variant: "info", label: "Info" },
  { variant: "outline", label: "Outline" },
];

const FORCED_LIGHT: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700",
  success: "bg-green-100 text-green-700",
  warning: "bg-amber-100 text-amber-700",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  outline: "border border-slate-300 text-slate-600",
};

const FORCED_DARK: Record<BadgeVariant, string> = {
  default: "bg-slate-800 text-slate-300",
  success: "bg-green-900/40 text-green-400",
  warning: "bg-amber-900/40 text-amber-400",
  error: "bg-red-900/40 text-red-400",
  info: "bg-blue-900/40 text-blue-400",
  outline: "border border-slate-600 text-slate-400",
};

const SIZES: BadgeSize[] = ["sm", "md", "lg"];

const CODE_SNIPPET = `import { Badge } from "@/ui/Badge";

// Variants
<Badge variant="default">Default</Badge>
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Inactive</Badge>
<Badge variant="info">Review</Badge>
<Badge variant="outline">Draft</Badge>

// Sizes
<Badge size="sm" variant="success">Small</Badge>
<Badge size="md" variant="info">Medium</Badge>
<Badge size="lg" variant="default">Large</Badge>`;

const COPY_PASTE_SNIPPET = `import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  outline: "border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
};

export function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}`;

const PROPS_ROWS = [
  { prop: "variant", type: '"default" | "success" | "warning" | "error" | "info" | "outline"', required: false, default: '"default"', description: "Controls the color scheme of the badge." },
  { prop: "size", type: '"sm" | "md" | "lg"', required: false, default: '"md"', description: "Controls padding and font size." },
  { prop: "children", type: "ReactNode", required: true, default: "—", description: "The label content displayed inside the badge." },
  { prop: "className", type: "string", required: false, default: "—", description: "Additional CSS classes merged via cn()." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

function ThemedBadgeGrid({ theme }: { theme: "light" | "dark" }) {
  const d = theme === "dark";
  const bg = d ? "bg-[#0d1117]" : "bg-white";
  const border = d ? "border-[#1f2937]" : "border-slate-200";
  const forced = d ? FORCED_DARK : FORCED_LIGHT;
  const label = d ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`rounded-xl border ${border} ${bg} p-6 space-y-5`}>
      <div className="flex flex-wrap gap-2">
        {VARIANTS.map(({ variant, label: text }) => (
          <span key={variant} className={`inline-flex items-center font-medium rounded-full text-xs px-2.5 py-0.5 ${forced[variant]}`}>
            {text}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-[10px] ${label}`}>sm →</span>
        <span className={`inline-flex items-center font-medium rounded-full text-[10px] px-2 py-0.5 ${forced.success}`}>Active</span>
        <span className={`text-[10px] ${label} ml-2`}>md →</span>
        <span className={`inline-flex items-center font-medium rounded-full text-xs px-2.5 py-0.5 ${forced.info}`}>Review</span>
        <span className={`text-[10px] ${label} ml-2`}>lg →</span>
        <span className={`inline-flex items-center font-medium rounded-full text-sm px-3 py-1 ${forced.warning}`}>Pending</span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BadgeDocPage() {
  const [activeSize, setActiveSize] = useState<BadgeSize>("md");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">General</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Badge</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Badge
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A small visual indicator used to highlight status, category, or count. Supports
            multiple semantic variants and three sizes with automatic dark mode support.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "6 Variants", "3 Sizes"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            All six variants across both themes — rendered with forced styling so the comparison
            is accurate regardless of the current app theme.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedBadgeGrid theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedBadgeGrid theme="dark" />
            </div>
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            {/* Size selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Size</span>
              <div className="flex gap-2">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setActiveSize(s)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeSize === s
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            {/* All variants */}
            <div className="flex flex-wrap items-center gap-3">
              {VARIANTS.map(({ variant, label }) => (
                <Badge key={variant} variant={variant} size={activeSize}>
                  {label}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Badge.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Backward compatible: API lama <code className="font-mono">{"<Badge />"}</code> tetap didukung, canonical style pakai
            <code className="font-mono"> {"<Badge />"}</code>.
          </p>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Badge.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
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
