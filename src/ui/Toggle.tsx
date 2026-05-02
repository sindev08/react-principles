import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ToggleVariant, Record<"on" | "off", string>> = {
  default: {
    on: "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/40",
    off: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400/40",
  },
  outline: {
    on: "bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 focus-visible:ring-slate-400/40",
    off: "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 focus-visible:ring-slate-400/40",
  },
};

const SIZE_CLASSES: Record<ToggleSize, string> = {
  sm: "text-xs px-3 py-1.5 h-7 gap-1.5",
  md: "text-sm px-4 py-2 h-9 gap-2",
  lg: "text-base px-6 py-2.5 h-11 gap-2",
};

export function Toggle({
  pressed,
  defaultPressed = false,
  onPressedChange,
  variant = "default",
  size = "md",
  disabled = false,
  children,
  className,
  onClick,
  ...props
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const isOn = isControlled ? pressed : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  };

  const stateClasses = isOn
    ? VARIANT_CLASSES[variant].on
    : VARIANT_CLASSES[variant].off;

  return (
    <button
      type="button"
      aria-pressed={isOn}
      disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        toggle();
      }}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        stateClasses,
        SIZE_CLASSES[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
