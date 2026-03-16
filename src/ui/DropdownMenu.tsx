import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenuContext() {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error("DropdownMenu sub-components must be used inside <DropdownMenu>");
  return context;
}

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
  className?: string;
}

export interface DropdownMenuTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface DropdownMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean;
  onSelect?: () => void;
}

export function DropdownMenu({ open, defaultOpen = false, onOpenChange, children, className }: DropdownMenuProps) {
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

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, setOpen]);

  return (
    <DropdownMenuContext.Provider value={{ open: isOpen, setOpen }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
}

DropdownMenu.Trigger = function DropdownMenuTrigger({ children, className, onClick, ...props }: DropdownMenuTriggerProps) {
  const { open, setOpen } = useDropdownMenuContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 transition-all",
        "hover:bg-slate-50 dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-slate-200 dark:hover:bg-[#161b22]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

DropdownMenu.Content = function DropdownMenuContent({ children, className, ...props }: DropdownMenuContentProps) {
  const { open } = useDropdownMenuContext();
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute right-0 top-[calc(100%+8px)] z-50 min-w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-xl",
        "dark:border-[#1f2937] dark:bg-[#161b22]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

DropdownMenu.Label = function DropdownMenuLabel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

DropdownMenu.Separator = function DropdownMenuSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-1 h-px bg-slate-200 dark:bg-[#1f2937]", className)} {...props} />;
}

DropdownMenu.Item = function DropdownMenuItem({ inset = false, onSelect, onClick, className, disabled, ...props }: DropdownMenuItemProps) {
  const { setOpen } = useDropdownMenuContext();

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(event) => {
        onClick?.(event);
        if (disabled) return;
        onSelect?.();
        setOpen(false);
      }}
      className={cn(
        "flex w-full items-center rounded-lg px-2.5 py-2 text-left text-sm text-slate-700 transition-all",
        "hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#0d1117]",
        inset && "pl-8",
        disabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    />
  );
}