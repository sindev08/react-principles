"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export interface CollapsibleTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface CollapsibleContentProps {
  children: ReactNode;
  className?: string;
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible sub-components must be used inside <Collapsible>");
  }
  return context;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (disabled) return;

    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    if (onOpenChange) {
      onOpenChange(next);
    }
  }, [open, isControlled, disabled, onOpenChange]);

  return (
    <CollapsibleContext.Provider value={{ open, toggle, disabled }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

// ─── Trigger Sub-Component ─────────────────────────────────────────────────────

Collapsible.Trigger = function CollapsibleTrigger({ children, className }: CollapsibleTriggerProps) {
  const { open, toggle, disabled } = useCollapsibleContext();

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "flex w-full items-center justify-between",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
};

// ─── Content Sub-Component ─────────────────────────────────────────────────────

Collapsible.Content = function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  const { open } = useCollapsibleContext();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.2s ease",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
