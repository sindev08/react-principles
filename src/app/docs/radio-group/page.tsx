"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { RadioGroup } from "@/ui/RadioGroup";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { RadioGroup } from "@/ui/RadioGroup";

<RadioGroup.Root value={plan} onValueChange={setPlan}>
  <RadioGroup.Item value="starter" label="Starter" description="Best for side projects" />
  <RadioGroup.Item value="pro" label="Pro" description="For production apps" />
  <RadioGroup.Item value="enterprise" label="Enterprise" description="Advanced controls" />
</RadioGroup.Root>`;

const COPY_PASTE_SNIPPET = `import { createContext, useContext, useState, type ReactNode } from "react";

type Ctx = { value: string; setValue: (value: string) => void };
const Ctx = createContext<Ctx | null>(null);

function useRadio() {
  const context = useContext(Ctx);
  if (!context) throw new Error("Use inside RadioGroup.Root");
  return context;
}

function RadioGroupRoot({ value, defaultValue = "", onValueChange, children }: { value?: string; defaultValue?: string; onValueChange?: (value: string) => void; children: ReactNode }) {
  const [internal, setInternal] = useState(defaultValue);
  const active = value ?? internal;
  const setValue = (next: string) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return <Ctx.Provider value={{ value: active, setValue }}><div className="space-y-2">{children}</div></Ctx.Provider>;
}

function RadioGroupItem({ value, label, description }: { value: string; label: string; description?: string }) {
  const radio = useRadio();
  const checked = radio.value === value;
  return (
    <button type="button" role="radio" aria-checked={checked} onClick={() => radio.setValue(value)} className={"flex w-full items-start gap-3 rounded-lg border p-3 text-left " + (checked ? "border-primary bg-primary/5" : "border-slate-200")}>
      <span className={"mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full border " + (checked ? "border-primary" : "border-slate-400")}>{checked && <span className="h-2 w-2 rounded-full bg-primary" />}</span>
      <span>
        <span className="block text-sm font-medium text-slate-900 dark:text-white">{label}</span>
        {description && <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>}
      </span>
    </button>
  );
}

type RadioGroupCompound = typeof RadioGroupRoot & { Root: typeof RadioGroupRoot; Item: typeof RadioGroupItem };
export const RadioGroup = Object.assign(RadioGroupRoot, { Root: RadioGroupRoot, Item: RadioGroupItem }) as RadioGroupCompound;`;

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
            <RadioGroup.Root value={plan} onValueChange={setPlan}>
              <RadioGroup.Item value="starter" label="Starter" description="Best for side projects" />
              <RadioGroup.Item value="pro" label="Pro" description="For production apps" />
              <RadioGroup.Item value="enterprise" label="Enterprise" description="Advanced controls" />
            </RadioGroup.Root>
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
