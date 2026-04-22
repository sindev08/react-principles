"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ContextMenuProps {
  children: ReactNode;
}

export interface ContextMenuTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface ContextMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface ContextMenuItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  inset?: boolean;
}

export interface ContextMenuCheckboxItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export interface ContextMenuRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface ContextMenuRadioItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export interface ContextMenuSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface ContextMenuSubProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface ContextMenuSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface ContextMenuShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

// ─── Injected Props ──────────────────────────────────────────────────────────

interface InjectedContentProps {
  isSubmenu?: boolean;
  onClose?: () => void;
}

interface InjectedSubTriggerProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface ContextMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  closeAll: () => void;
  position: React.MutableRefObject<{ x: number; y: number }>;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

function useContextMenuContext() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("ContextMenu sub-components must be used inside <ContextMenu>");
  }
  return context;
}

// ─── Radio Context ────────────────────────────────────────────────────────────

interface ContextMenuRadioContextValue {
  value: string;
  setValue: (value: string) => void;
}

const ContextMenuRadioContext = createContext<ContextMenuRadioContextValue | null>(null);

function useContextMenuRadioContext() {
  const context = useContext(ContextMenuRadioContext);
  if (!context) {
    throw new Error("ContextMenuRadioItem must be used inside <ContextMenuRadioGroup>");
  }
  return context;
}

// ─── Content Focus Context ────────────────────────────────────────────────────

interface ContentFocusContextValue {
  registerItem: (el: HTMLButtonElement | null) => void;
}

const ContentFocusContext = createContext<ContentFocusContextValue | null>(null);

function useContentFocusContext() {
  return useContext(ContentFocusContext);
}

// ─── Root Component ───────────────────────────────────────────────────────────

