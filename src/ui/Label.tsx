import { forwardRef, type LabelHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  disabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Label = forwardRef<HTMLLabelElement, LabelProps>(function LabelRoot(
  { required, disabled, className, children, ...rest },
  ref
) {
  return (
    <label
      ref={ref}
      className={cn(
        "font-medium text-slate-700 dark:text-slate-300 text-sm",
        disabled && "opacity-50 cursor-not-allowed text-slate-400 dark:text-slate-500",
        className
      )}
      {...rest}
    >
      {children}
      {required && <span className="text-red-500 dark:text-red-400 ml-1">*</span>}
    </label>
  );
});
