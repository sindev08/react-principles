"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { ToggleGroup } from "@/ui/ToggleGroup";
import type { ToggleVariant, ToggleSize } from "@/ui/Toggle";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type ToggleThemeState = "on" | "off";

const FORCED_TOGGLE_LIGHT: Record<ToggleVariant, Record<ToggleThemeState, string>> = {
  default: {
    on: "bg-[#4628F1] text-white",
    off: "bg-slate-100 text-slate-700",
  },
  outline: {
    on: "bg-slate-100 text-slate-900 border border-slate-300",
    off: "border border-slate-300 text-slate-700",
  },
};

const FORCED_TOGGLE_DARK: Record<ToggleVariant, Record<ToggleThemeState, string>> = {
  default: {
    on: "bg-[#4628F1] text-white",
    off: "bg-slate-800 text-slate-100",
  },
  outline: {
    on: "bg-slate-800 text-white border border-slate-600",
    off: "border border-slate-600 text-slate-300",
  },
};

const TOGGLE_BASE = "inline-flex items-center justify-center font-semibold transition-all";

const TOGGLE_VARIANTS: { variant: ToggleVariant; label: string }[] = [
  { variant: "default", label: "Default" },
  { variant: "outline", label: "Outline" },
];

function ThemedToggleGroupGrid({ theme }: { theme: "light" | "dark" }) {
  const d = theme === "dark";
  const bg = d ? "bg-[#0d1117]" : "bg-white";
  const border = d ? "border-[#1f2937]" : "border-slate-200";
  const forced = d ? FORCED_TOGGLE_DARK : FORCED_TOGGLE_LIGHT;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-6`}>
      <div className="space-y-4">
        {TOGGLE_VARIANTS.map(({ variant }) => (
          <div key={variant} className="inline-flex items-center">
            <button className={`${TOGGLE_BASE} ${forced[variant].on} text-sm px-4 py-2 h-9 first:rounded-l-lg first:rounded-r-none`}>
              A
            </button>
            <button className={`${TOGGLE_BASE} ${forced[variant].off} text-sm px-4 py-2 h-9 rounded-none -ml-px`}>
              B
            </button>
            <button className={`${TOGGLE_BASE} ${forced[variant].off} text-sm px-4 py-2 h-9 last:rounded-r-lg last:rounded-l-none rounded-none -ml-px`}>
              C
            </button>
          </div>
        ))}
      </div>
      <div className="inline-flex items-center mt-4">
        <button className={`${TOGGLE_BASE} ${forced.default.on} text-xs px-3 py-1.5 h-7 first:rounded-l-lg first:rounded-r-none`}>
          sm
        </button>
        <button className={`${TOGGLE_BASE} ${forced.default.on} text-xs px-3 py-1.5 h-7 rounded-none -ml-px`}>
          sm
        </button>
        <button className={`${TOGGLE_BASE} ${forced.default.on} text-xs px-3 py-1.5 h-7 last:rounded-r-lg last:rounded-l-none rounded-none -ml-px`}>
          sm
        </button>
      </div>
    </div>
  );
}

// ─── Code Snippets ────────────────────────────────────────────────────────────

const CODE_SNIPPET = `import { ToggleGroup } from "@/ui/ToggleGroup";

function TextEditor() {
  const [value, setValue] = useState("bold,underline");

  return (
    <ToggleGroup
      type="multiple"
      value={value}
      onValueChange={setValue}
      variant="outline"
    >
      <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
      <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
      <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
    </ToggleGroup>
  );
}`;

const COPY_PASTE_SNIPPET = `"use client";

import {
  createContext, useCallback, useContext, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

export type ToggleGroupType = "single" | "multiple";
export type ToggleGroupVariant = "default" | "outline";
export type ToggleGroupSize = "sm" | "md" | "lg";

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: ToggleGroupType;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: ToggleGroupVariant;
  size?: ToggleGroupSize;
  disabled?: boolean;
  children: ReactNode;
}

export interface ToggleGroupItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

interface ToggleGroupContextValue {
  value: string;
  variant: ToggleGroupVariant;
  size: ToggleGroupSize;
  type: ToggleGroupType;
  disabled: boolean;
  onItemChange: (itemValue: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) throw new Error("ToggleGroupItem must be used inside <ToggleGroup>");
  return ctx;
}

const VARIANT_CLASSES: Record<ToggleGroupVariant, Record<"on" | "off", string>> = {
  default: {
    on: "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/40",
    off: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400/40",
  },
  outline: {
    on: "bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 focus-visible:ring-slate-400/40",
    off: "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 focus-visible:ring-slate-400/40",
  },
};

const SIZE_CLASSES: Record<ToggleGroupSize, string> = {
  sm: "text-xs px-3 py-1.5 h-7 gap-1.5",
  md: "text-sm px-4 py-2 h-9 gap-2",
  lg: "text-base px-6 py-2.5 h-11 gap-2",
};

function parseValue(val: string): string[] {
  if (!val) return [];
  return val.split(",");
}

function serializeValue(arr: string[]): string {
  return arr.join(",");
}

export function ToggleGroup({
  type = "single", value, defaultValue = "", onValueChange,
  variant = "default", size = "md", disabled = false,
  children, className, ...props
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const onItemChange = useCallback((itemValue: string) => {
    if (type === "single") {
      const current = parseValue(active);
      const next = current.includes(itemValue) && current.length === 1 ? "" : itemValue;
      if (!isControlled) setInternalValue(next);
      onValueChange?.(next);
    } else {
      const current = parseValue(active);
      const next = current.includes(itemValue)
        ? current.filter((v) => v !== itemValue)
        : [...current, itemValue];
      const serialized = serializeValue(next);
      if (!isControlled) setInternalValue(serialized);
      onValueChange?.(serialized);
    }
  }, [type, active, isControlled, onValueChange]);

  return (
    <ToggleGroupContext.Provider value={{ value: active, variant, size, type, disabled, onItemChange }}>
      <div role="group" className={cn("inline-flex items-center", className)} {...props}>
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

ToggleGroup.Item = function ToggleGroupItem({
  value: itemValue, disabled: itemDisabled = false,
  children, className, onClick, ...props
}: ToggleGroupItemProps) {
  const { value, variant, size, disabled: groupDisabled, onItemChange } = useToggleGroupContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isActive = parseValue(value).includes(itemValue);
  const isDisabled = groupDisabled || itemDisabled;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const group = buttonRef.current?.parentElement;
    if (!group) return;
    const items = Array.from(
      group.querySelectorAll<HTMLButtonElement>("[data-toggle-group-item]:not([disabled])")
    );
    const currentEl = buttonRef.current;
    const currentIndex = currentEl ? items.indexOf(currentEl) : -1;
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = items.length - 1;
    }
    if (nextIndex !== currentIndex) items[nextIndex]?.focus();
  };

  const stateClasses = isActive ? VARIANT_CLASSES[variant].on : VARIANT_CLASSES[variant].off;

  return (
    <button
      ref={buttonRef} type="button" data-toggle-group-item
      aria-pressed={isActive} disabled={isDisabled}
      onClick={(e) => { onClick?.(e); if (isDisabled) return; onItemChange(itemValue); }}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        stateClasses, SIZE_CLASSES[size],
        "first:rounded-l-lg first:rounded-r-none last:rounded-r-lg last:rounded-l-none",
        "not-first:-ml-px",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
};`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ToggleGroupDocsPage() {
  const [alignment, setAlignment] = useState("center");
  const [formats, setFormats] = useState("bold,underline");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Toggle Group</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            ToggleGroup
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A set of toggle buttons where one or multiple can be active. Supports single
            selection (segmented control) and multiple selection (toolbar) modes.
          </p>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="toggle-group" />
        </section>

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Both variants and three sizes across both themes — forced styling for
            accurate side-by-side comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shadow-xs bg-amber-400 shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedToggleGroupGrid theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedToggleGroupGrid theme="dark" />
            </div>
          </div>
        </section>

        {/* 02 Features */}
        <section id="features" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Single &amp; Multiple modes:</strong> <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">type="single"</code> or <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">type="multiple"</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Controlled &amp; Uncontrolled:</strong> Use <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">value</code>/<code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">onValueChange</code> or <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">defaultValue</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Variants &amp; Sizes:</strong> default/outline in sm/md/lg
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Keyboard Navigation:</strong> Arrow keys, Home/End
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Flexible disabling:</strong> Group-level or per-item
              </span>
            </li>
          </ul>
        </section>

        {/* 03 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>

          <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8 space-y-8">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Single selection (controlled)</p>
              <ToggleGroup
                type="single"
                value={alignment}
                onValueChange={setAlignment}
              >
                <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
                <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
                <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
              </ToggleGroup>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Selected: {alignment || "none"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Multiple selection (controlled)</p>
              <ToggleGroup
                type="multiple"
                value={formats}
                onValueChange={setFormats}
                variant="outline"
              >
                <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
                <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
                <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
                <ToggleGroup.Item value="strikethrough">S</ToggleGroup.Item>
              </ToggleGroup>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Active: {formats ? formats.split(",").join(", ") : "none"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Outline variant</p>
              <ToggleGroup type="single" defaultValue="vue" variant="outline">
                <ToggleGroup.Item value="react">React</ToggleGroup.Item>
                <ToggleGroup.Item value="vue">Vue</ToggleGroup.Item>
                <ToggleGroup.Item value="svelte">Svelte</ToggleGroup.Item>
              </ToggleGroup>
            </div>
          </div>
        </section>

        {/* 04 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="ToggleGroup.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="ToggleGroup.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 06 Usage Examples */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">06</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Examples</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Single selection (segmented control)
              </h3>
              <CodeBlock
                copyText={`<ToggleGroup type="single" defaultValue="center">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup>`}
              >{`<ToggleGroup type="single" defaultValue="center">
  <ToggleGroup.Item value="left">Left</ToggleGroup.Item>
  <ToggleGroup.Item value="center">Center</ToggleGroup.Item>
  <ToggleGroup.Item value="right">Right</ToggleGroup.Item>
</ToggleGroup>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Multiple selection (toolbar)
              </h3>
              <CodeBlock
                copyText={`<ToggleGroup type="multiple" defaultValue="bold" variant="outline">
  <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
</ToggleGroup>`}
              >{`<ToggleGroup type="multiple" defaultValue="bold" variant="outline">
  <ToggleGroup.Item value="bold">B</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">I</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">U</ToggleGroup.Item>
</ToggleGroup>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Controlled with string parsing
              </h3>
              <CodeBlock
                copyText={`const [value, setValue] = useState("bold,underline");

<ToggleGroup
  type="multiple"
  value={value}
  onValueChange={setValue}
>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
</ToggleGroup>`}
              >{`const [value, setValue] = useState("bold,underline");

<ToggleGroup
  type="multiple"
  value={value}
  onValueChange={setValue}
>
  <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
  <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
  <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
</ToggleGroup>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                With disabled items
              </h3>
              <CodeBlock
                copyText={`<ToggleGroup type="single" defaultValue="b">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
  <ToggleGroup.Item value="c" disabled>C</ToggleGroup.Item>
</ToggleGroup>`}
              >{`<ToggleGroup type="single" defaultValue="b">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
  <ToggleGroup.Item value="c" disabled>C</ToggleGroup.Item>
</ToggleGroup>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* 07 Props Table */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">07</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1f2937]">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Component
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Prop
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Default
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={7}>
                    ToggleGroup
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">type</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"single" | "multiple"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"single"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Selection mode</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">value</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled value (comma-separated for multiple)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultValue</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">""</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Uncontrolled initial value</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onValueChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(value: string) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when selection changes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">variant</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"default" | "outline"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"default"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Visual variant</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">size</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"sm" | "md" | "lg"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"md"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Button size</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable all items</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>
                    ToggleGroupItem
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">value</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Unique value for this item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable this specific item</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
