import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "p"
  | "lead"
  | "muted"
  | "small"
  | "blockquote"
  | "code"
  | "list";

export interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, "as"> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<TypographyVariant, string> = {
  h1: "text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl",
  h2: "text-2xl font-bold text-slate-900 dark:text-white",
  h3: "text-xl font-bold text-slate-900 dark:text-white",
  h4: "text-lg font-semibold text-slate-900 dark:text-white",
  p: "text-sm leading-relaxed text-slate-600 dark:text-slate-400",
  lead: "text-lg leading-relaxed text-slate-700 dark:text-slate-300",
  muted: "text-sm text-slate-500 dark:text-slate-400",
  small: "text-xs text-slate-500 dark:text-slate-400",
  blockquote: "border-l-4 border-primary pl-4 italic text-slate-700 dark:text-slate-300",
  code: "font-mono text-xs bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 rounded text-slate-900 dark:text-white",
  list: "list-disc pl-4 space-y-1 text-sm text-slate-600 dark:text-slate-400",
};

const DEFAULT_ELEMENTS: Record<TypographyVariant, string> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  p: "p",
  lead: "p",
  muted: "p",
  small: "small",
  blockquote: "blockquote",
  code: "code",
  list: "ul",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  function TypographyRoot({ variant = "p", as, className, children, ...rest }, ref) {
    const Component = as || DEFAULT_ELEMENTS[variant];
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <Component ref={ref} className={cn(variantStyle, className)} {...rest}>
        {children}
      </Component>
    );
  }
);
