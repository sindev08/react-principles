"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Textarea } from "@/ui/Textarea";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Textarea } from "@/ui/Textarea";

<Textarea.Root
  label="Project notes"
  description="Write key updates for your team."
  placeholder="Type your notes here..."
  size="md"
/>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type TextareaHTMLAttributes } from "react";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  description?: string;
  error?: string;
};

const cn = (...classes: Array<string | undefined | false>) => classes.filter(Boolean).join(" ");

const TextareaRoot = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextareaRoot(
  { label, description, error, className, ...props },
  ref
) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
      <textarea
        ref={ref}
        className={cn(
          "min-h-24 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-hidden",
          "focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20"
        )}
        {...props}
      />
      {description && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});

type TextareaCompound = typeof TextareaRoot & { Root: typeof TextareaRoot };
export const Textarea = Object.assign(TextareaRoot, { Root: TextareaRoot }) as TextareaCompound;`;

export default function TextareaDocPage() {
  const [value, setValue] = useState("");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Textarea</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Multi-line input for longer content with label, helper text, and error states.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Textarea.Root
              label="Project notes"
              description={`${value.length} characters`}
              placeholder="Document what changed today..."
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Textarea.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Textarea.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
