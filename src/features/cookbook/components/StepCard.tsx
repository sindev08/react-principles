import { cn } from "@/shared/utils/cn";

interface StepCardProps {
  step: string;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({ step, title, description, className }: StepCardProps) {
  return (
    <div
      className={cn(
        "p-6 border shadow-xs rounded-xl",
        "bg-white border-slate-200 dark:bg-slate-900 dark:border-white/5",
        className,
      )}
    >
      <div className="mb-4 text-xs font-black uppercase opacity-50 text-primary">
        {step}
      </div>
      <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
