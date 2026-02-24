import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type CardVariant = "default" | "elevated" | "flat";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937]",
  elevated: "bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] shadow-lg shadow-slate-200/60 dark:shadow-black/30",
  flat: "bg-slate-50 dark:bg-[#0d1117] border border-transparent",
};

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl", CARD_VARIANT_CLASSES[variant], className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-bold text-slate-900 dark:text-white leading-snug", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pb-6 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}
