"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Slider } from "@/ui/Slider";
import { Button } from "@/ui/Button";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-slider--default";

const CODE_SNIPPET = `import { Slider } from "@/ui/Slider";

<Slider
  label="Volume"
  value={volume}
  min={0}
  max={100}
  step={1}
  onValueChange={setVolume}
/>`;

const COPY_PASTE_SNIPPET = `import { useState } from "react";
import { cn } from "@/lib/utils";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
}

export function Slider({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  label,
  showValue = true,
  className,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
          {showValue && <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(current)}</span>}
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!isControlled) setInternalValue(next);
          onValueChange?.(next);
        }}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary dark:bg-[#1f2937]"
      />
    </div>
  );
}`;

const PROPS_ROWS = [
  { prop: "value", type: "number", default: "—", description: "Controlled slider value." },
  { prop: "defaultValue", type: "number", default: "50", description: "Initial value when the slider is uncontrolled." },
  { prop: "min", type: "number", default: "0", description: "Minimum selectable value." },
  { prop: "max", type: "number", default: "100", description: "Maximum selectable value." },
  { prop: "step", type: "number", default: "1", description: "Increment size between slider positions." },
  { prop: "onValueChange", type: "(value: number) => void", default: "—", description: "Called whenever the range input value changes." },
  { prop: "label", type: "string", default: "—", description: "Optional label displayed above the slider track." },
  { prop: "showValue", type: "boolean", default: "true", description: "Displays the current numeric value alongside the label." },
  { prop: "className", type: "string", default: "—", description: "Additional classes applied to the root wrapper." },
];

export default function SliderDocPage() {
  const [volume, setVolume] = useState(40);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Form</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Slider</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Slider
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Numeric range input with immediate feedback for tuning values like volume, thresholds,
            and preference intensity.
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

        <CliInstallBlock name="slider" />

        <section id="demo" className="mb-16">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <span className="text-sm font-bold">01</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0">
              <Link href={STORYBOOK_HREF} target="_blank" rel="noopener noreferrer">
                Open in Storybook
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </Button>
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Slider label="Volume" value={volume} onValueChange={setVolume} />
            <p className="text-xs text-slate-500 dark:text-slate-400">Current value: {volume}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Slider.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Slider.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
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
                    <td className="px-4 py-3 max-w-[240px]"><code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
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
