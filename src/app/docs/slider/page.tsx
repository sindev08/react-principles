"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Slider } from "@/ui/Slider";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Slider } from "@/components/ui/Slider";

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

export default function SliderDocPage() {
  const [volume, setVolume] = useState(40);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Slider</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Range input for numeric value adjustment with immediate feedback.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Slider label="Volume" value={volume} onValueChange={setVolume} />
            <p className="text-xs text-slate-500 dark:text-slate-400">Current value: {volume}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Slider.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Slider.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
