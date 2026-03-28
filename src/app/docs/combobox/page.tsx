"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Combobox } from "@/ui/Combobox";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Combobox } from "@/components/ui/Combobox";

<Combobox
  value={value}
  onValueChange={setValue}
  options={[
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Svelte", value: "svelte" },
  ]}
  placeholder="Search framework..."
/>`;

const COPY_PASTE_SNIPPET = `import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export interface ComboboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  label?: string;
  description?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search...",
  emptyText = "No results",
  label,
  description,
  className,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) || option.description?.toLowerCase().includes(q)
    );
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (selectedOption && !open) {
      setQuery(selectedOption.label);
    }
  }, [selectedOption, open]);

  const selectValue = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    const nextOption = options.find((option) => option.value === nextValue);
    setQuery(nextOption?.label ?? "");
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}

      <div ref={containerRef} className="relative">
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!open && event.key === "ArrowDown") {
              setOpen(true);
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlightedIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const option = filtered[highlightedIndex];
              if (option && !option.disabled) selectValue(option.value);
            }
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-hidden transition-all",
            "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600"
          )}
        />
        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
          {open ? "expand_less" : "expand_more"}
        </span>

        {open && (
          <div className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-[#1f2937] dark:bg-[#161b22]">
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{emptyText}</p>
            )}
            {filtered.map((option, index) => {
              const isSelected = selectedValue === option.value;
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => !option.disabled && selectValue(option.value)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                    isHighlighted && "bg-primary/10",
                    !isHighlighted && "hover:bg-slate-50 dark:hover:bg-[#0d1117]",
                    option.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 material-symbols-outlined text-[16px]",
                      isSelected ? "text-primary" : "text-transparent"
                    )}
                  >
                    check
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-slate-900 dark:text-white">{option.label}</span>
                    {option.description && (
                      <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                        {option.description}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}`;

export default function ComboboxDocPage() {
  const [value, setValue] = useState("react");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Combobox</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Searchable picker for larger option lists with keyboard navigation support.
        </p>

        <CliInstallBlock name="combobox" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Combobox
              value={value}
              onValueChange={setValue}
              placeholder="Search framework..."
              options={[
                { label: "React", value: "react", description: "Component-driven UI" },
                { label: "Vue", value: "vue", description: "Progressive framework" },
                { label: "Svelte", value: "svelte", description: "Compiler-based" },
                { label: "Solid", value: "solid", description: "Fine-grained reactivity" },
              ]}
            />
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Combobox.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Combobox.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
