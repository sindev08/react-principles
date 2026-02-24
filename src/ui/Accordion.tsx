import {
  createContext,
  useContext,
  useState,
  HTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AccordionType = "single" | "multiple";

export interface AccordionProps {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
}

export interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AccordionCtx {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

interface ItemCtx {
  value: string;
  open: boolean;
}

const AccordionContext = createContext<AccordionCtx | null>(null);
const ItemContext = createContext<ItemCtx | null>(null);

function useAccordion() {
  const ctx = useContext(AccordionContext);
  if (!ctx) throw new Error("AccordionTrigger/Content must be inside <AccordionItem>");
  return ctx;
}

function useItem() {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("AccordionTrigger/Content must be inside <AccordionItem>");
  return ctx;
}

// ─── Components ───────────────────────────────────────────────────────────────

export function Accordion({
  type = "single",
  defaultValue,
  value: controlledValue,
  onChange,
  collapsible = true,
  children,
  className,
}: AccordionProps) {
  const toSet = (v?: string | string[]): Set<string> => {
    if (!v) return new Set();
    return new Set(Array.isArray(v) ? v : [v]);
  };

  const [internal, setInternal] = useState<Set<string>>(() => toSet(defaultValue));
  const isControlled = controlledValue !== undefined;
  const active = isControlled ? toSet(controlledValue) : internal;

  const toggle = (val: string) => {
    let next: Set<string>;

    if (type === "single") {
      if (active.has(val)) {
        next = collapsible ? new Set() : new Set([val]);
      } else {
        next = new Set([val]);
      }
    } else {
      next = new Set(active);
      if (next.has(val)) { next.delete(val); } else { next.add(val); }
    }

    if (!isControlled) setInternal(next);

    if (onChange) {
      const arr = [...next];
      onChange(type === "single" ? (arr[0] ?? "") : arr);
    }
  };

  const isOpen = (val: string) => active.has(val);

  return (
    <AccordionContext.Provider value={{ isOpen, toggle }}>
      <div className={cn("w-full divide-y divide-slate-200 dark:divide-[#1f2937] rounded-xl border border-slate-200 dark:border-[#1f2937] overflow-hidden", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({ value, children, className, ...props }: AccordionItemProps) {
  const { isOpen } = useAccordion();
  const open = isOpen(value);

  return (
    <ItemContext.Provider value={{ value, open }}>
      <div className={cn("bg-white dark:bg-[#161b22]", className)} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

export function AccordionTrigger({ children, className, ...props }: AccordionTriggerProps) {
  const { toggle } = useAccordion();
  const { value, open } = useItem();

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => toggle(value)}
      className={cn(
        "flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium",
        "text-slate-900 dark:text-white",
        "hover:bg-slate-50 dark:hover:bg-[#1f2937] transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary/40",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <svg
        className={cn("h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200", open && "rotate-180")}
        viewBox="0 0 16 16"
        fill="none"
      >
        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

export function AccordionContent({ children, className, ...props }: AccordionContentProps) {
  const { open } = useItem();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.2s ease",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div
          className={cn("px-5 pb-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed", className)}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
