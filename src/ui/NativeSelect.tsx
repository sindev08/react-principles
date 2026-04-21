import { forwardRef, type SelectHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NativeSelectSize = "sm" | "md" | "lg";

export interface NativeSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface NativeSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: NativeSelectSize;
  options?: NativeSelectOption[];
  placeholder?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<NativeSelectSize, string> = {
  sm: "h-8 px-3 pr-9 text-xs",
  md: "h-10 px-3.5 pr-10 text-sm",
  lg: "h-12 px-4 pr-11 text-base",
};

const BASE_CLASSES =
  "appearance-none w-full rounded-lg border border-slate-200 dark:border-[#1f2937] " +
  "bg-white dark:bg-[#0d1117] " +
  "text-slate-900 dark:text-white " +
  "placeholder:text-slate-400 dark:placeholder:text-slate-500 " +
  "focus:border-primary dark:focus:border-primary " +
  "focus:outline-none " +
  "focus:ring-2 focus:ring-primary/20 " +
  "disabled:opacity-50 disabled:cursor-not-allowed " +
  "transition-colors";

const ERROR_CLASSES =
  "border-red-400 dark:border-red-500 " +
  "focus:border-red-400 dark:focus:border-red-500 " +
  "focus:ring-red-400/20";

// ─── Component ────────────────────────────────────────────────────────────────

export const NativeSelect = forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelectRoot(
    {
      label,
      description,
      error,
      size = "md",
      options,
      placeholder,
      disabled,
      className,
      id,
      children,
      ...rest
    },
    ref
  ) {
    const selectId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
    const descriptionId = id ? `${id}-description` : undefined;
    const errorId = id ? `${id}-error` : undefined;

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              "font-medium text-slate-700 dark:text-slate-300 text-sm",
              disabled && "opacity-50"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-describedby={error ? errorId : description ? descriptionId : undefined}
            aria-invalid={!!error}
            className={cn(
              BASE_CLASSES,
              SIZE_CLASSES[size],
              error && ERROR_CLASSES
            )}
            {...rest}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
            {children}
          </select>

          {/* Dropdown Icon */}
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 dark:text-slate-400"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {description && !error && (
          <p id={descriptionId} className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
        {error && (
          <p id={errorId} className="text-xs text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);
