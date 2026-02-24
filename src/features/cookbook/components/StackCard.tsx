import type { ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface StackCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className?: string;
}

export function StackCard({ icon, title, subtitle, className }: StackCardProps) {
  return (
    <div
      className={cn(
        "p-8 transition-all border rounded-xl hover:-translate-y-1 group",
        "bg-white border-slate-200 hover:border-primary/40 dark:bg-slate-900 dark:border-white/5 dark:hover:border-primary/40",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 mx-auto mb-4 transition-colors rounded-lg",
          "bg-slate-50 text-slate-400 group-hover:text-primary",
          "dark:bg-slate-800 dark:text-slate-500 dark:group-hover:text-primary",
        )}
      >
        {icon}
      </div>
      <p className="font-bold text-slate-900 dark:text-white">{title}</p>
      <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
    </div>
  );
}