export function ContextMenu({ children }: ContextMenuProps) {
  const [open, setOpen] = useState(false);
  const position = useRef({ x: 0, y: 0 });
  const closeAll = useCallback(() => setOpen(false), []);

  return (
    <ContextMenuContext.Provider value={{ open, setOpen, closeAll, position }}>
      {children}
    </ContextMenuContext.Provider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

ContextMenu.Trigger = function ContextMenuTrigger({ children, className }: ContextMenuTriggerProps) {
  const { setOpen, position } = useContextMenuContext();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    position.current = { x: e.clientX, y: e.clientY };
    setOpen(true);
  };

  return (
    <div className={cn("inline-block", className)} onContextMenu={handleContextMenu}>
      {children}
    </div>
  );
};

// ─── Content ──────────────────────────────────────────────────────────────────

ContextMenu.Content = function ContextMenuContent({
  children,
  className,
  isSubmenu,
  onClose: injectedOnClose,
  ...props
}: ContextMenuContentProps & InjectedContentProps) {
  const { open, closeAll, position } = useContextMenuContext();
  const isOpen = isSubmenu ? (injectedOnClose !== undefined) : open;
  const onClose = injectedOnClose ?? closeAll;
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusedIndex = useRef(-1);
  const contentRef = useRef<HTMLDivElement>(null);

  const registerItem = useCallback((el: HTMLButtonElement | null) => {
    if (el) itemRefs.current.push(el);
  }, []);

  useEffect(() => {
    if (isOpen) {
      itemRefs.current = [];
      focusedIndex.current = -1;
      requestAnimationFrame(() => {
        // Adjust position so content stays within viewport
        if (contentRef.current) {
          const rect = contentRef.current.getBoundingClientRect();
          const pos = isSubmenu ? { ...position.current } : { x: position.current.x, y: position.current.y };
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          if (pos.x + rect.width > vw) pos.x = vw - rect.width - 8;
          if (pos.y + rect.height > vh) pos.y = vh - rect.height - 8;
          if (pos.x < 4) pos.x = 4;
          if (pos.y < 4) pos.y = 4;
          contentRef.current.style.left = `${pos.x}px`;
          contentRef.current.style.top = `${pos.y}px`;
        }
        itemRefs.current[0]?.focus();
        focusedIndex.current = 0;
      });
    }
  }, [isOpen, position, isSubmenu]);

  const getFocusableItems = useCallback(() => {
    return itemRefs.current.filter((el) => el && !el.disabled);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = getFocusableItems();

    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(focusedIndex.current + 1, items.length - 1);
      focusedIndex.current = next;
      items[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(focusedIndex.current - 1, 0);
      focusedIndex.current = prev;
      items[prev]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    }
  };

  // Close on outside click
  const justOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      justOpenedRef.current = true;
      requestAnimationFrame(() => {
        justOpenedRef.current = false;
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (justOpenedRef.current) return;
      const target = e.target as HTMLElement;
      if (contentRef.current?.contains(target)) return;
      onClose?.();
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <ContentFocusContext.Provider value={{ registerItem }}>
      <div
        ref={contentRef}
        className={cn(
          "z-50 min-w-[200px] p-1",
          "bg-white dark:bg-[#161b22]",
          "border border-slate-200 dark:border-[#1f2937]",
          "rounded-lg shadow-lg",
          "fixed",
          isSubmenu ? "left-full top-0 ml-1" : "",
          className
        )}
        role="menu"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </ContentFocusContext.Provider>
  );
};

// ─── Item ──────────────────────────────────────────────────────────────────────

ContextMenu.Item = function ContextMenuItem({
  children, className, onSelect, disabled, inset, onClick, ...props
}: ContextMenuItemProps) {
  const { closeAll } = useContextMenuContext();
  const focusContext = useContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusContext && itemRef.current) focusContext.registerItem(itemRef.current);
  }, [focusContext]);

  return (
    <button
      ref={itemRef} type="button" role="menuitem" disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (disabled) return;
        onSelect?.();
        closeAll();
      }}
      className={cn(
        "relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm",
        "outline-none transition-colors cursor-default",
        "text-slate-700 dark:text-slate-300",
        "focus:bg-slate-100 focus:text-slate-900",
        "dark:focus:bg-[#1f2937] dark:focus:text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8", className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Checkbox Item ────────────────────────────────────────────────────────────

ContextMenu.CheckboxItem = function ContextMenuCheckboxItem({
  children, className, checked, defaultChecked, onCheckedChange, disabled, onClick, ...props
}: ContextMenuCheckboxItemProps) {
  const { closeAll } = useContextMenuContext();
  const focusContext = useContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (focusContext && itemRef.current) focusContext.registerItem(itemRef.current);
  }, [focusContext]);

  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
    closeAll();
  };

  return (
    <button
      ref={itemRef} type="button" role="menuitemcheckbox"
      aria-checked={isChecked} disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (disabled) return;
        toggle();
      }}
      className={cn(
        "relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm",
        "outline-none transition-colors cursor-default",
        "text-slate-700 dark:text-slate-300",
        "focus:bg-slate-100 focus:text-slate-900",
        "dark:focus:bg-[#1f2937] dark:focus:text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="mr-2 flex h-4 w-4 items-center justify-center">
        {isChecked && (
          <svg className="h-4 w-4" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
};

// ─── Radio Group ──────────────────────────────────────────────────────────────

ContextMenu.RadioGroup = function ContextMenuRadioGroup({
  value, defaultValue = "", onValueChange, children, className
}: ContextMenuRadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <ContextMenuRadioContext.Provider value={{ value: active, setValue }}>
      <div className={cn("py-1", className)} role="group">{children}</div>
    </ContextMenuRadioContext.Provider>
  );
};

// ─── Radio Item ───────────────────────────────────────────────────────────────

ContextMenu.RadioItem = function ContextMenuRadioItem({
  value: itemValue, children, className, disabled, onClick, ...props
}: ContextMenuRadioItemProps) {
  const { value, setValue } = useContextMenuRadioContext();
  const { closeAll } = useContextMenuContext();
  const focusContext = useContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);
  const isChecked = value === itemValue;

  useEffect(() => {
    if (focusContext && itemRef.current) focusContext.registerItem(itemRef.current);
  }, [focusContext]);

  return (
    <button
      ref={itemRef} type="button" role="menuitemradio"
      aria-checked={isChecked} disabled={disabled}
      onClick={(e) => {
        onClick?.(e);
        if (disabled) return;
        setValue(itemValue);
        closeAll();
      }}
      className={cn(
        "relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm",
        "outline-none transition-colors cursor-default",
        "text-slate-700 dark:text-slate-300",
        "focus:bg-slate-100 focus:text-slate-900",
        "dark:focus:bg-[#1f2937] dark:focus:text-white",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="mr-2 flex h-4 w-4 items-center justify-center">
        {isChecked && <span className="h-2 w-2 rounded-full bg-current" />}
      </span>
      {children}
    </button>
  );
};

// ─── Separator ──────────────────────────────────────────────────────────────────

ContextMenu.Separator = function ContextMenuSeparator({ className, ...props }: ContextMenuSeparatorProps) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-[#1f2937]", className)}
      role="separator" aria-orientation="horizontal" {...props}
    />
  );
};

// ─── Sub ─────────────────────────────────────────────────────────────────────────

ContextMenu.Sub = function ContextMenuSub({
  children, className, defaultOpen = false, open, onOpenChange
}: ContextMenuSubProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  };

  return (
    <div className={cn("relative", className)} onMouseLeave={() => setOpen(false)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        if (child.type === ContextMenu.SubTrigger) {
          const triggerChild = child as ReactElement<ContextMenuSubTriggerProps & InjectedSubTriggerProps>;
          return React.cloneElement(triggerChild, { isOpen, onToggle: () => setOpen(!isOpen) });
        }
        if (child.type === ContextMenu.Content) {
          const contentChild = child as ReactElement<ContextMenuContentProps & InjectedContentProps>;
          return React.cloneElement(contentChild, { onClose: () => setOpen(false), isSubmenu: true });
        }
        return child;
      })}
    </div>
  );
};

// ─── SubTrigger ───────────────────────────────────────────────────────────────

ContextMenu.SubTrigger = function ContextMenuSubTrigger({
  children, className, isOpen, onToggle, onClick, ...props
}: ContextMenuSubTriggerProps & InjectedSubTriggerProps) {
  const focusContext = useContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusContext && itemRef.current) focusContext.registerItem(itemRef.current);
  }, [focusContext]);

  return (
    <button
      ref={itemRef} type="button" role="menuitem"
      aria-expanded={isOpen} aria-haspopup="true"
      onClick={(e) => { onClick?.(e); onToggle?.(); }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") { e.preventDefault(); onToggle?.(); }
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle?.(); }
      }}
      className={cn(
        "relative flex w-full items-center rounded-sm px-2 py-1.5 text-sm",
        "outline-none transition-colors cursor-default",
        "text-slate-700 dark:text-slate-300",
        "hover:bg-slate-100 hover:text-slate-900",
        "dark:hover:bg-[#1f2937] dark:hover:text-white",
        "focus:bg-slate-100 focus:text-slate-900",
        "dark:focus:bg-[#1f2937] dark:focus:text-white",
        className
      )}
      {...props}
    >
      {children}
      <svg className="ml-auto h-4 w-4" viewBox="0 0 16 16" fill="none">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
};

// ─── Shortcut ─────────────────────────────────────────────────────────────────

ContextMenu.Shortcut = function ContextMenuShortcut({ children, className, ...props }: ContextMenuShortcutProps) {
  return (
    <span className={cn("ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400", className)} {...props}>
      {children}
    </span>
  );
};
