import type { ReactNode } from "react";
import { cn } from "@react-principles/shared/utils";

export type BadgeVariant = "default" | "success" | "warning" | "error" | "info" | "outline";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  success: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  error: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  outline: "border border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "text-[10px] px-2 py-0.5",
  md: "text-xs px-2.5 py-0.5",
  lg: "text-sm px-3 py-1",
};

export function Badge({ variant = "default", size = "md", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {children}
    </span>
  );
}
