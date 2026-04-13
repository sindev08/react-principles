import { cn } from "@/shared/utils/cn";

interface StepCardProps {
  step: string;
  stepNumber: string;
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function StepCard({ step, stepNumber, icon, title, description, className }: StepCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden p-6 rounded-xl border border-t-2",
        "border-t-primary border-slate-200 dark:border-white/5",
        "bg-white dark:bg-slate-900 shadow-xs",
        className,
      )}
    >
      {/* Watermark number */}
      <span className="absolute bottom-3 right-4 text-8xl font-black leading-none select-none text-primary/5">
        {stepNumber}
      </span>

      {/* Icon */}
      <span className="material-symbols-outlined text-primary text-[24px] mb-4 block">
        {icon}
      </span>

      {/* Step label */}
      <div className="mb-1 text-xs font-black uppercase text-primary opacity-60">
        {step}
      </div>

      <h3 className="mb-2 font-bold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </div>
  );
}
