import { forwardRef, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type TextareaSize = "sm" | "md" | "lg";
export type TextareaVariant = "default" | "filled" | "ghost";

export interface TextareaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  label?: string;
  description?: string;
  error?: string;
  size?: TextareaSize;
  variant?: TextareaVariant;
  children?: ReactNode;
}

const SIZE_CLASSES: Record<TextareaSize, string> = {
  sm: "min-h-20 px-3 py-2 text-xs",
  md: "min-h-24 px-3.5 py-2.5 text-sm",
  lg: "min-h-32 px-4 py-3 text-base",
};

const VARIANT_CLASSES: Record<TextareaVariant, string> = {
  default:
    "border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] hover:border-slate-300 dark:hover:border-slate-600",
  filled:
    "border border-transparent bg-slate-100 dark:bg-[#161b22] hover:bg-slate-200/80 dark:hover:bg-[#1f2937]",
  ghost:
    "border border-transparent bg-transparent hover:bg-slate-50 dark:hover:bg-[#161b22]",
};

const ERROR_CLASSES =
  "border-red-400 dark:border-red-500 focus-within:border-red-400 dark:focus-within:border-red-500 focus-within:ring-red-400/20";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function TextareaRoot(
  {
    label,
    description,
    error,
    size = "md",
    variant = "default",
    disabled,
    className,
    id,
    ...props
  },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn("text-sm font-medium text-slate-700 dark:text-slate-300", disabled && "opacity-50")}
        >
          {label}
        </label>
      )}

      <div
        className={cn(
          "rounded-lg transition-all focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary dark:focus-within:border-primary",
          VARIANT_CLASSES[variant],
          error && ERROR_CLASSES,
          disabled && "opacity-50"
        )}
      >
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={cn(
            "w-full resize-y rounded-lg bg-transparent outline-hidden",
            "text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500",
            SIZE_CLASSES[size]
          )}
          {...props}
        />
      </div>

      {description && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});
