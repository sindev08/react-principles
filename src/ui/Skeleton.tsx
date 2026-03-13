import { cn } from "@/shared/utils/cn";

export type SkeletonVariant = "line" | "rect" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
}

export function Skeleton({ variant = "line", width, height, className }: SkeletonProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block animate-pulse bg-slate-200 dark:bg-[#1f2937]",
        variant === "line" && "h-4 w-40 rounded-md",
        variant === "rect" && "h-24 w-full rounded-xl",
        variant === "circle" && "h-10 w-10 rounded-full",
        className
      )}
      style={{ width, height }}
    />
  );
}
