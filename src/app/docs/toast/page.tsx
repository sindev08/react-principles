"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import { Toast } from "@/ui/Toast";
import type { ToastPosition, ToastVariant } from "@/ui/Toast";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const VARIANTS: { variant: ToastVariant; label: string; title: string; description: string }[] = [
  {
    variant: "default",
    label: "Default",
    title: "Draft saved",
    description: "Your local changes were stored automatically.",
  },
  {
    variant: "success",
    label: "Success",
    title: "Published successfully",
    description: "Your latest release is now visible to your team.",
  },
  {
    variant: "warning",
    label: "Warning",
    title: "Action required",
    description: "Reconnect your integration to keep sync running.",
  },
  {
    variant: "error",
    label: "Error",
    title: "Upload failed",
    description: "The file could not be processed. Try again in a moment.",
  },
];

const FORCED_SURFACE: Record<"light" | "dark", Record<ToastVariant, string>> = {
  light: {
    default: "border-slate-200 bg-white",
    success: "border-green-300 bg-green-50",
    warning: "border-amber-300 bg-amber-50",
    error: "border-red-300 bg-red-50",
  },
  dark: {
    default: "border-[#1f2937] bg-[#161b22]",
    success: "border-green-900 bg-green-950/30",
    warning: "border-amber-900 bg-amber-950/30",
    error: "border-red-900 bg-red-950/30",
  },
};

const CODE_SNIPPET = `import { Toast } from "@/ui/Toast";

<Toast open={open} onOpenChange={setOpen} variant="success">
  <Toast.Title>Saved successfully</Toast.Title>
  <Toast.Description>Your profile changes are now live.</Toast.Description>
  <Toast.Footer>
    <Toast.Close>Dismiss</Toast.Close>
  </Toast.Footer>
</Toast>`;

const COPY_PASTE_SNIPPET = `"use client";

import { createContext, useContext, useEffect, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAnimatedMount } from "@/hooks/use-animated-mount";
import { cn } from "@/lib/utils";

export type ToastVariant = "default" | "success" | "warning" | "error";
export type ToastPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

interface ToastContextValue {
  onClose: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("Toast sub-components must be used inside <Toast>");
  return context;
}

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration?: number;
  variant?: ToastVariant;
  position?: ToastPosition;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  default: "border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#161b22]",
  success: "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
  warning: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  error: "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-right": "right-4 top-4",
  "bottom-right": "right-4 bottom-4",
  "top-left": "left-4 top-4",
  "bottom-left": "left-4 bottom-4",
};

export function Toast({
  open,
  onOpenChange,
  duration = 3000,
  variant = "default",
  position = "top-right",
  children,
  className,
}: ToastProps) {
  const { mounted, visible } = useAnimatedMount(open, 180);

  useEffect(() => {
    if (!open || duration <= 0) return;
    const timeout = setTimeout(() => onOpenChange(false), duration);
    return () => clearTimeout(timeout);
  }, [open, duration, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <ToastContext.Provider value={{ onClose: () => onOpenChange(false) }}>
      <div className={cn("fixed z-[70] w-full max-w-sm", POSITION_CLASSES[position])}>
        <div
          role="status"
          className={cn(
            "rounded-xl border p-4 shadow-xl transition-all",
            VARIANT_CLASSES[variant],
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            className
          )}
        >
          {children}
        </div>
      </div>
    </ToastContext.Provider>,
    document.body
  );
}`;

const PROPS_ROWS = [
  { prop: "open", type: "boolean", default: "—", description: "Controls whether the toast is mounted and visible." },
  { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", description: "Called when auto-dismiss, Escape, or close actions change visibility." },
  { prop: "variant", type: '"default" | "success" | "warning" | "error"', default: '"default"', description: "Changes the semantic surface colors of the toast." },
  { prop: "position", type: '"top-right" | "bottom-right" | "top-left" | "bottom-left"', default: '"top-right"', description: "Places the portal-mounted toast in one of four screen corners." },
  { prop: "duration", type: "number", default: "3000", description: "Auto-dismiss delay in milliseconds. Use 0 or less to disable auto close." },
  { prop: "className", type: "string", default: "—", description: "Additional classes applied to the toast surface." },
];

function ThemedToastPanel({ theme }: { theme: "light" | "dark" }) {
  const dark = theme === "dark";
  const shell = dark ? "border-[#1f2937] bg-[#0d1117]" : "border-slate-200 bg-slate-50";
  const text = dark ? "text-slate-400" : "text-slate-500";

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${shell}`}>
      {VARIANTS.map(({ variant, title, description }) => (
        <div key={variant} className={`rounded-xl border p-4 shadow-sm ${FORCED_SURFACE[theme][variant]}`}>
          <p className={`text-sm font-semibold ${dark ? "text-white" : "text-slate-900"}`}>{title}</p>
          <p className={`mt-1 text-xs ${text}`}>{description}</p>
          <div className="mt-3 flex justify-end">
            <span className={`text-xs font-medium ${text}`}>Dismiss</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ToastDocPage() {
  const [openStates, setOpenStates] = useState<Record<ToastVariant, boolean>>({
    default: false,
    success: false,
    warning: false,
    error: false,
  });

  const updateToast = (variant: ToastVariant, next: boolean) => {
    setOpenStates((current) => ({ ...current, [variant]: next }));
  };

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Overlay</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Toast</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Toast
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Lightweight notification surface for async feedback, confirmations, and background
            status updates. It supports four semantic variants, animated entry and exit, and portal
            rendering for reliable stacking.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode", "4 Variants", "Animated", "Portal"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="toast" />

        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            All four variants are shown in forced light and dark surfaces so the semantic color
            differences remain visible regardless of the current app theme.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedToastPanel theme="light" />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedToastPanel theme="dark" />
            </div>
          </div>
        </section>

        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Each trigger opens a dedicated toast variant. Watch the viewport corners to see the
              portal-mounted notification appear and dismiss.
            </p>
            <div className="flex flex-wrap gap-3">
              {VARIANTS.map(({ variant, label, title, description }, index) => {
                const position: ToastPosition = index % 2 === 0 ? "top-right" : "bottom-right";

                return (
                  <div key={variant}>
                    <Button variant={variant === "error" ? "destructive" : variant === "warning" ? "outline" : variant === "success" ? "primary" : "secondary"} onClick={() => updateToast(variant, true)}>
                      Show {label}
                    </Button>
                    <Toast
                      open={openStates[variant]}
                      onOpenChange={(next) => updateToast(variant, next)}
                      variant={variant}
                      position={position}
                    >
                      <Toast.Title>{title}</Toast.Title>
                      <Toast.Description>{description}</Toast.Description>
                      <Toast.Footer>
                        {variant === "warning" ? <Toast.Action>Reconnect</Toast.Action> : null}
                        <Toast.Close>Dismiss</Toast.Close>
                      </Toast.Footer>
                    </Toast>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Toast.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Copy-Paste (Single File)
            </h2>
          </div>
          <CodeBlock filename="Toast.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">
                        {row.type}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code>
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
