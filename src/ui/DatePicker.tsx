"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/shared/utils/cn";
import { Calendar } from "./Calendar";
import type { CalendarMode, CalendarSelected } from "./Calendar";

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "defaultValue"
  > {
  label?: string;
  description?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  mode?: CalendarMode;
  placeholder?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function dateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePickerRoot(
    {
      label,
      description,
      error,
      value,
      defaultValue,
      onChange,
      mode = "single",
      placeholder = "Pick a date",
      disabled,
      className,
      id,
      ...props
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const containerRef = useRef<HTMLDivElement>(null);
    const calendarId = useId();

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const calendarSelected: CalendarSelected | undefined = currentValue
      ? toDate(currentValue)
      : undefined;

    const handleSelect = useCallback(
      (selected: CalendarSelected) => {
        let dateStr = "";

        if (mode === "single" && selected instanceof Date) {
          dateStr = dateToString(selected);
        } else if (
          mode === "range" &&
          selected !== null &&
          typeof selected === "object" &&
          "from" in selected
        ) {
          const range = selected as { from: Date; to?: Date };
          if (range.to) {
            dateStr = `${dateToString(range.from)} → ${dateToString(range.to)}`;
          } else {
            dateStr = dateToString(range.from);
          }
        } else if (mode === "multiple" && Array.isArray(selected)) {
          dateStr = selected.map(dateToString).join(", ");
        }

        if (!isControlled) setInternalValue(dateStr);
        onChange?.(dateStr);
        if (mode === "single") setOpen(false);
      },
      [mode, isControlled, onChange],
    );

    // Click outside to close
    useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: MouseEvent) => {
        if (
          !containerRef.current?.contains(event.target as Node)
        ) {
          setOpen(false);
        }
      };
      window.addEventListener("mousedown", onPointerDown);
      return () => window.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div ref={containerRef} className="relative">
          <button
            type="button"
            disabled={disabled}
            aria-expanded={open}
            aria-haspopup="dialog"
            aria-controls={calendarId}
            onClick={() => setOpen(!open)}
            className={cn(
              "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-900 outline-hidden transition-all",
              "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
              "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600",
              error &&
                "border-red-400 focus:border-red-400 focus:ring-red-400/20 dark:border-red-500",
              !currentValue && "text-slate-400 dark:text-slate-500",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              {currentValue ? formatDate(currentValue) : placeholder}
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                calendar_month
              </span>
            </span>
          </button>

          {/* Hidden input for form compatibility + ref forwarding */}
          <input
            ref={ref}
            id={inputId}
            type="hidden"
            value={currentValue}
            name={props.name}
            {...props}
          />

          {/* Calendar dropdown */}
          {open && (
            <div id={calendarId} className="absolute z-40 mt-2 left-0 w-full">
              <Calendar
                mode={mode}
                selected={calendarSelected}
                onSelect={handleSelect}
                className="w-full"
              />
            </div>
          )}
        </div>
        {description && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);
