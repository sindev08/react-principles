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

export interface MenubarProps {
  children: ReactNode;
  className?: string;
}

export interface MenubarMenuProps {
  children: ReactNode;
  className?: string;
}

export interface MenubarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface MenubarContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface MenubarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  onSelect?: () => void;
  disabled?: boolean;
  inset?: boolean;
}

export interface MenubarCheckboxItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
}

export interface MenubarRadioGroupProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export interface MenubarRadioItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export interface MenubarSeparatorProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export interface MenubarSubProps {
  children: ReactNode;
  className?: string;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface MenubarSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface MenubarShortcutProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

// ─── Injected Props Interfaces ────────────────────────────────────────────────

interface InjectedTriggerProps {
  isOpen?: boolean;
  onToggle?: () => void;
  hasContent?: boolean;
  menuValue?: string;
}

interface InjectedContentProps {
  isOpen?: boolean;
  onClose?: () => void;
  isSubmenu?: boolean;
}

interface InjectedSubTriggerProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

// ─── Menubar Context ──────────────────────────────────────────────────────────

interface MenubarContextValue {
  openMenu: string | null;
  setOpenMenu: (value: string | null) => void;
  closeAll: () => void;
  registerTrigger: (value: string, el: HTMLButtonElement | null) => void;
  focusTrigger: (value: string) => void;
  triggerValues: React.MutableRefObject<string[]>;
}

const MenubarContext = createContext<MenubarContextValue | null>(null);

function useMenubarContext() {
  const context = useContext(MenubarContext);
  if (!context) {
    throw new Error("Menubar sub-components must be used inside <Menubar>");
  }
  return context;
}

// ─── Radio Context ────────────────────────────────────────────────────────────

interface MenubarRadioContextValue {
  value: string;
  setValue: (value: string) => void;
}

const MenubarRadioContext = createContext<MenubarRadioContextValue | null>(null);

function useMenubarRadioContext() {
  const context = useContext(MenubarRadioContext);
  if (!context) {
    throw new Error("MenubarRadioItem must be used inside <MenubarRadioGroup>");
  }
  return context;
}

// ─── Content Focus Context ────────────────────────────────────────────────────

interface MenubarContentFocusContextValue {
  registerItem: (el: HTMLButtonElement | null) => void;
}

const MenubarContentFocusContext = createContext<MenubarContentFocusContextValue | null>(null);

function useMenubarContentFocusContext() {
  return useContext(MenubarContentFocusContext);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Menubar({ children, className }: MenubarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const triggerValues = useRef<string[]>([]);

  const closeAll = useCallback(() => setOpenMenu(null), []);
  const setOpen = useCallback((value: string | null) => setOpenMenu(value), []);

  const registerTrigger = useCallback((value: string, el: HTMLButtonElement | null) => {
    if (el) {
      triggerRefs.current.set(value, el);
      if (!triggerValues.current.includes(value)) {
        triggerValues.current.push(value);
      }
    } else {
      triggerRefs.current.delete(value);
    }
  }, []);

  const focusTrigger = useCallback((value: string) => {
    triggerRefs.current.get(value)?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!openMenu) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        // Refocus the trigger that was open
        requestAnimationFrame(() => {
          triggerRefs.current.get(openMenu)?.focus();
        });
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [openMenu]);

  // Close when clicking outside
  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const menu = target.closest("[data-menubar]");
      if (!menu && openMenu) setOpenMenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [openMenu]);

  return (
    <MenubarContext.Provider value={{ openMenu, setOpenMenu: setOpen, closeAll, registerTrigger, focusTrigger, triggerValues }}>
      <nav className={cn("flex items-center gap-0.5", className)} data-menubar role="menubar">
        {children}
      </nav>
    </MenubarContext.Provider>
  );
}

// ─── Menu Sub-Component ───────────────────────────────────────────────────────

Menubar.Menu = function MenubarMenu({ children, className }: MenubarMenuProps) {
  const { openMenu, setOpenMenu } = useMenubarContext();
  const menuValue = React.useId();
  const isOpen = openMenu === menuValue;
  const hasContent = React.Children.toArray(children).some(
    (child) => React.isValidElement(child) && child.type === Menubar.Content
  );

  return (
    <div className={cn("relative", className)}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        if (child.type === Menubar.Trigger) {
          const triggerChild = child as ReactElement<MenubarTriggerProps & InjectedTriggerProps>;
          return React.cloneElement(triggerChild, {
            isOpen,
            onToggle: () => setOpenMenu(isOpen ? null : menuValue),
            hasContent,
            menuValue,
          });
        }

        if (child.type === Menubar.Content) {
          const contentChild = child as ReactElement<MenubarContentProps & InjectedContentProps>;
          return React.cloneElement(contentChild, {
            isOpen,
            onClose: () => setOpenMenu(null),
          });
        }

        return child;
      })}
    </div>
  );
};

