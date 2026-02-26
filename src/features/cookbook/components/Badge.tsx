import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface BadgeProps {
  children: ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 text-xs font-bold tracking-wider uppercase rounded-full bg-primary/10 text-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}
