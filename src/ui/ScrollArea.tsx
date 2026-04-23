"use client";

import { useEffect, useRef, type HTMLAttributes, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaType = "auto" | "always" | "scroll" | "hover";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation;
  type?: ScrollAreaType;
  children: ReactNode;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORIENTATION_CLASSES: Record<ScrollAreaOrientation, string> = {
  vertical: "overflow-y-auto overflow-x-hidden",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
};

const TYPE_MODIFIERS: Record<ScrollAreaType, string> = {
  auto: "",
  always: "",
  scroll: "",
  hover: "overflow-hidden hover:overflow-auto",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ScrollArea({
  orientation = "vertical",
  type = "auto",
  children,
  className,
  onKeyDown,
  ...props
}: ScrollAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollAreaRef.current;
    if (!element) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = 64;
      const pageAmount = element.clientHeight * 0.9;

      switch (e.key) {
        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: scrollAmount, behavior: "smooth" });
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: -scrollAmount, behavior: "smooth" });
          }
          break;
        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          }
          break;
        case "PageDown":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: pageAmount, behavior: "smooth" });
          }
          break;
        case "PageUp":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: -pageAmount, behavior: "smooth" });
          }
          break;
        case "Home":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollTo({ top: 0, behavior: "smooth" });
          }
          break;
        case "End":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
          }
          break;
      }

      if (onKeyDown) {
        const reactEvent = e as unknown as ReactKeyboardEvent<HTMLDivElement>;
        onKeyDown(reactEvent);
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [orientation, onKeyDown]);

  return (
    <div
      ref={scrollAreaRef}
      tabIndex={0}
      role="region"
      aria-orientation={orientation === "both" ? "vertical" : orientation}
      className={cn(
        "scrollarea-scrollbar",
        ORIENTATION_CLASSES[orientation],
        TYPE_MODIFIERS[type],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
