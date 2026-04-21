"use client";

import React, { useRef, useState, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResizableDirection = "horizontal" | "vertical";

export interface ResizableProps {
  direction: ResizableDirection;
  children: ReactNode;
  className?: string;
}

export interface ResizablePanelProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  children: ReactNode;
  className?: string;
}

export interface ResizableHandleProps {
  withHandle?: boolean;
  disabled?: boolean;
  className?: string;
}

// ─── Internal Props (passed via cloneElement) ───────────────────────────────

interface ResizablePanelInternalProps {
  index?: number;
  sizes?: number[];
  setSizes?: React.Dispatch<React.SetStateAction<number[]>>;
  containerRef?: React.RefObject<HTMLDivElement>;
  direction?: ResizableDirection;
  activeHandle?: number | null;
  setActiveHandle?: React.Dispatch<React.SetStateAction<number | null>>;
}

interface ResizableHandleInternalProps {
  index?: number;
  sizes?: number[];
  setSizes?: React.Dispatch<React.SetStateAction<number[]>>;
  containerRef?: React.RefObject<HTMLDivElement>;
  direction?: ResizableDirection;
  activeHandle?: number | null;
  setActiveHandle?: React.Dispatch<React.SetStateAction<number | null>>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Resizable({ direction, children, className }: ResizableProps) {
  const [sizes, setSizes] = useState<number[]>([]);
  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Count panels and assign indices to children
  let panelCount = 0;
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === Resizable.Panel) {
      const index = panelCount++;

      // Initialize size if not set
      if (sizes[index] === undefined) {
        setSizes((prev) => {
          const next = [...prev];
          next[index] = (child.props as ResizablePanelProps).defaultSize || 50;
          return next;
        });
      }

      return React.cloneElement(child, {
        index,
        sizes,
        setSizes,
        containerRef,
        direction,
        activeHandle,
        setActiveHandle,
      } as ResizablePanelInternalProps);
    }

    if (child.type === Resizable.Handle) {
      const handleIndex = panelCount - 1;

      return React.cloneElement(child, {
        index: handleIndex,
        sizes,
        setSizes,
        containerRef,
        direction,
        activeHandle,
        setActiveHandle,
      } as ResizableHandleInternalProps);
    }

    return child;
  });

  return (
    <div
      ref={containerRef}
      className={cn("flex", direction === "horizontal" ? "flex-row" : "flex-col", className)}
    >
      {childrenWithProps}
    </div>
  );
}

// ─── Panel Sub-Component ───────────────────────────────────────────────────────

Resizable.Panel = function ResizablePanel({
  defaultSize = 50,
  children,
  className,
  index,
  sizes,
}: ResizablePanelProps & ResizablePanelInternalProps) {
  const size = index !== undefined && sizes?.[index] !== undefined ? sizes[index] : defaultSize;

  return (
    <div
      className={cn("flex-shrink-0", className)}
      style={{
        flexBasis: `${size}%`,
        flexShrink: 0,
        minWidth: 0,
      }}
    >
      {children}
    </div>
  );
};

// ─── Handle Sub-Component ───────────────────────────────────────────────────────────

Resizable.Handle = function ResizableHandle({
  withHandle = false,
  disabled = false,
  className,
  index,
  sizes,
  setSizes,
  containerRef,
  activeHandle,
  setActiveHandle,
}: ResizableHandleProps & ResizableHandleInternalProps) {
  const direction = "horizontal"; // Hardcode for now
  const isHorizontal = direction === "horizontal";

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || index === undefined || !setActiveHandle) return;

    e.preventDefault();
    e.stopPropagation();

    const container = containerRef?.current;
    if (!container || !setSizes) return;

    const startX = e.clientX;
    const initialSizes = [...(sizes || [])];

    setActiveHandle(index);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = container.offsetWidth;
      if (containerWidth === 0) return;

      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;

      if (index === undefined) return;

      const initialPanelSize = initialSizes[index] || 50;
      const initialNextPanelSize = initialSizes[index + 1] || 50;

      let newPanelSize = initialPanelSize + deltaPercent;
      newPanelSize = Math.max(10, Math.min(90, newPanelSize));

      const actualDelta = newPanelSize - initialPanelSize;
      const newNextPanelSize = initialNextPanelSize - actualDelta;

      if (newNextPanelSize >= 10 && newNextPanelSize <= 90 && index + 1 < initialSizes.length) {
        setSizes((prev: number[]) => {
          const next = [...prev];
          next[index] = newPanelSize;
          next[index + 1] = newNextPanelSize;
          return next;
        });
      }
    };

    const handleMouseUp = () => {
      setActiveHandle?.(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      tabIndex={disabled ? -1 : 0}
      role="separator"
      aria-orientation={direction}
      className={cn(
        "flex-shrink-0 bg-slate-200 dark:bg-[#1f2937]",
        "transition-colors hover:bg-primary/20",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "select-none",
        !disabled && (isHorizontal ? "cursor-col-resize" : "cursor-row-resize"),
        isHorizontal ? "w-1" : "h-1",
        activeHandle === index && !disabled && "bg-primary",
        className
      )}
      onMouseDown={handleMouseDown}
    >
      {withHandle && (
        <div className={cn("flex items-center justify-center", isHorizontal ? "h-full w-4" : "w-full h-4")}>
          <div className={cn("bg-slate-400 dark:bg-slate-600 rounded-full", isHorizontal ? "w-1 h-8" : "w-8 h-1")} />
        </div>
      )}
    </div>
  );
};
