"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Switch } from "@/ui/Switch";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Switch } from "@/components/ui/Switch";

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable analytics"
  description="Track usage data for product insights."
/>`;

const COPY_PASTE_SNIPPET = `import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  label?: string;
  description?: string;
  className?: string;
}

const TRACK_SIZES: Record<SwitchSize, string> = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-14",
};

const THUMB_SIZES: Record<SwitchSize, string> = {
  sm: "h-4 w-4 data-[checked=true]:translate-x-4",
  md: "h-5 w-5 data-[checked=true]:translate-x-5",
  lg: "h-6 w-6 data-[checked=true]:translate-x-7",
};

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  className,
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;

  const stateLabel = useMemo(() => (isOn ? "enabled" : "disabled"), [isOn]);

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={cn("inline-flex items-start gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label ?? "Switch"}
        aria-disabled={disabled}
        data-state={isOn ? "checked" : "unchecked"}
        onClick={toggle}
        className={cn(
          "relative shrink-0 rounded-full p-0.5 transition-all outline-hidden",
          "focus-visible:ring-2 focus-visible:ring-primary/40",
          TRACK_SIZES[size],
          isOn ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          data-checked={isOn}
          className={cn(
            "block rounded-full bg-white shadow-sm transition-transform duration-200",
            THUMB_SIZES[size]
          )}
        />
      </button>

      {(label ?? description) && (
        <div className="min-w-0">
          {label && <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>}
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {description} ({stateLabel})
            </p>
          )}
        </div>
      )}
    </div>
  );
}`;

export default function SwitchDocPage() {
  const [enabled, setEnabled] = useState(true);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Switch</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Binary toggle for on/off settings with optional label and helper text.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Switch
              checked={enabled}
              onChange={setEnabled}
              label="Enable analytics"
              description={enabled ? "Analytics is active" : "Analytics is disabled"}
            />
            <Switch defaultChecked={false} label="Email alerts" description="Receive weekly summary emails." />
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Switch.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Switch.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
