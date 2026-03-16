"use client";

import { useEffect, useRef, HTMLAttributes, ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DrawerSide = "right" | "left";
export type DrawerSize = "sm" | "md" | "lg" | "full";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  side?: DrawerSide;
  size?: DrawerSize;
  children: ReactNode;
  className?: string;
}

export interface DrawerHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DrawerTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
}

export interface DrawerDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DrawerFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE_CLASSES: Record<DrawerSize, string> = {
  sm: "w-80",
  md: "w-96",
  lg: "w-lg",
  full: "w-full",
};

const SIDE_CLASSES: Record<DrawerSide, { panel: string; hidden: string }> = {
  right: { panel: "right-0 inset-y-0", hidden: "translate-x-full" },
  left: { panel: "left-0 inset-y-0", hidden: "-translate-x-full" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

Drawer.Header = function DrawerHeader({ children, className, ...props }: DrawerHeaderProps) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-slate-100 dark:border-[#1f2937]", className)} {...props}>
      {children}
    </div>
  );
}

Drawer.Title = function DrawerTitle({ children, className, ...props }: DrawerTitleProps) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-white pr-8", className)} {...props}>
      {children}
    </h2>
  );
}

Drawer.Description = function DrawerDescription({ children, className, ...props }: DrawerDescriptionProps) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

Drawer.Content = function DrawerContent({ children, className, ...props }: DrawerContentProps) {
  return (
    <div className={cn("flex-1 overflow-y-auto px-6 py-4", className)} {...props}>
      {children}
    </div>
  );
}

Drawer.Footer = function DrawerFooter({ children, className, ...props }: DrawerFooterProps) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-100 dark:border-[#1f2937] flex items-center justify-end gap-3 shrink-0", className)} {...props}>
      {children}
    </div>
  );
}

// ─── Drawer ───────────────────────────────────────────────────────────────────

export function Drawer({ open, onClose, side = "right", size = "md", children, className }: DrawerProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const { mounted, visible } = useAnimatedMount(open, 300);

  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;

  const { panel, hidden } = SIDE_CLASSES[side];

  const drawer = (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute flex flex-col h-full bg-white dark:bg-[#161b22]",
          "border-slate-200 dark:border-[#1f2937]",
          side === "right" ? "border-l" : "border-r",
          "shadow-2xl shadow-black/20",
          "transition-transform duration-300 ease-in-out",
          visible ? "translate-x-0" : hidden,
          SIZE_CLASSES[size],
          panel,
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close drawer"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {children}
      </div>
    </div>
  );

  return createPortal(drawer, document.body);
}
