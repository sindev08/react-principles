"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Checkbox } from "@/ui/Checkbox";
import type { CheckboxSize } from "@/ui/Checkbox";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const SIZES: CheckboxSize[] = ["sm", "md", "lg"];

const NOTIFICATION_ITEMS = [
  { id: "email", label: "Email notifications", description: "Receive updates via email." },
  { id: "push", label: "Push notifications", description: "Get alerts on your device." },
  { id: "sms", label: "SMS alerts", description: "Important messages by text." },
  { id: "digest", label: "Weekly digest", description: "A summary every Monday." },
];

const CODE_SNIPPET = `import { Checkbox } from "@/ui/Checkbox";

// Basic
<Checkbox label="Accept terms and conditions" />

// Controlled
<Checkbox
  checked={isChecked}
  onChange={setIsChecked}
  label="Email notifications"
  description="Receive updates via email."
/>

// Indeterminate (select-all pattern)
<Checkbox
  checked={allSelected}
  indeterminate={someSelected && !allSelected}
  onChange={handleSelectAll}
  label="Select all"
/>

// States
<Checkbox checked label="Checked" />
<Checkbox indeterminate label="Indeterminate" />
<Checkbox disabled label="Disabled" />
<Checkbox checked disabled label="Checked + disabled" />

// Sizes
<Checkbox size="sm" label="Small" />
<Checkbox size="md" label="Medium" />
<Checkbox size="lg" label="Large" />`;

const COPY_PASTE_SNIPPET = `import { useEffect, useRef } from "react";

type CheckboxSize = "sm" | "md" | "lg";

interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: CheckboxSize;
  label?: string;
  description?: string;
  id?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const cn = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

const BOX_SIZES: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

function CheckboxRoot({ checked, defaultChecked, indeterminate = false, disabled = false, size = "md", label, description, id, name, onChange, className }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  const isChecked = checked ?? false;
  const isFilled = isChecked || indeterminate;

  return (
    <label className={cn("inline-flex items-start gap-3", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer", className)}>
      <div className="relative mt-0.5 shrink-0">
        <input ref={inputRef} type="checkbox" id={id} name={name} checked={checked} defaultChecked={defaultChecked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} className="sr-only" />
        <div className={cn("flex items-center justify-center rounded-sm border-2 transition-all", BOX_SIZES[size], isFilled ? "border-primary bg-primary text-white" : "border-slate-300 bg-white dark:border-slate-600 dark:bg-[#0d1117]")}>
          {isChecked && <span className="text-[10px]">✓</span>}
          {indeterminate && !isChecked && <span className="text-[10px]">−</span>}
        </div>
      </div>
      {(label ?? description) && (
        <div className="min-w-0">
          {label && <span className="block text-sm font-medium leading-tight text-slate-900 dark:text-white">{label}</span>}
          {description && <p className="mt-0.5 text-xs leading-relaxed text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
    </label>
  );
}

type CheckboxCompound = typeof CheckboxRoot & { Root: typeof CheckboxRoot };
export const Checkbox = Object.assign(CheckboxRoot, { Root: CheckboxRoot }) as CheckboxCompound;`;

