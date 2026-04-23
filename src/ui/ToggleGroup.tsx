import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";
import type { ToggleSize, ToggleVariant } from "./Toggle";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToggleGroupType = "single" | "multiple";

export interface ToggleGroupProps extends HTMLAttributes<HTMLDivElement> {
  type?: ToggleGroupType;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children: ReactNode;
}

export interface ToggleGroupItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  children: ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToggleGroupContextValue {
  value: string;
  variant: ToggleVariant;
  size: ToggleSize;
  type: ToggleGroupType;
  disabled: boolean;
  onItemChange: (itemValue: string) => void;
}

const ToggleGroupContext = createContext<ToggleGroupContextValue | null>(null);

function useToggleGroupContext() {
  const ctx = useContext(ToggleGroupContext);
  if (!ctx) {
    throw new Error("ToggleGroupItem must be used inside <ToggleGroup>");
  }
  return ctx;
}

// ─── Style Maps ───────────────────────────────────────────────────────────────

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

// ─── Helper ───────────────────────────────────────────────────────────────────

function parseValue(val: string): string[] {
  if (!val) return [];
  return val.split(",");
}

function serializeValue(arr: string[]): string {
  return arr.join(",");
}

// ─── ToggleGroup ──────────────────────────────────────────────────────────────

export function ToggleGroup({
  type = "single",
  value,
  defaultValue = "",
  onValueChange,
  variant = "default",
  size = "md",
  disabled = false,
  children,
  className,
  ...props
}: ToggleGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const onItemChange = useCallback(
    (itemValue: string) => {
      if (type === "single") {
        const current = parseValue(active);
        const next = current.includes(itemValue) && current.length === 1
          ? ""
          : itemValue;
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      } else {
        const current = parseValue(active);
        const next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
        const serialized = serializeValue(next);
        if (!isControlled) setInternalValue(serialized);
        onValueChange?.(serialized);
      }
    },
    [type, active, isControlled, onValueChange]
  );

  return (
    <ToggleGroupContext.Provider
      value={{ value: active, variant, size, type, disabled, onItemChange }}
    >
      <div
        role="group"
        className={cn("inline-flex items-center", className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  );
}

// ─── ToggleGroupItem ─────────────────────────────────────────────────────────

ToggleGroup.Item = function ToggleGroupItem({
  value: itemValue,
  disabled: itemDisabled = false,
  children,
  className,
  onClick,
  ...props
}: ToggleGroupItemProps) {
  const { value, variant, size, disabled: groupDisabled, onItemChange } =
    useToggleGroupContext();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isActive = parseValue(value).includes(itemValue);
  const isDisabled = groupDisabled || itemDisabled;

  // Arrow key navigation between siblings
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const group = buttonRef.current?.parentElement;
    if (!group) return;

    const items = Array.from(
      group.querySelectorAll<HTMLButtonElement>("[data-toggle-group-item]:not([disabled])")
    );
    const currentEl = buttonRef.current;
    const currentIndex = currentEl ? items.indexOf(currentEl) : -1;

    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = items.length - 1;
    }

    if (nextIndex !== currentIndex) {
      items[nextIndex]?.focus();
    }
  };

  const handleClick = () => {
    if (isDisabled) return;
    onItemChange(itemValue);
  };

  const stateClasses = isActive
    ? VARIANT_CLASSES[variant].on
    : VARIANT_CLASSES[variant].off;

  return (
    <button
      ref={buttonRef}
      type="button"
      data-toggle-group-item
      aria-pressed={isActive}
      disabled={isDisabled}
      onClick={(e) => {
        onClick?.(e);
        handleClick();
      }}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        stateClasses,
        SIZE_CLASSES[size],
        // Connected group styling: collapse borders between items
        "first:rounded-l-lg first:rounded-r-none last:rounded-r-lg last:rounded-l-none",
        "not-first:-ml-px",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
