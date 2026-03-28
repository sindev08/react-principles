"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { DatePicker } from "@/ui/DatePicker";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { DatePicker } from "@/components/ui/DatePicker";

<DatePicker
  label="Due date"
  value={dueDate}
  onChange={(event) => setDueDate(event.target.value)}
/>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(function DatePickerRoot(
  { label, description, error, className, id, ...props },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="date"
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-hidden transition-all",
          "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
          "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20 dark:border-red-500"
        )}
        {...props}
      />
      {description && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});`;

export default function DatePickerDocPage() {
  const [dueDate, setDueDate] = useState("");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Date Picker</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Native date input wrapped with consistent styling and helper text.</p>

        <CliInstallBlock name="date-picker" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <DatePicker
              label="Due date"
              value={dueDate}
              description="Set your milestone deadline"
              onChange={(event) => setDueDate(event.target.value)}
            />
            <p className="text-xs text-slate-500 dark:text-slate-400">Selected: {dueDate || "None"}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/DatePicker.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="DatePicker.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
