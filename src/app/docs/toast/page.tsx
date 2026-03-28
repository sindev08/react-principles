"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import { Toast } from "@/ui/Toast";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Toast } from "@/components/ui/Toast";

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
}

Toast.Title = function ToastTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("text-sm font-semibold text-slate-900 dark:text-white", className)} {...props} />;
}

Toast.Description = function ToastDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-xs text-slate-600 dark:text-slate-400", className)} {...props} />;
}

Toast.Action = function ToastAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90", className)}
      {...props}
    />
  );
}

Toast.Close = function ToastClose({ className, onClick, children = "Dismiss", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onClose } = useToastContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        onClose();
      }}
      className={cn("text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200", className)}
      {...props}
    >
      {children}
    </button>
  );
}

Toast.Footer = function ToastFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-3 flex items-center justify-end gap-2", className)} {...props} />;
}`;

export default function ToastDocPage() {
  const [open, setOpen] = useState(false);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Toast</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Lightweight notification for async feedback and quick confirmations.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Button onClick={() => setOpen(true)}>Show success toast</Button>
            <Toast open={open} onOpenChange={setOpen} variant="success">
              <Toast.Title>Saved successfully</Toast.Title>
              <Toast.Description>Your profile changes are now live.</Toast.Description>
              <Toast.Footer>
                <Toast.Close>Dismiss</Toast.Close>
              </Toast.Footer>
            </Toast>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Toast.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Toast.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
