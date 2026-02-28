"use client";

import { useEffect, useRef, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DialogSize = "sm" | "md" | "lg" | "xl";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  size?: DialogSize;
  children: ReactNode;
  className?: string;
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface DialogDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<DialogSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export function DialogHeader({ children, className, ...props }: DialogHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, className, ...props }: DialogTitleProps) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-white pr-8", className)} {...props}>
      {children}
    </h2>
  );
}

export function DialogDescription({ children, className, ...props }: DialogDescriptionProps) {
  return (
    <p className={cn("mt-1.5 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function DialogContent({ children, className, ...props }: DialogContentProps) {
  return (
    <div className={cn("px-6 py-2", className)} {...props}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className, ...props }: DialogFooterProps) {
  return (
    <div className={cn("px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-[#1f2937]", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Dialog ───────────────────────────────────────────────────────────────────

export function Dialog({ open, onClose, size = "md", children, className }: DialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const { mounted, visible } = useAnimatedMount(open, 200);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const panel = (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-200",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-2xl bg-white dark:bg-[#161b22] shadow-2xl shadow-black/20",
          "border border-slate-200 dark:border-[#1f2937]",
          "transition-all duration-200",
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95",
          SIZE_CLASSES[size],
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close dialog"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );

  return createPortal(panel, document.body);
}
