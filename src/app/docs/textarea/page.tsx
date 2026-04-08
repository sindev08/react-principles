"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Textarea } from "@/ui/Textarea";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

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
}

const SIZE_CLASSES: Record<TextareaSize, string> = {
  sm: "min-h-20 px-3 py-2 text-xs",
  md: "min-h-24 px-3.5 py-2.5 text-sm",
  lg: "min-h-32 px-4 py-3 text-base",
};

const VARIANT_CLASSES: Record<TextareaVariant, string> = {
  default:
    "border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] hover:border-slate-300 dark:hover:border-slate-600",
  filled:
    "border border-transparent bg-slate-100 dark:bg-[#161b22] hover:bg-slate-200/80 dark:hover:bg-[#1f2937]",
  ghost:
    "border border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-[#161b22]",
};

const ERROR_CLASSES =
  "border-red-400 dark:border-red-500 focus-within:border-red-400 dark:focus-within:border-red-500 focus-within:ring-red-400/20";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextareaRoot(
  {
    label,
    description,
    error,
    size = "md",
    variant = "default",
    disabled,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-slate-700 dark:text-slate-300", disabled && "opacity-50")}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary dark:focus-within:border-primary",
          VARIANT_CLASSES[variant],
          error && ERROR_CLASSES,
          disabled && "opacity-50"
        )}
      >
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full resize-y rounded-lg bg-transparent outline-hidden",
            "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
            SIZE_CLASSES[size]
          )}
          {...props}
        />
      </div>

      {description && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});`;

export default function TextareaDocPage() {
  const [value, setValue] = useState("");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Textarea</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Multi-line input for longer content with label, helper text, and error states.
        </p>

        <CliInstallBlock name="textarea" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Textarea
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
