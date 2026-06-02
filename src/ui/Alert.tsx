import { createContext, useContext } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type AlertVariant = "default" | "success" | "warning" | "error" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const AlertContext = createContext<AlertVariant>("default");

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  default: "border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#161b22]",
  success: "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
  warning: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  error: "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
  info: "border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
};

const TITLE_CLASSES: Record<AlertVariant, string> = {
  default: "text-slate-900 dark:text-white",
  success: "text-green-900 dark:text-white",
  warning: "text-amber-900 dark:text-white",
  error: "text-red-900 dark:text-white",
  info: "text-blue-900 dark:text-white",
};

const DESC_CLASSES: Record<AlertVariant, string> = {
  default: "text-slate-600 dark:text-slate-400",
  success: "text-green-700 dark:text-slate-400",
  warning: "text-amber-700 dark:text-slate-400",
  error: "text-red-700 dark:text-slate-400",
  info: "text-blue-700 dark:text-slate-400",
};

export function Alert({ variant = "default", className, ...props }: AlertProps) {
  return (
    <AlertContext.Provider value={variant}>
      <div
        role="alert"
        className={cn("rounded-xl border p-4", VARIANT_CLASSES[variant], className)}
        {...props}
      />
    </AlertContext.Provider>
  );
}

Alert.Title = function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  const variant = useContext(AlertContext);
  return (
    <h4
      className={cn("text-sm font-semibold", TITLE_CLASSES[variant], className)}
      {...props}
    />
  );
}

Alert.Description = function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  const variant = useContext(AlertContext);
  return (
    <p
      className={cn("mt-1 text-xs leading-relaxed", DESC_CLASSES[variant], className)}
      {...props}
    />
  );
}

Alert.Footer = function AlertFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mt-3 flex items-center gap-2", className)}
      {...props}
    />
  );
}

Alert.Action = function AlertAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}
