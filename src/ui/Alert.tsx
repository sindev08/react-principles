import type { ButtonHTMLAttributes, HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type AlertVariant = "default" | "success" | "warning" | "error" | "info";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

const VARIANT_CLASSES: Record<AlertVariant, string> = {
  default: "border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#161b22]",
  success: "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
  warning: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  error: "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
  info: "border-blue-300 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/30",
};

export function Alert({ variant = "default", className, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      className={cn("rounded-xl border p-4", VARIANT_CLASSES[variant], className)}
      {...props}
    />
  );
}

Alert.Title = function AlertTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h4
      className={cn("text-sm font-semibold text-slate-900 dark:text-white", className)}
      {...props}
    />
  );
}

Alert.Description = function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400", className)}
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
