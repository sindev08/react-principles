"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
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
<Button.Root variant="primary">Save changes</Button.Root>
<Button.Root variant="secondary">Cancel</Button.Root>
<Button.Root variant="ghost">Learn more</Button.Root>
<Button.Root variant="destructive">Delete account</Button.Root>
<Button.Root variant="outline">View details</Button.Root>

// Sizes
<Button.Root size="sm">Small</Button.Root>
<Button.Root size="md">Medium</Button.Root>
<Button.Root size="lg">Large</Button.Root>

// States
<Button.Root isLoading>Saving...</Button.Root>
<Button.Root disabled>Unavailable</Button.Root>`;

const COPY_PASTE_SNIPPET = `import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const cn = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800",
  destructive: "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600",
  outline: "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 h-7 gap-1.5",
  md: "text-sm px-4 py-2 h-9 gap-2",
  lg: "text-base px-6 py-2.5 h-11 gap-2",
};

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />;
}

function ButtonRoot({ variant = "primary", size = "md", isLoading = false, disabled, children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-semibold transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:cursor-not-allowed disabled:opacity-50",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}

type ButtonCompound = typeof ButtonRoot & { Root: typeof ButtonRoot; Spinner: typeof Spinner };
export const Button = Object.assign(ButtonRoot, { Root: ButtonRoot, Spinner }) as ButtonCompound;`;

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
      <div className="mt-4 flex flex-wrap items-center gap-3">
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
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">General</span>
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

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
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
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedButtonGrid theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedButtonGrid theme="dark" />
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
            {/* Controls */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Variant</span>
                <div className="flex flex-wrap gap-2">
                  {VARIANTS.map(({ variant, label }) => (
                    <button
                      key={variant}
                      onClick={() => setActiveVariant(variant)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeVariant === variant
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
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Size</span>
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeSize === s
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
              <Button.Root
                variant={activeVariant}
                size={activeSize}
                disabled={isDisabled}
              >
                Click me
              </Button.Root>
              <Button.Root
                variant={activeVariant}
                size={activeSize}
                isLoading={isLoading}
                onClick={handleLoadingDemo}
              >
                {isLoading ? "Loading..." : "Try loading"}
              </Button.Root>
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
          <CodeBlock filename="src/ui/Button.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Backward compatible: API lama <code className="font-mono">{"<Button />"}</code> tetap didukung, tapi style utama sekarang
            <code className="font-mono"> {"<Button.Root />"}</code>.
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
          <CodeBlock filename="Button.tsx" copyText={COPY_PASTE_SNIPPET}>
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
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Extends all native{" "}
            <code className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 text-xs font-mono text-primary">HTMLButtonElement</code>
            {" "}attributes (onClick, type, form, etc.).
          </p>
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