// ─── Trigger Sub-Component ─────────────────────────────────────────────────────

Menubar.Trigger = function MenubarTrigger({
  children,
  className,
  isOpen,
  onToggle,
  hasContent,
  menuValue,
  ...props
}: MenubarTriggerProps & InjectedTriggerProps) {
  const { registerTrigger, focusTrigger, triggerValues, openMenu, setOpenMenu } = useMenubarContext();
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Register this trigger for keyboard navigation
  useEffect(() => {
    if (menuValue) {
      registerTrigger(menuValue, triggerRef.current);
      return () => registerTrigger(menuValue, null);
    }
  }, [menuValue, registerTrigger]);

  const handleClick = () => {
    onToggle?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!menuValue || !openMenu) return;

    const values = triggerValues.current;
    const currentIndex = values.indexOf(menuValue);

    if (e.key === "ArrowRight") {
      e.preventDefault();
      const nextIndex = currentIndex < values.length - 1 ? currentIndex + 1 : 0;
      const nextValue = values[nextIndex];
      if (nextValue) {
        setOpenMenu(nextValue);
        focusTrigger(nextValue);
      }
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : values.length - 1;
      const prevValue = values[prevIndex];
      if (prevValue) {
        setOpenMenu(prevValue);
        focusTrigger(prevValue);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      onToggle?.();
    }
  };

  const triggerClassName = cn(
    "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium",
    "transition-colors cursor-pointer select-none",
    "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
    isOpen
      ? "bg-slate-100 dark:bg-[#1f2937] text-slate-900 dark:text-white"
      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1f2937]",
    className
  );

  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={triggerClassName}
      aria-expanded={isOpen ?? false}
      aria-haspopup={hasContent ? true : undefined}
      role="menuitem"
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Content Sub-Component ───────────────────────────────────────────────────

Menubar.Content = function MenubarContent({
  children,
  className,
  isOpen,
  onClose,
  isSubmenu,
  ...props
}: MenubarContentProps & InjectedContentProps) {
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const focusedIndex = useRef(-1);

  const registerItem = useCallback((el: HTMLButtonElement | null) => {
    if (el) {
      itemRefs.current.push(el);
    }
  }, []);

  // Reset refs when content opens/closes
  useEffect(() => {
    if (isOpen) {
      itemRefs.current = [];
      focusedIndex.current = -1;
      // Auto-focus first item
      requestAnimationFrame(() => {
        itemRefs.current[0]?.focus();
        focusedIndex.current = 0;
      });
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <MenubarContentFocusContext.Provider value={{ registerItem }}>
      <div
        className={cn(
          "z-50 min-w-[200px] p-1",
          "bg-white dark:bg-[#161b22]",
          "border border-slate-200 dark:border-[#1f2937]",
          "rounded-lg shadow-lg",
          isSubmenu ? "absolute left-full top-0 ml-1" : "absolute top-full left-0 mt-1",
          className
        )}
        role="menu"
        aria-orientation="vertical"
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </div>
    </MenubarContentFocusContext.Provider>
  );
};

// ─── Item Sub-Component ───────────────────────────────────────────────────────

Menubar.Item = function MenubarItem({
  children,
  className,
  onSelect,
  disabled,
  inset,
  onClick,
  ...props
}: MenubarItemProps) {
  const { closeAll } = useMenubarContext();
  const focusContext = useMenubarContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusContext && itemRef.current) {
      focusContext.registerItem(itemRef.current);
    }
  }, [focusContext]);

  return (
    <button
      ref={itemRef}
      type="button"
      role="menuitem"
      disabled={disabled}
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
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

// ─── Checkbox Item Sub-Component ──────────────────────────────────────────────

Menubar.CheckboxItem = function MenubarCheckboxItem({
  children,
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  onClick,
  ...props
}: MenubarCheckboxItemProps) {
  const { closeAll } = useMenubarContext();
  const focusContext = useMenubarContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  const [internalChecked, setInternalChecked] = useState(defaultChecked ?? false);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  useEffect(() => {
    if (focusContext && itemRef.current) {
      focusContext.registerItem(itemRef.current);
    }
  }, [focusContext]);

  const toggle = () => {
    const next = !isChecked;
    if (!isControlled) setInternalChecked(next);
    onCheckedChange?.(next);
    closeAll();
  };

  return (
    <button
      ref={itemRef}
      type="button"
      role="menuitemcheckbox"
      aria-checked={isChecked}
      disabled={disabled}
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
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      {children}
    </button>
  );
};

// ─── Radio Group Sub-Component ────────────────────────────────────────────────

Menubar.RadioGroup = function MenubarRadioGroup({
  value,
  defaultValue = "",
  onValueChange,
  children,
  className,
}: MenubarRadioGroupProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const setValue = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <MenubarRadioContext.Provider value={{ value: active, setValue }}>
      <div className={cn("py-1", className)} role="group">
        {children}
      </div>
    </MenubarRadioContext.Provider>
  );
};

