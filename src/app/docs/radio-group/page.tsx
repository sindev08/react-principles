"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { getStorybookComponentUrl } from "@/features/docs/lib/storybook";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import { RadioGroup } from "@/ui/RadioGroup";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { RadioGroup } from "@/ui/RadioGroup";

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
}`;

const PROPS_ROWS = [
  { prop: "value", type: "string", default: "—", description: "Controlled selected value for the root radio group." },
  { prop: "defaultValue", type: "string", default: '""', description: "Initial selected value when the group is uncontrolled." },
  { prop: "onValueChange", type: "(value: string) => void", default: "—", description: "Called when users pick a different radio option." },
  { prop: "name", type: "string", default: "Generated id", description: "Sets the shared hidden input name for the group." },
  { prop: "RadioGroup.Item.value", type: "string", default: "—", description: "Unique item value submitted when the option is selected." },
  { prop: "RadioGroup.Item.disabled", type: "boolean", default: "false", description: "Disables an individual option and prevents interaction." },
  { prop: "RadioGroup.Item.label", type: "string", default: "—", description: "Primary label text rendered inside the option card." },
  { prop: "RadioGroup.Item.description", type: "string", default: "—", description: "Secondary helper text rendered below the label." },
];

export default function RadioGroupDocPage() {
  const [plan, setPlan] = useState("pro");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Form</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Radio Group</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Radio Group
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Single-choice selection pattern for plans, preferences, and mutually exclusive options
            with accessible radio semantics and keyboard-friendly structure.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode", "Keyboard Nav"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="radio-group" />

        <section id="demo" className="mb-16">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <span className="text-sm font-bold">01</span>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link
                href={getStorybookComponentUrl("radio-group")}
              target="_blank"
              rel="noopener noreferrer"
                className="inline-flex"
              >
                Open in Storybook
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  open_in_new
                </span>
              </Link>
            </Button>
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <RadioGroup value={plan} onValueChange={setPlan}>
              <RadioGroup.Item value="starter" label="Starter" description="Best for side projects" />
              <RadioGroup.Item value="pro" label="Pro" description="For production apps" />
              <RadioGroup.Item value="enterprise" label="Enterprise" description="Advanced controls" />
            </RadioGroup>
            <p className="text-xs text-slate-500 dark:text-slate-400">Selected plan: {plan}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/RadioGroup.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="RadioGroup.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3"><code className="text-xs font-mono font-semibold text-primary">{row.prop}</code></td>
                    <td className="px-4 py-3 max-w-[260px]"><code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
                    <td className="px-4 py-3"><code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code></td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{row.description}</td>
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
