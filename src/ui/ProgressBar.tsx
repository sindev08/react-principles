import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProgressBarProps {
  /** Current progress 0–100 */
  progress: number;
  /** Whether the bar is visible (false triggers fade-out) */
  visible: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Thin top-of-page progress bar for navigation feedback.
 * Pair with `useProgressBar` hook.
 */
export function ProgressBar({ progress, visible }: ProgressBarProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-200 h-0.5 bg-primary",
        // Glow effect matching the primary color
        "shadow-[0_0_8px_1px_rgba(70,40,241,0.7)]",
        "transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        width: `${progress}%`,
        // Instant reset to 0, ease-out for forward progress
        transition: `width ${progress === 0 ? "0ms" : progress === 100 ? "150ms" : "350ms"} ease-out, opacity 300ms`,
      }}
    />
  );
}
