"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HoverCardSide = "top" | "right" | "bottom" | "left";
export type HoverCardAlign = "start" | "center" | "end";

export interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  side?: HoverCardSide;
  align?: HoverCardAlign;
  children: ReactNode;
  className?: string;
}

export interface HoverCardTriggerProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
  side: HoverCardSide;
  align: HoverCardAlign;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
  const context = useContext(HoverCardContext);
  if (!context) {
    throw new Error("HoverCard sub-components must be used inside <HoverCard>");
  }
  return context;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function HoverCard({
  open,
  defaultOpen = false,
  onOpenChange,
  openDelay = 700,
  closeDelay = 300,
  side = "bottom",
  align = "start",
  children,
  className,
}: HoverCardProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const containerRef = useRef<HTMLDivElement>(null);
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    if (isOpen) return;
    openTimerRef.current = setTimeout(() => {
      setOpen(true);
      openTimerRef.current = null;
    }, openDelay);
  }, [isOpen, openDelay, setOpen]);

  const handleMouseLeave = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    if (!isOpen) return;
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      closeTimerRef.current = null;
    }, closeDelay);
  }, [isOpen, closeDelay, setOpen]);

  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current);
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  return (
    <HoverCardContext.Provider value={{ open: isOpen, setOpen, openDelay, closeDelay, side, align }}>
      <div
        ref={containerRef}
        className={cn("relative inline-flex", className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

HoverCard.Trigger = function HoverCardTrigger({ children, className, ...props }: HoverCardTriggerProps) {
  return (
    <span className={cn("inline-flex", className)} {...props}>
      {children}
    </span>
  );
};

// ─── Content ──────────────────────────────────────────────────────────────────

const SIDE_CLASS: Record<HoverCardSide, string> = {
  top: "bottom-[calc(100%+8px)]",
  bottom: "top-[calc(100%+8px)]",
  left: "right-[calc(100%+8px)]",
  right: "left-[calc(100%+8px)]",
};

const ALIGN_CLASS: Record<HoverCardAlign, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

// For left/right sides, align maps to vertical alignment
const VERTICAL_ALIGN_CLASS: Record<HoverCardAlign, string> = {
  start: "top-0",
  center: "top-1/2 -translate-y-1/2",
  end: "bottom-0",
};

HoverCard.Content = function HoverCardContent({ children, className, ...props }: HoverCardContentProps) {
  const { open, side, align } = useHoverCardContext();

  if (!open) return null;

  const isHorizontal = side === "left" || side === "right";

  return (
    <div
      className={cn(
        "absolute z-50 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg",
        "dark:border-[#1f2937] dark:bg-[#161b22]",
        SIDE_CLASS[side],
        isHorizontal ? VERTICAL_ALIGN_CLASS[align] : ALIGN_CLASS[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
