"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Alert } from "@/ui/Alert";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Alert } from "@/ui/Alert";

<Alert variant="warning">
  <Alert.Title>Unsaved changes</Alert.Title>
  <Alert.Description>You have pending edits that are not published yet.</Alert.Description>
  <Alert.Footer>
    <Alert.Action>Review changes</Alert.Action>
  </Alert.Footer>
</Alert>`;

const COPY_PASTE_SNIPPET = `import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type AlertVariant = "default" | "success" | "warning" | "error" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  default: "border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#161b22]",
  success: "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
  warning: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  error: "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
  info: "border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
};

export function Alert({ variant = "default", className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-xl border p-4", VARIANT_CLASSES[variant], className)}
      {...props}
    />
  );
}

Alert.Title = function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn("text-sm font-semibold text-slate-900 dark:text-white", className)}
      {...props}
    />
  );
}

Alert.Description = function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400", className)}
      {...props}
    />
  );
}

Alert.Footer = function AlertFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-3 flex items-center gap-2", className)}
      {...props}
    />
  );
}

Alert.Action = function AlertAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}`;

export default function AlertDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Alert</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Callout banner for important contextual messages.</p>

        <CliInstallBlock name="alert" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Alert>
              <Alert.Title>Information</Alert.Title>
              <Alert.Description>System maintenance window starts at 22:00.</Alert.Description>
            </Alert>
            <Alert variant="warning">
              <Alert.Title>Unsaved changes</Alert.Title>
              <Alert.Description>You have pending edits that are not published yet.</Alert.Description>
              <Alert.Footer>
                <Alert.Action>Review changes</Alert.Action>
              </Alert.Footer>
            </Alert>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Alert.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Alert.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