const PROPS_ROWS = [
  { prop: "checked", type: "boolean", default: "—", description: "Controlled checked state." },
  { prop: "defaultChecked", type: "boolean", default: "false", description: "Uncontrolled initial checked state." },
  { prop: "indeterminate", type: "boolean", default: "false", description: "Shows a dash — used for partial selection in select-all patterns." },
  { prop: "disabled", type: "boolean", default: "false", description: "Prevents interaction and reduces opacity." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls box size and label font size." },
  { prop: "label", type: "string", default: "—", description: "Clickable text label rendered beside the checkbox." },
  { prop: "description", type: "string", default: "—", description: "Secondary muted text displayed below the label." },
  { prop: "onChange", type: "(checked: boolean) => void", default: "—", description: "Callback fired with the new boolean value." },
  { prop: "id / name", type: "string", default: "—", description: "Forwarded to the underlying <input> element." },
];

// ─── Forced-theme state rows ──────────────────────────────────────────────────

type ForcedState = { boxCls: string; label: string; stateLabel: string };

const FORCED_STATES = {
  light: [
    { boxCls: "border-2 border-slate-300 bg-white", label: "Accept terms", stateLabel: "Unchecked" },
    { boxCls: "border-2 border-[#4628F1] bg-[#4628F1] text-white", label: "Email notifications", stateLabel: "Checked", showCheck: true },
    { boxCls: "border-2 border-[#4628F1] bg-[#4628F1] text-white", label: "All categories", stateLabel: "Indeterminate", showMinus: true },
    { boxCls: "border-2 border-slate-200 bg-slate-100 opacity-50", label: "Archived items", stateLabel: "Disabled" },
  ] as Array<ForcedState & { showCheck?: boolean; showMinus?: boolean }>,
  dark: [
    { boxCls: "border-2 border-slate-600 bg-[#0d1117]", label: "Accept terms", stateLabel: "Unchecked" },
    { boxCls: "border-2 border-[#4628F1] bg-[#4628F1] text-white", label: "Email notifications", stateLabel: "Checked", showCheck: true },
    { boxCls: "border-2 border-[#4628F1] bg-[#4628F1] text-white", label: "All categories", stateLabel: "Indeterminate", showMinus: true },
    { boxCls: "border-2 border-[#1f2937] bg-[#1f2937] opacity-50", label: "Archived items", stateLabel: "Disabled" },
  ] as Array<ForcedState & { showCheck?: boolean; showMinus?: boolean }>,
};

function ThemedCheckboxPreview({ theme }: { theme: "light" | "dark" }) {
  const d = theme === "dark";
  const bg = d ? "bg-[#0d1117]" : "bg-white";
  const border = d ? "border-[#1f2937]" : "border-slate-200";
  const labelCls = d ? "text-slate-200" : "text-slate-800";
  const stateCls = d ? "text-slate-500" : "text-slate-400";
  const states = d ? FORCED_STATES.dark : FORCED_STATES.light;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-6 space-y-4`}>
      {states.map((s) => (
        <div key={s.stateLabel} className="flex items-center gap-3">
          <div className={`h-5 w-5 shrink-0 rounded-sm flex items-center justify-center ${s.boxCls}`}>
            {s.showCheck && (
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
            {s.showMinus && (
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span className={`text-sm font-medium flex-1 ${labelCls}`}>{s.label}</span>
          <span className={`text-xs ${stateCls}`}>{s.stateLabel}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckboxDocPage() {
  const [activeSize, setActiveSize] = useState<CheckboxSize>("md");
  const [checked, setChecked] = useState<Record<string, boolean>>({
    email: true,
    push: false,
    sms: true,
    digest: false,
  });

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allChecked = checkedCount === NOTIFICATION_ITEMS.length;
  const someChecked = checkedCount > 0 && !allChecked;

  const handleSelectAll = (val: boolean) => {
    setChecked(Object.fromEntries(NOTIFICATION_ITEMS.map((i) => [i.id, val])));
  };

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Checkbox</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Checkbox
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A binary or indeterminate selection control. Supports label, description, three
            sizes, and an indeterminate state for select-all patterns.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Indeterminate", "3 Sizes", "Custom Visual"].map((tag) => (
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
            All four states — unchecked, checked, indeterminate, and disabled — rendered
            with forced light and dark styling for direct comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedCheckboxPreview theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedCheckboxPreview theme="dark" />
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

            {/* Select all group */}
            <div className="space-y-1">
              <div className="pb-3 border-b border-slate-100 dark:border-[#1f2937]">
                <Checkbox
                  size={activeSize}
                  checked={allChecked}
                  indeterminate={someChecked}
                  onChange={handleSelectAll}
                  label="Notification channels"
                  description={`${checkedCount} of ${NOTIFICATION_ITEMS.length} selected`}
                />
              </div>
              <div className="pt-2 space-y-3 pl-2">
                {NOTIFICATION_ITEMS.map((item) => (
                  <Checkbox
                    key={item.id}
                    size={activeSize}
                    checked={checked[item.id]}
                    onChange={(val) => setChecked((prev) => ({ ...prev, [item.id]: val }))}
                    label={item.label}
                    description={item.description}
                  />
                ))}
              </div>
            </div>

            {/* Disabled states */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#1f2937] flex flex-wrap gap-6">
              <Checkbox size={activeSize} disabled label="Disabled unchecked" />
              <Checkbox size={activeSize} disabled checked label="Disabled checked" />
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
          <CodeBlock filename="src/ui/Checkbox.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
            Backward compatible: API lama <code className="font-mono">{"<Checkbox />"}</code> masih didukung, tapi docs sekarang pakai
            <code className="font-mono"> {"<Checkbox />"}</code>.
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
          <CodeBlock filename="Checkbox.tsx" copyText={COPY_PASTE_SNIPPET}>
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
                    <td className="px-4 py-3 max-w-[180px]">
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
