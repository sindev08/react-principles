"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Field } from "@/ui/Field";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { Textarea } from "@/ui/Textarea";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-field--default";

const CODE_SNIPPET = `import { Field } from "@/ui/Field";
import { Input } from "@/ui/Input";

// Basic
<Field label="Email">
  <Input type="email" placeholder="you@example.com" />
</Field>

// With helper text
<Field
  label="Password"
  helperText="Must be at least 8 characters."
  required
>
  <Input type="password" />
</Field>

// With error message
<Field
  label="Username"
  errorMessage="Username is already taken."
>
  <Input placeholder="Choose a username" />
</Field>`;

const COPY_PASTE_SNIPPET = `import { cloneElement, forwardRef, type ReactNode, type HTMLAttributes } from "react";
import { Label } from "./Label";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Field = forwardRef<HTMLDivElement, FieldProps>(function FieldRoot(
  {
    label,
    helperText,
    errorMessage,
    required,
    disabled,
    id,
    className,
    children,
    ...rest
  },
  ref
) {
  // Auto-generate ID from label if not provided
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);
  const descriptionId = fieldId ? \`\${fieldId}-description\` : undefined;

  // Clone child element and inject accessibility props
  const child = cloneElement(children as React.ReactElement, {
    id: fieldId,
    "aria-describedby": descriptionId,
    "aria-invalid": !!errorMessage,
  } as Record<string, unknown>);

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5", disabled && "opacity-50", className)}
      {...rest}
    >
      {label && (
        <Label htmlFor={fieldId} required={required}>
          {label}
        </Label>
      )}

      {child}

      {(helperText || errorMessage) && descriptionId && (
        <p
          id={descriptionId}
          className={cn(
            "text-xs",
            errorMessage
              ? "text-red-500 dark:text-red-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});`;

const PROPS_ROWS = [
  { prop: "label", type: "string", default: "—", description: "Field label text." },
  { prop: "helperText", type: "string", default: "—", description: "Descriptive helper text shown below input." },
  { prop: "errorMessage", type: "string", default: "—", description: "Error message — replaces helperText when present." },
  { prop: "required", type: "boolean", default: "false", description: "Shows required indicator on label." },
  { prop: "disabled", type: "boolean", default: "false", description: "Applies muted opacity style." },
  { prop: "id", type: "string", default: "auto-generated", description: "ID for label-input association." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FieldDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Field</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Field
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A form field wrapper that composes Label, input elements, helper text, and error message into a single accessible unit with automatic ID generation.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Auto-ID", "Error State"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="field" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
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
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            {/* Examples */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" helperText="We'll never share your email.">
                <Input type="email" placeholder="you@example.com" />
              </Field>

              <Field
                label="Password"
                helperText="Must be at least 8 characters."
                required
              >
                <Input type="password" placeholder="Enter password" />
              </Field>

              <Field
                label="Username"
                errorMessage="Username is already taken."
              >
                <Input placeholder="Choose a username" />
              </Field>

              <Field label="Country" required>
                <Select
                  options={[
                    { label: "United States", value: "us" },
                    { label: "Canada", value: "ca" },
                    { label: "United Kingdom", value: "uk" },
                  ]}
                />
              </Field>

              <Field label="Bio" helperText="Tell us about yourself.">
                <Textarea placeholder="Write something..." rows={3} />
              </Field>

              <Field
                label="Disabled field"
                helperText="This field is disabled."
                disabled
              >
                <Input disabled placeholder="Cannot edit" />
              </Field>
            </div>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Field.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Field.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Extends all native <code className="font-mono">HTMLDivElement</code> attributes.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {row.description}
                    </td>
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
