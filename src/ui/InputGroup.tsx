import { forwardRef, type ReactNode, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type InputGroupSize = "sm" | "md" | "lg";
export type InputGroupVariant = "default" | "filled" | "ghost";

export interface InputGroupProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "prefix"> {
  label?: string;
  description?: string;
  error?: string;
  size?: InputGroupSize;
  variant?: InputGroupVariant;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<
  InputGroupSize,
  { input: string; label: string; prefix: string; suffix: string }
> = {
  sm: {
    input: "h-8 text-xs",
    label: "text-xs",
    prefix: "pl-3 pr-2 text-xs",
    suffix: "pl-2 pr-3 text-xs",
  },
  md: {
    input: "h-10 text-sm",
    label: "text-sm",
    prefix: "pl-3.5 pr-3 text-sm",
    suffix: "pl-3 pr-3.5 text-sm",
  },
  lg: {
    input: "h-12 text-base",
    label: "text-sm",
    prefix: "pl-4 pr-3 text-base",
    suffix: "pl-3 pr-4 text-base",
  },
};

const VARIANT_BASE: Record<InputGroupVariant, string> = {
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

export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  function InputGroupRoot(
    {
      label,
      description,
      error,
      size = "md",
      variant = "default",
      prefix,
      suffix,
      disabled,
      className,
      id,
      ...rest
    },
    ref
  ) {
    const s = SIZE_CLASSES[size];
    const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    // Calculate padding based on slots
    const getInputPadding = () => {
      if (prefix && suffix) return "p-0";
      if (prefix) return size === "sm" ? "pr-2" : size === "lg" ? "pr-3" : "pr-3";
      if (suffix) return size === "sm" ? "pl-2" : size === "lg" ? "pl-3" : "pl-3";
      return size === "sm" ? "px-3" : size === "lg" ? "px-4" : "px-3.5";
    };

    const inputPadding = cn(
      "bg-transparent outline-hidden border-0 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
      s.input,
      getInputPadding()
    );

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
          {prefix && (
            <span className={cn("flex shrink-0 items-center text-slate-500 dark:text-slate-400", s.prefix)}>
              {prefix}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(inputPadding, "w-full")}
            {...rest}
          />

          {suffix && (
            <span className={cn("flex shrink-0 items-center text-slate-500 dark:text-slate-400", s.suffix)}>
              {suffix}
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
  }
);
