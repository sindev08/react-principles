"use client";

import { createContext, useContext, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetSize = "sm" | "md" | "lg" | "xl" | "full" | "content";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: SheetSide;
  size?: SheetSize;
  children: ReactNode;
  className?: string;
}

export interface SheetTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface SheetContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface SheetHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface SheetTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface SheetDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface SheetFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface SheetCloseProps extends HTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet sub-components must be used inside <Sheet>");
  }
  return context;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WIDTH_CLASSES: Record<SheetSize, string> = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[512px]",
  xl: "w-[576px]",
  full: "w-full",
  content: "w-auto",
};

const HEIGHT_CLASSES: Record<SheetSize, string> = {
  sm: "h-[50vh]",
  md: "h-[70vh]",
  lg: "h-[85vh]",
  xl: "h-[90vh]",
  full: "h-full",
  content: "h-auto",
};

const SIDE_CLASSES: Record<SheetSide, { panel: string; hidden: string }> = {
  right: { panel: "right-0 inset-y-0", hidden: "translate-x-full" },
  left: { panel: "left-0 inset-y-0", hidden: "-translate-x-full" },
  top: { panel: "top-0 inset-x-0", hidden: "-translate-y-full" },
  bottom: { panel: "bottom-0 inset-x-0", hidden: "translate-y-full" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

Sheet.Trigger = function SheetTrigger({ children, className, ...props }: SheetTriggerProps) {
  const { open, onOpenChange } = useSheetContext();

  return (
    <button
      type="button"
      onClick={() => onOpenChange(!open)}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
        "bg-primary text-white hover:bg-primary/90",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Sheet.Content = function SheetContent({ children, className, ...props }: SheetContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
};

Sheet.Header = function SheetHeader({ children, className, ...props }: SheetHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-slate-100 dark:border-[#1f2937]", className)} {...props}>
      {children}
    </div>
  );
};

Sheet.Title = function SheetTitle({ children, className, ...props }: SheetTitleProps) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-white pr-8", className)} {...props}>
      {children}
    </h2>
  );
};

Sheet.Description = function SheetDescription({ children, className, ...props }: SheetDescriptionProps) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
};

Sheet.Footer = function SheetFooter({ children, className, ...props }: SheetFooterProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-100 dark:border-[#1f2937] flex items-center justify-end gap-3 shrink-0", className)} {...props}>
      {children}
    </div>
  );
};

Sheet.Close = function SheetClose({ children, className, ...props }: SheetCloseProps) {
  const { onOpenChange } = useSheetContext();

  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
        "bg-slate-100 dark:bg-[#1f2937] text-slate-900 dark:text-white",
        "hover:bg-slate-200 dark:hover:bg-[#161b22]",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        "transition-colors",
        className
      )}
      {...props}
    >
      {children || "Close"}
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function Sheet({ open, onOpenChange, side = "right", size = "md", children, className }: SheetProps) {
  const { mounted, visible } = useAnimatedMount(open, 300);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!mounted) return null;

  const { panel, hidden } = SIDE_CLASSES[side];

  const sheet = (
    <SheetContext.Provider value={{ open, onOpenChange }}>
      <div className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300",
            visible ? "opacity-100" : "opacity-0"
          )}
          onClick={() => onOpenChange(false)}
        />

        {/* Panel */}
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "absolute flex flex-col bg-white dark:bg-[#161b22]",
            "border-slate-200 dark:border-[#1f2937]",
            side === "right" && "border-l",
            side === "left" && "border-r",
            side === "top" && "border-b",
            side === "bottom" && "border-t",
            "shadow-2xl shadow-black/20",
            "transition-transform duration-300 ease-in-out",
            // For top/bottom: size controls height, width is full
            // For left/right: size controls width, height is full
            side === "top" || side === "bottom"
              ? `w-full ${HEIGHT_CLASSES[size]}`
              : `h-full ${WIDTH_CLASSES[size]}`,
            panel,
            visible ? "translate-x-0 translate-y-0" : hidden,
            className
          )}
        >
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            aria-label="Close sheet"
          >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {children}
        </div>
      </div>
    </SheetContext.Provider>
  );

  return createPortal(sheet, document.body);
}
