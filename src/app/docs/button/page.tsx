"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import type { ButtonVariant, ButtonSize } from "@/ui/Button";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-button--default";

type VariantMeta = { variant: ButtonVariant; label: string };

const VARIANTS: VariantMeta[] = [
  { variant: "primary", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "ghost", label: "Ghost" },
  { variant: "destructive", label: "Destructive" },
  { variant: "outline", label: "Outline" },
];

const SIZES: ButtonSize[] = ["sm", "md", "lg"];

// Forced-theme classes (no dark: prefix)
const FORCED_LIGHT: Record<ButtonVariant, string> = {
  primary: "bg-[#4628F1] text-white",
  secondary: "bg-slate-100 text-slate-900",
  ghost: "text-slate-700",
  destructive: "bg-red-600 text-white",
  outline: "border border-slate-300 text-slate-700",
};

const FORCED_DARK: Record<ButtonVariant, string> = {
  primary: "bg-[#4628F1] text-white",
  secondary: "bg-slate-800 text-slate-100",
  ghost: "text-slate-300",
  destructive: "bg-red-700 text-white",
  outline: "border border-slate-600 text-slate-300",
};

const BASE_BTN = "inline-flex items-center justify-center font-semibold rounded-lg text-sm px-4 py-2 h-9 transition-all";

const CODE_SNIPPET = `import { Button } from "@/ui/Button";

// Variants
<Button variant="primary">Save changes</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="ghost">Learn more</Button>
<Button variant="destructive">Delete account</Button>
<Button variant="outline">View details</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button isLoading>Saving...</Button>
<Button disabled>Unavailable</Button>`;

const COPY_PASTE_SNIPPET = `import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400/40",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-slate-400/40",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus-visible:ring-red-500/40",
  outline:
    "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 focus-visible:ring-slate-400/40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 h-7 gap-1.5",
  md: "text-sm px-4 py-2 h-9 gap-2",
  lg: "text-base px-6 py-2.5 h-11 gap-2",
};

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}`;

const PROPS_ROWS = [
  { prop: "variant", type: '"primary" | "secondary" | "ghost" | "destructive" | "outline"', default: '"primary"', description: "Visual style of the button." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls height, padding, and font size." },
  { prop: "isLoading", type: "boolean", default: "false", description: "Shows a spinner and disables the button while true." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disables interaction and reduces opacity." },
  { prop: "children", type: "ReactNode", default: "—", description: "Button label content." },
  { prop: "className", type: "string", default: "—", description: "Extra CSS classes merged via cn()." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

function ThemedButtonGrid({ theme }: { theme: "light" | "dark" }) {
  const d = theme === "dark";
  const bg = d ? "bg-[#0d1117]" : "bg-white";
  const border = d ? "border-[#1f2937]" : "border-slate-200";
  const forced = d ? FORCED_DARK : FORCED_LIGHT;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-6`}>
      <div className="flex flex-wrap gap-3">
        {VARIANTS.map(({ variant, label }) => (
          <button key={variant} className={`${BASE_BTN} ${forced[variant]}`}>
            {label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <button className={`inline-flex items-center justify-center font-semibold rounded-lg text-xs px-3 py-1.5 h-7 ${forced.primary}`}>
          Small
        </button>
        <button className={`inline-flex items-center justify-center font-semibold rounded-lg text-sm px-4 py-2 h-9 ${forced.secondary}`}>
          Medium
        </button>
        <button className={`inline-flex items-center justify-center font-semibold rounded-lg text-base px-6 py-2.5 h-11 ${forced.outline}`}>
          Large
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ButtonDocPage() {
  const [activeVariant, setActiveVariant] = useState<ButtonVariant>("primary");
  const [activeSize, setActiveSize] = useState<ButtonSize>("md");
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleLoadingDemo = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">General</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Button</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Button
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Triggers an action or event. Supports five semantic variants, three sizes,
            a loading spinner state, and full keyboard accessibility.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "5 Variants", "3 Sizes", "Loading State"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="button" />

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            All five variants and three sizes across both themes — forced styling for
            accurate side-by-side comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shadow-xs bg-amber-400 shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedButtonGrid theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedButtonGrid theme="dark" />
            </div>
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <span className="text-sm font-bold">02</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0">
              <Link href={STORYBOOK_HREF} target="_blank" rel="noopener noreferrer">
                Open in Storybook
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </Button>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            {/* Controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Variant</span>
                <div className="flex flex-wrap gap-2">
                  {VARIANTS.map(({ variant, label }) => (
                    <button
                      key={variant}
                      onClick={() => setActiveVariant(variant)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeVariant === variant
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Size</span>
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
            </div>

            {/* State toggles */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-[#1f2937]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDisabled}
                  onChange={(e) => setIsDisabled(e.target.checked)}
                  className="rounded-sm border-slate-300 dark:border-slate-600 accent-primary"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">disabled</span>
              </label>
            </div>

            {/* Preview */}
            <div className="flex flex-wrap items-center gap-4 py-6 border-t border-slate-100 dark:border-[#1f2937]">
              <Button
                variant={activeVariant}
                size={activeSize}
                disabled={isDisabled}
              >
                Click me
              </Button>
              <Button
                variant={activeVariant}
                size={activeSize}
                isLoading={isLoading}
                onClick={handleLoadingDemo}
              >
                {isLoading ? "Loading..." : "Try loading"}
              </Button>
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
          <CodeBlock filename="src/ui/Button.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Backward compatible: API lama <code className="font-mono">{"<Button />"}</code> tetap didukung, tapi style utama sekarang
            <code className="font-mono"> {"<Button />"}</code>.
          </p>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Button.tsx" copyText={COPY_PASTE_SNIPPET}>
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
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Extends all native{" "}
            <code className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 text-xs font-mono text-primary">HTMLButtonElement</code>
            {" "}attributes (onClick, type, form, etc.).
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
