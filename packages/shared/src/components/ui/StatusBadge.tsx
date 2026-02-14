import { cn } from "../../utils/cn";

type DotColor = "green" | "blue" | "red" | "yellow";

interface StatusBadgeProps {
  label: string;
  color?: DotColor;
  className?: string;
}

const DOT_COLORS: Record<DotColor, string> = {
  green: "bg-green-500",
  blue: "bg-blue-500",
  red: "bg-red-500",
  yellow: "bg-yellow-500",
};

export function StatusBadge({
  label,
  color = "green",
  className,
}: StatusBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center h-10 gap-2 px-4 text-sm font-medium border rounded-lg",
        "bg-white border-slate-200 text-slate-700",
        "dark:bg-slate-900 dark:border-white/5 dark:text-slate-300",
        className,
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", DOT_COLORS[color])} />
      {label}
    </div>
  );
}
