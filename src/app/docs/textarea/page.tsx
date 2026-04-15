"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Textarea } from "@/ui/Textarea";
import type { TextareaSize, TextareaVariant } from "@/ui/Textarea";
import { Button } from "@/ui/Button";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-textarea--default";

const VARIANTS: TextareaVariant[] = ["default", "filled", "ghost"];
const SIZES: TextareaSize[] = ["sm", "md", "lg"];

const CODE_SNIPPET = `import { Textarea } from "@/ui/Textarea";

<Textarea
  label="Project notes"
  description="Write key updates for your team."
  placeholder="Type your notes here..."
  size="md"
/>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "filled" | "ghost";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: TextareaSize;
  variant?: TextareaVariant;
  children?: ReactNode;
}`;

const PROPS_ROWS = [
  { prop: "label", type: "string", default: "—", description: "Field label shown above the textarea." },
  { prop: "description", type: "string", default: "—", description: "Helper text displayed below the field when there is no error." },
  { prop: "error", type: "string", default: "—", description: "Validation message that replaces the description and applies error styling." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls the minimum height, padding, and text size." },
  { prop: "variant", type: '"default" | "filled" | "ghost"', default: '"default"', description: "Changes the surface treatment of the textarea." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disables input interaction and dims the field." },
  { prop: "className", type: "string", default: "—", description: "Additional classes merged into the root wrapper." },
];

function ThemedTextareaPanel({ dark }: { dark: boolean }) {
  const shell = dark ? "border-[#1f2937] bg-[#0d1117]" : "border-slate-200 bg-white";

  return (
    <div className={`rounded-xl border p-6 space-y-4 ${shell}`}>
      {VARIANTS.map((variant) => (
        <Textarea
          key={variant}
          label={`${variant} variant`}
          variant={variant}
          defaultValue="Document the migration steps and rollout notes."
          description="Theme preview"
        />
      ))}
    </div>
  );
}

export default function TextareaDocPage() {
  const [value, setValue] = useState("");
  const [size, setSize] = useState<TextareaSize>("md");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Form</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Textarea</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Textarea
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Multi-line text input for notes, descriptions, and longer form content with variant,
            size, helper text, and validation support.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "3 Variants", "3 Sizes"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="textarea" />

        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shadow-xs bg-amber-400 shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedTextareaPanel dark={false} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedTextareaPanel dark />
            </div>
          </div>
        </section>

        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">Explore all variants and interactive states in Storybook.</p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Size</span>
              <div className="flex gap-2">
                {SIZES.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setSize(entry)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${size === entry ? "bg-primary text-white" : "bg-slate-100 text-slate-600 dark:bg-[#1f2937] dark:text-slate-400"}`}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {VARIANTS.map((variant) => (
                <Textarea
                  key={variant}
                  label={`${variant} variant`}
                  description={`${value.length} characters`}
                  placeholder="Document what changed today..."
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  variant={variant}
                  size={size}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Textarea.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Textarea.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3"><code className="font-mono text-xs font-semibold text-primary">{row.prop}</code></td>
                    <td className="px-4 py-3 max-w-[240px]"><code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code></td>
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
