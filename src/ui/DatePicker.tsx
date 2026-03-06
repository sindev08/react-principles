import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
  error?: string;
}

const DatePickerRoot = forwardRef<HTMLInputElement, DatePickerProps>(function DatePickerRoot(
  { label, description, error, className, id, ...props },
  ref
) {
  const inputId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        type="date"
        className={cn(
          "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-hidden transition-all",
          "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
          "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20 dark:border-red-500"
        )}
        {...props}
      />
      {description && !error && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      {error && <p className="text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
});

type DatePickerCompoundComponent = typeof DatePickerRoot & {
  Root: typeof DatePickerRoot;
};

export const DatePicker = Object.assign(DatePickerRoot, {
  Root: DatePickerRoot,
}) as DatePickerCompoundComponent;
