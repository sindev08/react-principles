"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Select } from "@/ui/Select";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Select } from "@/ui/Select";

<Select
  label="Framework"
  value={framework}
  onChange={(event) => setFramework(event.target.value)}
  options={[
    { label: "Next.js", value: "next" },
    { label: "Vite", value: "vite" },
    { label: "Remix", value: "remix" },
  ]}
/>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Array<{ label: string; value: string }>;
};

const SelectRoot = forwardRef<HTMLSelectElement, SelectProps>(function SelectRoot(
  { label, options = [], children, className, ...props },
  ref
) {
  return (
    <div className={className}>
      {label && <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <div className="relative">
        <select
          ref={ref}
          className="h-10 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3.5 pr-10 text-sm text-slate-900 outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white"
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
          {children}
        </select>
        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
      </div>
    </div>
  );
});

type SelectCompound = typeof SelectRoot & { Root: typeof SelectRoot };
export const Select = Object.assign(SelectRoot, { Root: SelectRoot }) as SelectCompound;`;

export default function SelectDocPage() {
  const [framework, setFramework] = useState("next");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Select</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Styled native select for predictable keyboard behavior and minimal setup.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Select
              label="Framework"
              value={framework}
              onChange={(event) => setFramework(event.target.value)}
              options={[
                { label: "Next.js", value: "next" },
                { label: "Vite", value: "vite" },
                { label: "Remix", value: "remix" },
              ]}
            />
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Select.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Select.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
