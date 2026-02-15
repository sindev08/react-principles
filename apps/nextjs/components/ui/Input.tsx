import { forwardRef, InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@react-principles/shared/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputSize = "sm" | "md" | "lg";
export type InputVariant = "default" | "filled" | "ghost";

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<InputSize, { input: string; label: string; icon: string }> = {
  sm: { input: "h-8 px-3 text-xs", label: "text-xs", icon: "h-3.5 w-3.5" },
  md: { input: "h-10 px-3.5 text-sm", label: "text-sm", icon: "h-4 w-4" },
  lg: { input: "h-12 px-4 text-base", label: "text-sm", icon: "h-4.5 w-4.5" },
};

const VARIANT_BASE: Record<InputVariant, string> = {
  default:
    "border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] " +
    "hover:border-slate-300 dark:hover:border-slate-600 " +
    "focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
  filled:
    "border border-transparent bg-slate-100 dark:bg-[#161b22] " +
    "hover:bg-slate-150 dark:hover:bg-[#1f2937] " +
    "focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 focus-within:bg-white dark:focus-within:bg-[#0d1117]",
  ghost:
    "border border-transparent bg-transparent " +
    "hover:bg-slate-50 dark:hover:bg-[#161b22] " +
    "focus-within:border-primary dark:focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
};

const ERROR_OVERRIDE =
  "border-red-400 dark:border-red-500 focus-within:border-red-400 dark:focus-within:border-red-500 focus-within:ring-red-400/20";

// ─── Component ────────────────────────────────────────────────────────────────

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    description,
    error,
    size = "md",
    variant = "default",
    leadingIcon,
    trailingIcon,
    disabled,
    className,
    id,
    ...rest
  },
  ref
) {
  const s = SIZE_CLASSES[size];
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn(
            "font-medium text-slate-700 dark:text-slate-300",
            s.label,
            disabled && "opacity-50"
          )}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "relative flex items-center rounded-lg transition-all",
          VARIANT_BASE[variant],
          error && ERROR_OVERRIDE,
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
      >
        {leadingIcon && (
          <span className={cn("absolute left-3 flex shrink-0 items-center text-slate-400", s.icon)}>
            {leadingIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
            s.input,
            leadingIcon && (size === "sm" ? "pl-8" : size === "lg" ? "pl-10" : "pl-9"),
            trailingIcon && (size === "sm" ? "pr-8" : size === "lg" ? "pr-10" : "pr-9")
          )}
          {...rest}
        />

        {trailingIcon && (
          <span className={cn("absolute right-3 flex shrink-0 items-center text-slate-400", s.icon)}>
            {trailingIcon}
          </span>
        )}
      </div>

      {description && !error && (
        <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>
      )}
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
});
