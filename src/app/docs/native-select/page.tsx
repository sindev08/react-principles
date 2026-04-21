"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { NativeSelect } from "@/ui/NativeSelect";
import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-nativeselect--default";

const CODE_SNIPPET = `import { NativeSelect } from "@/ui/NativeSelect";

function Example() {
  const [value, setValue] = useState("");

  return (
    <NativeSelect
      label="Choose an option"
      placeholder="Select..."
      options={[
        { label: "Design System", value: "design-system" },
        { label: "Cookbook", value: "cookbook" },
        { label: "CLI", value: "cli" },
      ]}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NativeSelectSize = "sm" | "md" | "lg";

export interface NativeSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: NativeSelectSize;
  options?: NativeSelectOption[];
  placeholder?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<NativeSelectSize, string> = {
  sm: "h-8 px-3 pr-9 text-xs",
  md: "h-10 px-3.5 pr-10 text-sm",
  lg: "h-12 px-4 pr-11 text-base",
};

const BASE_CLASSES =
  "appearance-none w-full rounded-lg border border-slate-200 dark:border-[#1f2937] " +
  "bg-white dark:bg-[#0d1117] " +
  "text-slate-900 dark:text-white " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus:border-primary dark:focus:border-primary " +
  "focus:outline-none " +
  "focus:ring-2 focus:ring-primary/20 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "transition-colors";

const ERROR_CLASSES =
  "border-red-400 dark:border-red-500 " +
  "focus:border-red-400 dark:focus:border-red-500 " +
  "focus:ring-red-400/20";

// ─── Component ────────────────────────────────────────────────────────────────

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelectRoot(
    { label, description, error, size = "md", options, placeholder, disabled, className, id, children, ...rest },
    ref
  ) {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);
    const descriptionId = id ? \`\${id}-description\` : undefined;
    const errorId = id ? \`\${id}-error\` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn("font-medium text-slate-700 dark:text-slate-300 text-sm", disabled && "opacity-50")}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            aria-invalid={!!error}
            className={cn(BASE_CLASSES, SIZE_CLASSES[size], error && ERROR_CLASSES)}
            {...rest}
          >
            {placeholder && <option value="" disabled>{placeholder}</option>}
            {options?.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))}
            {children}
          </select>

          {/* Dropdown Icon */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {description && !error && <p id={descriptionId} className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        {error && <p id={errorId} className="text-xs text-red-500 dark:text-red-400">{error}</p>}
      </div>
    );
  }
);`;

const PROPS_ROWS = [
  { prop: "options", type: "NativeSelectOption[]", default: "—", description: "Array of { label, value, disabled? } for programmatic rendering." },
  { prop: "placeholder", type: "string", default: "—", description: "Text for empty first option (renders as disabled)." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls select height and text size." },
  { prop: "error", type: "string", default: "—", description: "Error message — turns border red and replaces description." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disables interaction and reduces opacity." },
  { prop: "label", type: "string", default: "—", description: "Label text displayed above the select." },
  { prop: "description", type: "string", default: "—", description: "Helper text displayed below the select (hidden when error present)." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NativeSelectDocPage() {
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("md");
  const [fruit, setFruit] = useState("");

  const OPTIONS = [
    { label: "Design System", value: "design-system" },
    { label: "Cookbook", value: "cookbook" },
    { label: "CLI", value: "cli" },
    { label: "Playground", value: "playground" },
  ];

  const SIZE_OPTIONS = [
    { label: "Small", value: "sm" },
    { label: "Medium", value: "md" },
    { label: "Large", value: "lg" },
  ];

  const FRUIT_OPTIONS = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Mango", value: "mango" },
    { label: "Grape", value: "grape", disabled: true },
  ];

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Native Select</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Native Select
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A styled native select element. Lightweight alternative to custom dropdowns — uses OS-optimized pickers on mobile devices.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "3 Sizes", "Mobile Optimized", "Lightweight"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="native-select" />

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
              <NativeSelect
                label="Category"
                placeholder="Select a category..."
                options={OPTIONS}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                description="Choose the feature category"
              />

              <NativeSelect
                label="Size"
                options={SIZE_OPTIONS}
                value={size}
                onChange={(e) => setSize(e.target.value)}
              />

              <NativeSelect
                label="Favorite Fruit"
                placeholder="Pick your favorite..."
                options={FRUIT_OPTIONS}
                value={fruit}
                onChange={(e) => setFruit(e.target.value)}
              />

              <div className="p-4 bg-slate-50 dark:bg-[#161b22] rounded-lg border border-slate-200 dark:border-[#1f2937]">
                <p className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                  <div>Category: <code className="font-mono">{category || "(none)"}</code></div>
                  <div>Size: <code className="font-mono">{size}</code></div>
                  <div>Fruit: <code className="font-mono">{fruit || "(none)"}</code></div>
                </p>
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
          <CodeBlock filename="src/ui/NativeSelect.tsx" copyText={CODE_SNIPPET}>
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
          <CodeBlock filename="NativeSelect.tsx" copyText={COPY_PASTE_SNIPPET}>
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
            Extends all native <code className="font-mono">HTMLSelectElement</code> attributes (except <code className="font-mono">size</code>).
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
