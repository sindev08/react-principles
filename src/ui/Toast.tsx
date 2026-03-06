"use client";

import { createContext, useContext, useEffect, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";
import { cn } from "@/shared/utils/cn";

export type ToastVariant = "default" | "success" | "warning" | "error";
export type ToastPosition = "top-right" | "bottom-right" | "top-left" | "bottom-left";

interface ToastContextValue {
  onClose: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("Toast sub-components must be used inside <Toast.Root>");
  return context;
}

export interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duration?: number;
  variant?: ToastVariant;
  position?: ToastPosition;
  children: ReactNode;
  className?: string;
}

const VARIANT_CLASSES: Record<ToastVariant, string> = {
  default: "border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#161b22]",
  success: "border-green-300 bg-green-50 dark:border-green-900 dark:bg-green-950/30",
  warning: "border-amber-300 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30",
  error: "border-red-300 bg-red-50 dark:border-red-900 dark:bg-red-950/30",
};

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-right": "right-4 top-4",
  "bottom-right": "right-4 bottom-4",
  "top-left": "left-4 top-4",
  "bottom-left": "left-4 bottom-4",
};

function ToastRoot({
  open,
  onOpenChange,
  duration = 3000,
  variant = "default",
  position = "top-right",
  children,
  className,
}: ToastProps) {
  const { mounted, visible } = useAnimatedMount(open, 180);

  useEffect(() => {
    if (!open || duration <= 0) return;
    const timeout = setTimeout(() => onOpenChange(false), duration);
    return () => clearTimeout(timeout);
  }, [open, duration, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  if (!mounted) return null;

  return createPortal(
    <ToastContext.Provider value={{ onClose: () => onOpenChange(false) }}>
      <div className={cn("fixed z-[70] w-full max-w-sm", POSITION_CLASSES[position])}>
        <div
          role="status"
          className={cn(
            "rounded-xl border p-4 shadow-xl transition-all",
            VARIANT_CLASSES[variant],
            visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
            className
          )}
        >
          {children}
        </div>
      </div>
    </ToastContext.Provider>,
    document.body
  );
}

function ToastTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h4 className={cn("text-sm font-semibold text-slate-900 dark:text-white", className)} {...props} />;
}

function ToastDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-xs text-slate-600 dark:text-slate-400", className)} {...props} />;
}

function ToastAction({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn("rounded-md bg-primary px-2.5 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-90", className)}
      {...props}
    />
  );
}

function ToastClose({ className, onClick, children = "Dismiss", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { onClose } = useToastContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        onClose();
      }}
      className={cn("text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200", className)}
      {...props}
    >
      {children}
    </button>
  );
}

function ToastFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-3 flex items-center justify-end gap-2", className)} {...props} />;
}

type ToastCompoundComponent = typeof ToastRoot & {
  Root: typeof ToastRoot;
  Title: typeof ToastTitle;
  Description: typeof ToastDescription;
  Action: typeof ToastAction;
  Close: typeof ToastClose;
  Footer: typeof ToastFooter;
};

export const Toast = Object.assign(ToastRoot, {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Action: ToastAction,
  Close: ToastClose,
  Footer: ToastFooter,
}) as ToastCompoundComponent;

export { ToastTitle, ToastDescription, ToastAction, ToastClose, ToastFooter };
