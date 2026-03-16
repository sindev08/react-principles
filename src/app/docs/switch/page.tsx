"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Switch } from "@/ui/Switch";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Switch } from "@/ui/Switch";

<Switch
  checked={enabled}
  onChange={setEnabled}
  label="Enable analytics"
  description="Track usage data for product insights."
/>`;

const COPY_PASTE_SNIPPET = `import { useState } from "react";

type SwitchProps = {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  description?: string;
};

function SwitchRoot({ checked, defaultChecked = false, onChange, label, description }: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;

  const toggle = () => {
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className="inline-flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        onClick={toggle}
        className={"relative h-6 w-11 rounded-full p-0.5 transition-all " + (isOn ? "bg-primary" : "bg-slate-300 dark:bg-slate-700")}
      >
        <span className={"block h-5 w-5 rounded-full bg-white transition-transform " + (isOn ? "translate-x-5" : "translate-x-0")} />
      </button>
      {(label || description) && (
        <div>
          {label && <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>}
          {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
        </div>
      )}
    </div>
  );
}

type SwitchCompound = typeof SwitchRoot & { Root: typeof SwitchRoot };
export const Switch = Object.assign(SwitchRoot, { Root: SwitchRoot }) as SwitchCompound;`;

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
