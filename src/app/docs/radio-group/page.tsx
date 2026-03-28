"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { RadioGroup } from "@/ui/RadioGroup";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { RadioGroup } from "@/components/ui/RadioGroup";

<RadioGroup value={plan} onValueChange={setPlan}>
  <RadioGroup.Item value="starter" label="Starter" description="Best for side projects" />
  <RadioGroup.Item value="pro" label="Pro" description="For production apps" />
  <RadioGroup.Item value="enterprise" label="Enterprise" description="Advanced controls" />
</RadioGroup>`;

const COPY_PASTE_SNIPPET = `import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: ReactNode;
}

export interface RadioGroupItemProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  label?: string;
  description?: string;
}

interface RadioGroupContextValue {
  value: string;
  name: string;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroup sub-components must be used inside <RadioGroup>");
  }
  return context;
}

export function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  name,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const autoName = useId();
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider value={{ value: active, setValue, name: name ?? autoName }}>
      <div className={cn("space-y-2", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

RadioGroup.Item = function RadioGroupItem({
  value,
  disabled = false,
  label,
  description,
  children,
  className,
  ...props
}: RadioGroupItemProps) {
  const context = useRadioGroupContext();
  const checked = context.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && context.setValue(value)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
        checked
          ? "border-primary bg-primary/5"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-[#1f2937] dark:bg-[#0d1117] dark:hover:border-slate-600",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-primary" : "border-slate-400 dark:border-slate-500"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      <span className="min-w-0 flex-1">
        {label && <span className="block text-sm font-medium text-slate-900 dark:text-white">{label}</span>}
        {description && <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>}
        {children}
      </span>
      <input readOnly tabIndex={-1} type="radio" name={context.name} value={value} checked={checked} className="sr-only" />
    </button>
  );
}`;

export default function RadioGroupDocPage() {
  const [plan, setPlan] = useState("pro");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Radio Group</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Mutually exclusive options with clear active state and descriptive labels.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <RadioGroup value={plan} onValueChange={setPlan}>
              <RadioGroup.Item value="starter" label="Starter" description="Best for side projects" />
              <RadioGroup.Item value="pro" label="Pro" description="For production apps" />
              <RadioGroup.Item value="enterprise" label="Enterprise" description="Advanced controls" />
            </RadioGroup>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/RadioGroup.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="RadioGroup.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
