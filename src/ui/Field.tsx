import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactNode,
  type HTMLAttributes,
} from "react";
import { Label } from "./Label";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  id?: string;
  children: ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Field = forwardRef<HTMLDivElement, FieldProps>(function FieldRoot(
  {
    label,
    helperText,
    errorMessage,
    required,
    disabled,
    id,
    className,
    children,
    ...rest
  },
  ref
) {
  // Auto-generate ID from label if not provided
  const fieldId = id ?? (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);
  const descriptionId = fieldId ? `${fieldId}-description` : undefined;

  // Clone child element and inject accessibility props
  const childProps: Record<string, unknown> = {
    id: fieldId,
    "aria-describedby": descriptionId,
    "aria-invalid": !!errorMessage,
  };
  if (disabled !== undefined) {
    childProps.disabled = disabled;
  }

  const child = isValidElement(children)
    ? cloneElement(children as React.ReactElement<Record<string, unknown>>, childProps)
    : children;

  return (
    <div
      ref={ref}
      className={cn("flex flex-col gap-1.5", disabled && "opacity-50", className)}
      {...rest}
    >
      {label && (
        <Label htmlFor={fieldId} required={required} disabled={disabled}>
          {label}
        </Label>
      )}

      {child}

      {(helperText || errorMessage) && descriptionId && (
        <p
          id={descriptionId}
          className={cn(
            "text-xs",
            errorMessage
              ? "text-red-500 dark:text-red-400"
              : "text-slate-500 dark:text-slate-400"
          )}
        >
          {errorMessage || helperText}
        </p>
      )}
    </div>
  );
});
