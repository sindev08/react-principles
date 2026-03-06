import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

type PopoverSide = "top" | "bottom";
type PopoverAlign = "start" | "center" | "end";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: PopoverSide;
  align: PopoverAlign;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover sub-components must be used inside <Popover.Root>");
  return context;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverSide;
  align?: PopoverAlign;
  children: ReactNode;
  className?: string;
}

export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

function PopoverRoot({
  open,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "start",
  children,
  className,
}: PopoverProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const containerRef = useRef<HTMLDivElement>(null);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen) return;

    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setOpen]);

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, side, align }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

function PopoverTrigger({ children, className, onClick, ...props }: PopoverTriggerProps) {
  const { open, setOpen } = usePopoverContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-all",
        "hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-200 dark:hover:bg-[#161b22]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const SIDE_CLASS: Record<PopoverSide, string> = {
  top: "bottom-[calc(100%+8px)]",
  bottom: "top-[calc(100%+8px)]",
};

const ALIGN_CLASS: Record<PopoverAlign, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

function PopoverContent({ children, className, ...props }: PopoverContentProps) {
  const { open, side, align } = usePopoverContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-[#1f2937] dark:bg-[#161b22]",
        SIDE_CLASS[side],
        ALIGN_CLASS[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function PopoverClose({ children = "Close", className, onClick, ...props }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={cn("text-sm font-medium text-primary hover:underline", className)}
      {...props}
    >
      {children}
    </button>
  );
}

type PopoverCompoundComponent = typeof PopoverRoot & {
  Root: typeof PopoverRoot;
  Trigger: typeof PopoverTrigger;
  Content: typeof PopoverContent;
  Close: typeof PopoverClose;
};

export const Popover = Object.assign(PopoverRoot, {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
}) as PopoverCompoundComponent;

export { PopoverTrigger, PopoverContent, PopoverClose };
