import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SpinnerSize = "sm" | "md" | "lg";
export type SpinnerVariant = "default" | "muted";

export interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<SpinnerSize, string> = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const VARIANT_CLASSES: Record<SpinnerVariant, string> = {
  default: "text-primary",
  muted: "text-slate-400 dark:text-slate-600",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function Spinner({ size = "md", variant = "default", label }: SpinnerProps) {
  return (
    <div role="status" aria-live="polite" className="inline-flex">
      <svg
        aria-hidden="true"
        className={cn("animate-spin", SIZE_CLASSES[size], VARIANT_CLASSES[variant])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
      <span className="sr-only">{label || "Loading..."}</span>
    </div>
  );
}
