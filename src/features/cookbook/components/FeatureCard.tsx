import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 transition-all border rounded-xl",
        "border-slate-100 bg-white hover:border-primary/20",
        "dark:border-white/5 dark:bg-slate-900/50 dark:hover:border-primary/40",
        className,
      )}
    >
      <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}
