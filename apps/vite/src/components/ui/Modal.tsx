import { useEffect, useRef, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@react-principles/shared/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ModalSide = "right" | "left";
export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  side?: ModalSide;
  size?: ModalSize;
  children: ReactNode;
  className?: string;
}

export interface ModalHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface ModalDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface ModalContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ModalFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[32rem]",
  full: "w-full",
};

const SIDE_CLASSES: Record<ModalSide, { panel: string; enter: string }> = {
  right: { panel: "right-0 inset-y-0", enter: "translate-x-full" },
  left: { panel: "left-0 inset-y-0", enter: "-translate-x-full" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

export function ModalHeader({ children, className, ...props }: ModalHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-slate-100 dark:border-[#1f2937]", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalTitle({ children, className, ...props }: ModalTitleProps) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-white pr-8", className)} {...props}>
      {children}
    </h2>
  );
}

export function ModalDescription({ children, className, ...props }: ModalDescriptionProps) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function ModalContent({ children, className, ...props }: ModalContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function ModalFooter({ children, className, ...props }: ModalFooterProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-100 dark:border-[#1f2937] flex items-center justify-end gap-3 shrink-0", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({ open, onClose, side = "right", size = "md", children, className }: ModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

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

  if (!open) return null;

  const { panel, enter } = SIDE_CLASSES[side];

  const drawer = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute flex flex-col h-full bg-white dark:bg-[#161b22]",
          "border-slate-200 dark:border-[#1f2937]",
          side === "right" ? "border-l" : "border-r",
          "shadow-2xl shadow-black/20",
          enter,
          SIZE_CLASSES[size],
          panel,
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close modal"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
