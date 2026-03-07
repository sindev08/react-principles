import { useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface SliderProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange?: (value: number) => void;
  label?: string;
  showValue?: boolean;
  className?: string;
}

function SliderRoot({
  value,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  onValueChange,
  label,
  showValue = true,
  className,
}: SliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const current = isControlled ? value : internalValue;

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between gap-3">
          {label && <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}
          {showValue && <span className="text-xs text-slate-500 dark:text-slate-400">{Math.round(current)}</span>}
        </div>
      )}

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={(event) => {
          const next = Number(event.target.value);
          if (!isControlled) setInternalValue(next);
          onValueChange?.(next);
        }}
        className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-primary dark:bg-[#1f2937]"
      />
    </div>
  );
}

type SliderCompoundComponent = typeof SliderRoot & {
  Root: typeof SliderRoot;
};

export const Slider = Object.assign(SliderRoot, {
  Root: SliderRoot,
}) as SliderCompoundComponent;
