"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertDialogVariant = "destructive" | "warning" | "default";

export interface AlertDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  variant?: AlertDialogVariant;
  isLoading?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CONFIRM_CLASSES: Record<AlertDialogVariant, string> = {
  destructive: "bg-red-500 hover:bg-red-600 text-white focus-visible:ring-red-400/40",
  warning: "bg-amber-500 hover:bg-amber-600 text-white focus-visible:ring-amber-400/40",
  default: "bg-primary hover:bg-primary/90 text-white focus-visible:ring-primary/40",
};

const ICON_BG: Record<AlertDialogVariant, string> = {
  destructive: "bg-red-100 dark:bg-red-900/30 text-red-500",
  warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-500",
  default: "bg-primary/10 text-primary",
};

// ─── Icons ────────────────────────────────────────────────────────────────────

function VariantIcon({ variant }: { variant: AlertDialogVariant }) {
  if (variant === "destructive") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <path d="M10 2a8 8 0 1 0 0 16A8 8 0 0 0 10 2zm0 5v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === "warning") {
    return (
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
        <path d="M8.485 3.495a1.75 1.75 0 0 1 3.03 0l6.28 10.875A1.75 1.75 0 0 1 16.28 17H3.72a1.75 1.75 0 0 1-1.515-2.63L8.485 3.495zM10 8v3m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return (
    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6v4m0 2.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2" />
      <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AlertDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  variant = "default",
  isLoading = false,
}: AlertDialogProps) {
  const { mounted, visible } = useAnimatedMount(open, 200);

  // Scroll lock only — no Escape dismiss (by design)
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!mounted) return null;

  const panel = (
    // Backdrop — clicking does NOT close (intentional)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-desc"
        className={cn(
          "relative w-full max-w-md rounded-2xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] shadow-2xl shadow-black/20",
          "transition-all duration-200",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="p-6">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className={cn("mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full", ICON_BG[variant])}>
              <VariantIcon variant={variant} />
            </div>
            <div className="flex-1 min-w-0">
              <h2 id="alert-title" className="text-base font-semibold text-slate-900 dark:text-white leading-snug">
                {title}
              </h2>
              <p id="alert-desc" className="mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#1f2937] hover:bg-slate-50 dark:hover:bg-[#1f2937] disabled:opacity-50 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-70 transition-colors focus-visible:outline-hidden focus-visible:ring-2",
              CONFIRM_CLASSES[variant]
            )}
          >
            {isLoading && <Spinner />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}