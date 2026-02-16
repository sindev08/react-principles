import { useRef, useEffect } from "react";
import { cn } from "@react-principles/shared/utils";

export type CheckboxSize = "sm" | "md" | "lg";

export interface CheckboxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  size?: CheckboxSize;
  label?: string;
  description?: string;
  id?: string;
  name?: string;
  onChange?: (checked: boolean) => void;
  className?: string;
}

const BOX_SIZES: Record<CheckboxSize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

const ICON_SIZES: Record<CheckboxSize, string> = {
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
};

const LABEL_SIZES: Record<CheckboxSize, string> = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6h7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export function Checkbox({
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  size = "md",
  label,
  description,
  id,
  name,
  onChange,
  className,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const isChecked = checked ?? false;
  const isFilled = isChecked || indeterminate;

  return (
    <label
      className={cn(
        "inline-flex items-start gap-3",
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
        className,
      )}
    >
      <div className="relative mt-0.5 shrink-0">
        <input
          ref={inputRef}
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
          className="sr-only"
        />
        <div
          className={cn(
            "flex items-center justify-center rounded border-2 transition-all",
            BOX_SIZES[size],
            isFilled
              ? "bg-primary border-primary"
              : "bg-white dark:bg-[#0d1117] border-slate-300 dark:border-slate-600",
            !disabled && !isFilled && "hover:border-primary",
          )}
        >
          {isChecked && <CheckIcon className={cn("text-white", ICON_SIZES[size])} />}
          {indeterminate && !isChecked && <MinusIcon className={cn("text-white", ICON_SIZES[size])} />}
        </div>
      </div>

      {(label ?? description) && (
        <div className="min-w-0">
          {label && (
            <span className={cn("block font-medium text-slate-900 dark:text-white leading-tight", LABEL_SIZES[size])}>
              {label}
            </span>
          )}
          {description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      )}
    </label>
  );
}
