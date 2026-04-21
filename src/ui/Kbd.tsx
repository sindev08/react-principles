import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type KbdSize = "sm" | "md";

export interface KbdProps extends HTMLAttributes<HTMLElement> {
  size?: KbdSize;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<KbdSize, string> = {
  sm: "text-[10px] px-1.5 py-0.5 font-medium",
  md: "text-xs px-2 py-1 font-medium",
};

const BASE_CLASSES =
  "inline-flex items-center justify-center " +
  "rounded-sm " +
  "border border-slate-200 dark:border-[#1f2937] " +
  "bg-white dark:bg-[#0d1117] " +
  "text-slate-700 dark:text-slate-300 " +
  "font-mono " +
  "transition-colors";

// ─── Component ────────────────────────────────────────────────────────────────

export const Kbd = forwardRef<HTMLElement, KbdProps>(
  function KbdRoot({ size = "md", className, children, ...rest }, ref) {
    return (
      <kbd
        ref={ref}
        className={cn(BASE_CLASSES, SIZE_CLASSES[size], className)}
        {...rest}
      >
        {children}
      </kbd>
    );
  }
);
