"use client";

import React, { createContext, useContext, useEffect, useState, type ReactElement, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavigationMenuProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuListProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuItemProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuTriggerProps {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

export interface NavigationMenuContentProps {
  children: ReactNode;
  className?: string;
}

export interface NavigationMenuLinkProps {
  href?: string;
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}

// ─── Context ────────────────────────────────────────────────────────────────────

interface NavigationMenuContextValue {
  open: string | null;
  setOpen: (value: string | null) => void;
}

const NavigationMenuContext = createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenuContext() {
  const context = useContext(NavigationMenuContext);
  if (!context) {
    throw new Error("NavigationMenu sub-components must be used inside <NavigationMenu>");
  }
  return context;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function NavigationMenu({ children, className }: NavigationMenuProps) {
  const [open, setOpen] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open]);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = target.closest("[data-navigation-menu]");
      if (!menu && open) setOpen(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  return (
    <NavigationMenuContext.Provider value={{ open, setOpen }}>
      <nav className={className} data-navigation-menu>
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

// ─── List Sub-Component ───────────────────────────────────────────────────────

NavigationMenu.List = function NavigationMenuList({ children, className }: NavigationMenuListProps) {
  return (
    <ul className={cn("flex items-center gap-1", className)} role="menubar">
      {children}
    </ul>
  );
};

// ─── Item Sub-Component ───────────────────────────────────────────────────────

NavigationMenu.Item = function NavigationMenuItem({
  children,
  className,
}: NavigationMenuItemProps) {
  const { open, setOpen } = useNavigationMenuContext();
  // Generate a unique ID for this item
  const itemId = React.useId();
  const itemValue = itemId;
  const isOpen = open === itemValue;
  const hasContent = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === NavigationMenu.Content
  );

  return (
    <li className={cn("relative", className)} role="none">
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === NavigationMenu.Trigger) {
          const triggerChild = child as ReactElement<{
            isOpen?: boolean;
            onToggle?: () => void;
            hasContent?: boolean;
          }>;
          return React.cloneElement(triggerChild, {
            isOpen,
            onToggle: () => setOpen(isOpen ? null : itemValue),
            hasContent,
          });
        }

        if (child.type === NavigationMenu.Content) {
          const contentChild = child as ReactElement<{
            isOpen?: boolean;
            onClose?: () => void;
          }>;
          return React.cloneElement(contentChild, {
            isOpen,
            onClose: () => setOpen(null),
          });
        }

        return child;
      })}
    </li>
  );
};

// ─── Trigger Sub-Component ─────────────────────────────────────────────────────

NavigationMenu.Trigger = function NavigationMenuTrigger({
  asChild = false,
  children,
  className,
  isOpen,
  onToggle,
  hasContent,
}: NavigationMenuTriggerProps & {
  isOpen?: boolean;
  onToggle?: () => void;
  hasContent?: boolean;
}) {
  // Handle hover for desktop
  const handleMouseEnter = () => {
    if (hasContent && onToggle) {
      onToggle();
    }
  };

  // Handle click for touch/mobile
  const handleClick = () => {
    if (onToggle) {
      onToggle();
    }
  };

  const triggerClassName = cn(
    "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
    "transition-colors",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
    "cursor-pointer",
    isOpen
      ? "bg-slate-100 dark:bg-[#1f2937] text-slate-900 dark:text-white"
      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<{
      className?: string;
      onMouseEnter?: () => void;
      onClick?: () => void;
      'aria-expanded'?: boolean;
      'aria-haspopup'?: boolean;
    }>;
    return React.cloneElement(child, {
      onMouseEnter: handleMouseEnter,
      onClick: handleClick,
      className: cn(triggerClassName, child.props.className),
      'aria-expanded': isOpen,
      'aria-haspopup': hasContent,
    });
  }

  return (
    <button
      type="button"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      className={triggerClassName}
      aria-expanded={isOpen}
      aria-haspopup={hasContent}
    >
      {children}
      {/* Chevron indicator */}
      {hasContent && (
        <svg
          className={cn(
            "ml-2 h-4 w-4 transition-transform duration-200",
            isOpen ? "rotate-180" : ""
          )}
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
};

// ─── Content Sub-Component ───────────────────────────────────────────────────

NavigationMenu.Content = function NavigationMenuContent({
  children,
  className,
  isOpen,
  onClose,
}: NavigationMenuContentProps & {
  isOpen?: boolean;
  onClose?: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div
      className={cn(
        "absolute top-full left-0 mt-2 min-w-[200px] p-2",
        "bg-white dark:bg-[#161b22]",
        "border border-slate-200 dark:border-[#1f2937]",
        "rounded-lg shadow-lg",
        "z-50",
        className
      )}
      onMouseLeave={onClose}
    >
      {children}
    </div>
  );
};

// ─── Link Sub-Component ────────────────────────────────────────────────────────

NavigationMenu.Link = function NavigationMenuLink({
  href,
  asChild = false,
  children,
  className,
}: NavigationMenuLinkProps) {
  const linkClassName = cn(
    "block rounded-sm px-4 py-2 text-sm font-medium",
    "text-slate-700 dark:text-slate-300",
    "hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-900 dark:hover:text-white",
    "transition-colors",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;
    return React.cloneElement(child, {
      className: cn(linkClassName, child.props.className),
    });
  }

  return (
    <a href={href} className={linkClassName}>
      {children}
    </a>
  );
};
