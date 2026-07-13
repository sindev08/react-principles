"use client";

import type { ButtonHTMLAttributes } from "react";
import { useCopyToClipboard } from "@/shared/hooks";
import { cn } from "@/shared/utils/cn";

type CopyButtonVariant = "icon" | "labeled";

interface CopyButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick"> {
  /** Text copied to the clipboard when the button is pressed. */
  text: string;
  /** `icon` = glyph only; `labeled` = glyph + text. Defaults to "icon". */
  variant?: CopyButtonVariant;
  /** Accessible label / button text before copying. Defaults to "Copy". */
  label?: string;
  /** Button text / tooltip after copying. Defaults to "Copied". */
  copiedLabel?: string;
  /** Material Symbols glyph shown before copying. Defaults to "content_copy". */
  icon?: string;
  /** Material Symbols glyph shown after copying. Defaults to "check". */
  copiedIcon?: string;
  /**
   * Icon size in px. Applied via inline style because the Material
   * Symbols font hard-sets 24px and overrides Tailwind `text-[..]`.
   */
  iconSize?: number;
  /** Floating "Copied!" tooltip (icon variant only). Off by default. */
  showTooltip?: boolean;
  /** Extra classes applied while in the copied state. */
  copiedClassName?: string;
}

/**
 * The single copy-to-clipboard affordance for the whole app. Built on
 * {@link useCopyToClipboard}: the glyph always swaps to a check on
 * success (never clipped), with an optional floating tooltip for the
 * icon variant. Presentation is driven entirely through `className`.
 */
export function CopyButton({
  text,
  variant = "icon",
  label = "Copy",
  copiedLabel = "Copied",
  icon = "content_copy",
  copiedIcon = "check",
  iconSize = variant === "icon" ? 15 : 16,
  showTooltip = false,
  className,
  copiedClassName,
  ...props
}: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  const glyph = (
    <span
      className="material-symbols-outlined leading-none"
      style={{ fontSize: `${iconSize}px` }}
      aria-hidden
    >
      {copied ? copiedIcon : icon}
    </span>
  );

  const button = (
    <button
      type="button"
      onClick={() => void copy(text)}
      aria-label={variant === "icon" ? (copied ? copiedLabel : label) : undefined}
      title={variant === "icon" ? label : undefined}
      className={cn(
        variant === "icon"
          ? "inline-flex shrink-0 items-center justify-center rounded-md p-0.5 transition-colors text-slate-400 hover:bg-slate-500/10 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          : "inline-flex items-center gap-1.5 transition-colors",
        className,
        copied && (copiedClassName ?? (variant === "icon" ? "text-green-500" : undefined)),
      )}
      {...props}
    >
      {glyph}
      {variant === "labeled" && (copied ? copiedLabel : label)}
    </button>
  );

  if (variant === "icon" && showTooltip) {
    return (
      <span className="relative inline-flex">
        {copied && (
          <span
            role="status"
            className="animate-fade-in pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[11px] font-medium text-white shadow-lg dark:bg-slate-700"
          >
            {copiedLabel}
            <span className="absolute left-1/2 top-full h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-slate-900 dark:bg-slate-700" />
          </span>
        )}
        {button}
      </span>
    );
  }

  return button;
}
