"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/utils/cn";

export type SwitchSize = "sm" | "md" | "lg";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: SwitchSize;
  label?: string;
  description?: string;
  className?: string;
}

const TRACK_SIZES: Record<SwitchSize, string> = {
  sm: "h-5 w-9",
  md: "h-6 w-11",
  lg: "h-7 w-14",
};

const THUMB_SIZES: Record<SwitchSize, string> = {
  sm: "h-4 w-4 data-[checked=true]:translate-x-4",
  md: "h-5 w-5 data-[checked=true]:translate-x-5",
  lg: "h-6 w-6 data-[checked=true]:translate-x-7",
};

export function Switch({
  checked,
  defaultChecked = false,
  onChange,
  disabled = false,
  size = "md",
  label,
  description,
  className,
}: SwitchProps) {
  const [internal, setInternal] = useState(defaultChecked);
  const isControlled = checked !== undefined;
  const isOn = isControlled ? checked : internal;

  const stateLabel = useMemo(() => (isOn ? "enabled" : "disabled"), [isOn]);

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onChange?.(next);
  };

  return (
    <div className={cn("inline-flex items-start gap-3", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        aria-label={label ?? "Switch"}
        aria-disabled={disabled}
        data-state={isOn ? "checked" : "unchecked"}
        onClick={toggle}
        className={cn(
          "relative shrink-0 rounded-full p-0.5 transition-all outline-hidden",
          "focus-visible:ring-2 focus-visible:ring-primary/40",
          TRACK_SIZES[size],
          isOn ? "bg-primary" : "bg-slate-300 dark:bg-slate-700",
          disabled && "cursor-not-allowed opacity-50"
        )}
      >
        <span
          data-checked={isOn}
          className={cn(
            "block rounded-full bg-white shadow-sm transition-transform duration-200",
            THUMB_SIZES[size]
          )}
        />
      </button>

      {(label ?? description) && (
        <div className="min-w-0">
          {label && <p className="text-sm font-medium text-slate-900 dark:text-white">{label}</p>}
          {description && (
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              {description} ({stateLabel})
            </p>
          )}
        </div>
      )}
    </div>
  );
}
