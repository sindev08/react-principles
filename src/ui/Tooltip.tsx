import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type TooltipSide = "top" | "bottom" | "left" | "right";

interface TooltipContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: TooltipSide;
}

const TooltipContext = createContext<TooltipContextValue | null>(null);

function useTooltipContext() {
  const context = useContext(TooltipContext);
  if (!context) throw new Error("Tooltip sub-components must be used inside <Tooltip>");
  return context;
}

export interface TooltipProps {
  defaultOpen?: boolean;
  side?: TooltipSide;
  children: ReactNode;
  className?: string;
}

export interface TooltipTriggerProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface TooltipContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Tooltip({ defaultOpen = false, side = "top", children, className }: TooltipProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <TooltipContext.Provider value={{ open, setOpen, side }}>
      <span className={cn("relative inline-flex", className)}>{children}</span>
    </TooltipContext.Provider>
  );
}

Tooltip.Trigger = function TooltipTrigger({ children, className, ...props }: TooltipTriggerProps) {
  const { setOpen } = useTooltipContext();

  return (
    <span
      className={cn("inline-flex", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      {...props}
    >
      {children}
    </span>
  );
}

const SIDE_CLASSES: Record<TooltipSide, string> = {
  top: "bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2",
  bottom: "top-[calc(100%+8px)] left-1/2 -translate-x-1/2",
  left: "right-[calc(100%+8px)] top-1/2 -translate-y-1/2",
  right: "left-[calc(100%+8px)] top-1/2 -translate-y-1/2",
};

Tooltip.Content = function TooltipContent({ children, className, ...props }: TooltipContentProps) {
  const { open, side } = useTooltipContext();

  return (
    <div
      role="tooltip"
      className={cn(
        "pointer-events-none absolute z-50 rounded-md bg-slate-900 px-2.5 py-1.5 text-xs text-white shadow-lg transition-all",
        SIDE_CLASSES[side],
        open ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
