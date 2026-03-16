"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Combobox } from "@/ui/Combobox";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Combobox } from "@/ui/Combobox";

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

const COPY_PASTE_SNIPPET = `import { useMemo, useState } from "react";

type Option = { label: string; value: string };

function ComboboxRoot({ options, value, onValueChange, placeholder = "Search..." }: { options: Option[]; value?: string; onValueChange?: (value: string) => void; placeholder?: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const filtered = useMemo(() => options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())), [options, query]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(event) => { setQuery(event.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-slate-200 px-3.5 text-sm"
      />
      {open && (
        <div className="absolute z-40 mt-2 w-full rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          {filtered.map((option) => (
            <button key={option.value} className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-50" onClick={() => { onValueChange?.(option.value); setQuery(option.label); setOpen(false); }}>
              {option.label} {value === option.value ? "✓" : ""}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type ComboboxCompound = typeof ComboboxRoot & { Root: typeof ComboboxRoot };
export const Combobox = Object.assign(ComboboxRoot, { Root: ComboboxRoot }) as ComboboxCompound;`;

export default function ComboboxDocPage() {
  const [value, setValue] = useState("react");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Combobox</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Searchable picker for larger option lists with keyboard navigation support.
        </p>

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
