import { createContext, useContext, useId, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export interface RadioGroupProps extends HTMLAttributes<HTMLDivElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  children: ReactNode;
}

export interface RadioGroupItemProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
  label?: string;
  description?: string;
}

interface RadioGroupContextValue {
  value: string;
  name: string;
  setValue: (value: string) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

function useRadioGroupContext() {
  const context = useContext(RadioGroupContext);
  if (!context) {
    throw new Error("RadioGroup sub-components must be used inside <RadioGroup>");
  }
  return context;
}

export function RadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  name,
  children,
  className,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const autoName = useId();
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <RadioGroupContext.Provider value={{ value: active, setValue, name: name ?? autoName }}>
      <div className={cn("space-y-2", className)} role="radiogroup" {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
}

RadioGroup.Item = function RadioGroupItem({
  value,
  disabled = false,
  label,
  description,
  children,
  className,
  ...props
}: RadioGroupItemProps) {
  const context = useRadioGroupContext();
  const checked = context.value === value;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && context.setValue(value)}
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-all",
        checked
          ? "border-primary bg-primary/5"
          : "border-slate-200 bg-white hover:border-slate-300 dark:border-[#1f2937] dark:bg-[#0d1117] dark:hover:border-slate-600",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      <span
        className={cn(
          "mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
          checked ? "border-primary" : "border-slate-400 dark:border-slate-500"
        )}
      >
        {checked && <span className="h-2 w-2 rounded-full bg-primary" />}
      </span>
      <span className="min-w-0 flex-1">
        {label && <span className="block text-sm font-medium text-slate-900 dark:text-white">{label}</span>}
        {description && <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{description}</span>}
        {children}
      </span>
      <input readOnly tabIndex={-1} type="radio" name={context.name} value={value} checked={checked} className="sr-only" />
    </button>
  );
}
