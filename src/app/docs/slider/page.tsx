"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Slider } from "@/ui/Slider";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Slider } from "@/ui/Slider";

<Slider
  label="Volume"
  value={volume}
  min={0}
  max={100}
  step={1}
  onValueChange={setVolume}
/>`;

const COPY_PASTE_SNIPPET = `function SliderRoot({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return <input type="range" value={value} onChange={(e) => onChange(Number(e.target.value))} className="h-2 w-full accent-primary" />;
}

type SliderCompound = typeof SliderRoot & { Root: typeof SliderRoot };
export const Slider = Object.assign(SliderRoot, { Root: SliderRoot }) as SliderCompound;`;

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
