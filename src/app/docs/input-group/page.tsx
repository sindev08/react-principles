"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { InputGroup } from "@/ui/InputGroup";

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DollarIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M6 4h4a2 2 0 0 1 0 4H8a2 2 0 0 0 0 4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PercentIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 12l8-8M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-inputgroup--default";

const CODE_SNIPPET = `import { InputGroup } from "@/ui/InputGroup";

// Prefix only
<InputGroup
  label="Search"
  placeholder="Search components..."
  prefix={<SearchIcon />}
/>

// Suffix only
<InputGroup
  label="Amount"
  type="number"
  placeholder="0.00"
  suffix="USD"
/>

// Both prefix and suffix
<InputGroup
  label="Price"
  type="number"
  placeholder="99.99"
  prefix="$"
  suffix="USD"
/>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type ReactNode, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputGroupSize = "sm" | "md" | "lg";
export type InputGroupVariant = "default" | "filled" | "ghost";

export interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  description?: string;
  error?: string;
  size?: InputGroupSize;
  variant?: InputGroupVariant;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<InputGroupSize, {
  input: string;
  label: string;
  prefix: string;
  suffix: string;
}> = {
  sm: {
    input: "h-8 px-3 text-xs",
    label: "text-xs",
    prefix: "pl-3 pr-2 text-xs",
    suffix: "pl-2 pr-3 text-xs",
  },
  md: {
    input: "h-10 px-3.5 text-sm",
    label: "text-sm",
    prefix: "pl-3.5 pr-3 text-sm",
    suffix: "pl-3 pr-3.5 text-sm",
  },
  lg: {
    input: "h-12 px-4 text-base",
    label: "text-sm",
    prefix: "pl-4 pr-3 text-base",
    suffix: "pl-3 pr-4 text-base",
  },
};

const VARIANT_BASE: Record<InputGroupVariant, string> = {
  default:
    "border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] " +
    "hover:border-slate-300 dark:hover:border-slate-600 " +
    "focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
  filled:
    "border border-transparent bg-slate-100 dark:bg-[#161b22] " +
    "hover:bg-slate-150 dark:hover:bg-[#1f2937] " +
    "focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white dark:focus-within:bg-[#0d1117]",
  ghost:
    "border border-transparent bg-transparent " +
    "hover:bg-slate-50 dark:hover:bg-[#161b22] " +
    "focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
};

const ERROR_OVERRIDE =
  "border-red-400 dark:border-red-500 focus-within:border-red-400 dark:focus-within:border-red-500 focus-within:ring-red-400/20";

// ─── Component ────────────────────────────────────────────────────────────────

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  function InputGroupRoot(
    { label, description, error, size = "md", variant = "default", prefix, suffix, disabled, className, id, ...rest },
    ref
  ) {
    const s = SIZE_CLASSES[size];
    const inputId = id ?? (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);

    const inputPadding = cn(
      s.input,
      "bg-transparent outline-hidden border-0 p-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
      prefix && "pl-0",
      suffix && "pr-0"
    );

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn("font-medium text-slate-700 dark:text-slate-300", s.label, disabled && "opacity-50")}
          >
            {label}
          </label>
        )}

        <div
          className={cn(
            "relative flex items-center rounded-lg transition-all",
            VARIANT_BASE[variant],
            error && ERROR_OVERRIDE,
            disabled && "opacity-50 cursor-not-allowed pointer-events-none"
          )}
        >
          {prefix && (
            <span className={cn("flex shrink-0 items-center text-slate-500 dark:text-slate-400", s.prefix)}>
              {prefix}
            </span>
          )}

          <input ref={ref} id={inputId} disabled={disabled} className={inputPadding} {...rest} />

          {suffix && (
            <span className={cn("flex shrink-0 items-center text-slate-500 dark:text-slate-400", s.suffix)}>
              {suffix}
            </span>
          )}
        </div>

        {description && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);`;

const PROPS_ROWS = [
  { prop: "prefix", type: "ReactNode", default: "—", description: "Content rendered on the left side of the input." },
  { prop: "suffix", type: "ReactNode", default: "—", description: "Content rendered on the right side of the input." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls input height and text size." },
  { prop: "variant", type: '"default" | "filled" | "ghost"', default: '"default"', description: "Visual style of the input wrapper." },
  { prop: "error", type: "string", default: "—", description: "Error message — turns border red and replaces description." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disables interaction and reduces opacity." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InputGroupDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Input Group</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Input Group
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            An input with prefix and suffix slots for icons, text, or action buttons. More flexible than leading/trailing icons — accepts any ReactNode.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "3 Sizes", "3 Variants", "Prefix/Suffix"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="input-group" />

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
            <div className="grid gap-4 sm:grid-cols-2">
              <InputGroup
                label="Search"
                placeholder="Search components..."
                prefix={<SearchIcon />}
              />

              <InputGroup
                label="Username"
                placeholder="johndoe"
                prefix="@"
              />

              <InputGroup
                label="Amount"
                type="number"
                placeholder="0.00"
                prefix={<DollarIcon />}
                suffix="USD"
              />

              <InputGroup
                label="Discount"
                type="number"
                placeholder="10"
                suffix={<PercentIcon />}
              />

              <InputGroup
                label="Price"
                type="number"
                placeholder="99.99"
                prefix="$"
                suffix="USD"
              />

              <InputGroup
                label="Website"
                type="url"
                placeholder="example"
                prefix="https://"
                suffix=".com"
              />
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
          <CodeBlock filename="src/ui/InputGroup.tsx" copyText={CODE_SNIPPET}>
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
          <CodeBlock filename="InputGroup.tsx" copyText={COPY_PASTE_SNIPPET}>
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
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Extends all native <code className="font-mono">HTMLInputElement</code> attributes (except <code className="font-mono">size</code> and <code className="font-mono">prefix</code>).
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
