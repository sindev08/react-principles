import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type SeparatorOrientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: SeparatorOrientation;
  decorative?: boolean;
}

function SeparatorRoot({
  orientation = "horizontal",
  decorative = true,
  className,
  ...props
}: SeparatorProps) {
  return (
    <div
      role={decorative ? "presentation" : "separator"}
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-slate-200 dark:bg-[#1f2937]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  );
}

type SeparatorCompoundComponent = typeof SeparatorRoot & {
  Root: typeof SeparatorRoot;
};

export const Separator = Object.assign(SeparatorRoot, {
  Root: SeparatorRoot,
}) as SeparatorCompoundComponent;
