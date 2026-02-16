import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@react-principles/shared/utils";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/40",
  secondary:
    "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400/40",
  ghost:
    "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 focus-visible:ring-slate-400/40",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 focus-visible:ring-red-500/40",
  outline:
    "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 focus-visible:ring-slate-400/40",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "text-xs px-3 py-1.5 h-7 gap-1.5",
  md: "text-sm px-4 py-2 h-9 gap-2",
  lg: "text-base px-6 py-2.5 h-11 gap-2",
};

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all",
        "focus-visible:outline-none focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      )}
    >
      {isLoading && <Spinner />}
      {children}
    </button>
  );
}
