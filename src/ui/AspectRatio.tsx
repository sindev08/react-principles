import { type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AspectRatioProps {
  ratio: number | string;
  children: ReactNode;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseRatio(ratio: number | string): string {
  if (typeof ratio === "number") {
    return `${ratio} / 1`;
  }
  // String format like "16/9" is valid CSS
  return ratio;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AspectRatio({ ratio, children, className }: AspectRatioProps) {
  const aspectRatio = parseRatio(ratio);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {children}
    </div>
  );
}
