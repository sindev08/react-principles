import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";
import type { ButtonProps } from "./Button";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonGroupOrientation = "horizontal" | "vertical";
export type ButtonGroupVariant = "default" | "outline";
export type ButtonGroupSize = "sm" | "md" | "lg";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  /** Layout direction of the button group. */
  orientation?: ButtonGroupOrientation;
  /** Variant applied to all child Buttons. "default" maps to primary, "outline" maps to outline. */
  variant?: ButtonGroupVariant;
  /** Size applied to all child Buttons. */
  size?: ButtonGroupSize;
  /** Disable all child Buttons. */
  disabled?: boolean;
  children: ReactNode;
}

// ─── Variant mapping ──────────────────────────────────────────────────────────

const VARIANT_MAP: Record<ButtonGroupVariant, ButtonProps["variant"]> = {
  default: "primary",
  outline: "outline",
};

// ─── Border-radius helpers ───────────────────────────────────────────────────

function getGroupedRadiusClass(
  index: number,
  total: number,
  isVertical: boolean,
): string {
  if (total <= 1) return "";

  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (isVertical) {
    if (isFirst) return "rounded-b-none";
    if (isLast) return "rounded-t-none";
    return "rounded-none";
  }

  if (isFirst) return "rounded-r-none";
  if (isLast) return "rounded-l-none";
  return "rounded-none";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ButtonGroup({
  orientation = "horizontal",
  variant = "default",
  size = "md",
  disabled = false,
  children,
  className,
  ...props
}: ButtonGroupProps) {
  const isVertical = orientation === "vertical";
  const mappedVariant = VARIANT_MAP[variant];
  const count = Children.count(children);

  return (
    <div
      role="group"
      className={cn(
        isVertical ? "inline-flex flex-col" : "inline-flex items-center",
        className,
      )}
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const childProps = child.props as Partial<ButtonProps>;
        const radiusClass = getGroupedRadiusClass(index, count, isVertical);
        const spacingClass = isVertical
          ? "not-first:-mt-px"
          : "not-first:-ml-px";

        return cloneElement(child as ReactElement<ButtonProps>, {
          variant: childProps.variant ?? mappedVariant,
          size: childProps.size ?? size,
          disabled: childProps.disabled ?? disabled,
          className: cn(radiusClass, spacingClass, childProps.className),
        });
      })}
    </div>
  );
}
