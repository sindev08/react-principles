import {
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Leading icon slot. */
  icon?: ReactNode;
  /** Primary text content. */
  label: string;
  /** Secondary text below the label. */
  description?: string;
  /** Trailing slot (badge, shortcut, action button). */
  trailing?: ReactNode;
  /** Active/selected state. */
  active?: boolean;
  /** Prevents interaction and reduces opacity. */
  disabled?: boolean;
}

// ─── Component ───────────────────────────────────────────────────────────────

export function Item({
  icon,
  label,
  description,
  trailing,
  active = false,
  disabled = false,
  className,
  ...props
}: ItemProps) {
  return (
    <div
      role="option"
      aria-selected={active || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        !disabled && "cursor-pointer",
        active && "bg-primary/10",
        !active && !disabled && "hover:bg-slate-100 dark:hover:bg-slate-800/50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 text-slate-500 dark:text-slate-400">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            active
              ? "text-primary"
              : "text-slate-900 dark:text-white",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span className="ml-auto shrink-0">{trailing}</span>
      )}
    </div>
  );
}