// ─── Radio Item Sub-Component ─────────────────────────────────────────────────

Menubar.RadioItem = function MenubarRadioItem({
  value: itemValue,
  children,
  className,
  disabled,
  onClick,
  ...props
}: MenubarRadioItemProps) {
  const { value, setValue } = useMenubarRadioContext();
  const { closeAll } = useMenubarContext();
  const focusContext = useMenubarContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);
  const isChecked = value === itemValue;

  useEffect(() => {
    if (focusContext && itemRef.current) {
      focusContext.registerItem(itemRef.current);
    }
  }, [focusContext]);

  return (
    <button
      ref={itemRef}
      type="button"
      role="menuitemradio"
      aria-checked={isChecked}
      disabled={disabled}
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
        {isChecked && (
          <span className="h-2 w-2 rounded-full bg-current" />
        )}
      </span>
      {children}
    </button>
  );
};

// ─── Separator Sub-Component ──────────────────────────────────────────────────

Menubar.Separator = function MenubarSeparator({ className, ...props }: MenubarSeparatorProps) {
  return (
    <div
      className={cn("-mx-1 my-1 h-px bg-slate-200 dark:bg-[#1f2937]", className)}
      role="separator"
      aria-orientation="horizontal"
      {...props}
    />
  );
};

// ─── Sub Sub-Component ────────────────────────────────────────────────────────

Menubar.Sub = function MenubarSub({
  children,
  className,
  defaultOpen = false,
  open,
  onOpenChange,
}: MenubarSubProps) {
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

        if (child.type === Menubar.SubTrigger) {
          const triggerChild = child as ReactElement<MenubarSubTriggerProps & InjectedSubTriggerProps>;
          return React.cloneElement(triggerChild, {
            isOpen,
            onToggle: () => setOpen(!isOpen),
          });
        }

        if (child.type === Menubar.Content) {
          const contentChild = child as ReactElement<MenubarContentProps & InjectedContentProps>;
          return React.cloneElement(contentChild, {
            isOpen,
            onClose: () => setOpen(false),
            isSubmenu: true,
          });
        }

        return child;
      })}
    </div>
  );
};

// ─── SubTrigger Sub-Component ─────────────────────────────────────────────────

Menubar.SubTrigger = function MenubarSubTrigger({
  children,
  className,
  isOpen,
  onToggle,
  onClick,
  ...props
}: MenubarSubTriggerProps & InjectedSubTriggerProps) {
  const focusContext = useMenubarContentFocusContext();
  const itemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (focusContext && itemRef.current) {
      focusContext.registerItem(itemRef.current);
    }
  }, [focusContext]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      onToggle?.();
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggle?.();
    }
  };

  return (
    <button
      ref={itemRef}
      type="button"
      role="menuitem"
      aria-expanded={isOpen}
      aria-haspopup="true"
      onClick={(e) => {
        onClick?.(e);
        onToggle?.();
      }}
      onKeyDown={handleKeyDown}
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
      <svg
        className="ml-auto h-4 w-4"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M6 4l4 4-4 4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

// ─── Shortcut Sub-Component ───────────────────────────────────────────────────

Menubar.Shortcut = function MenubarShortcut({ children, className, ...props }: MenubarShortcutProps) {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest text-slate-500 dark:text-slate-400", className)}
      {...props}
    >
      {children}
    </span>
  );
};
