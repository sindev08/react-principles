import {
  createContext,
  useContext,
  useState,
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";
import { cn } from "@react-principles/shared/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TabsVariant = "underline" | "pills";

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  children: ReactNode;
  className?: string;
}

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface TabsTriggerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> {
  value: string;
  children: ReactNode;
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface TabsContextValue {
  active: string;
  setActive: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs sub-components must be used inside <Tabs>");
  return ctx;
}

// ─── Components ───────────────────────────────────────────────────────────────

export function Tabs({
  value,
  defaultValue = "",
  onChange,
  variant = "underline",
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const setActive = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ active, setActive, variant }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  const { variant } = useTabsContext();

  return (
    <div
      role="tablist"
      className={cn(
        "flex",
        variant === "underline" && "border-b border-slate-200 dark:border-[#1f2937] gap-0",
        variant === "pills" && "gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#161b22] w-fit",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, disabled, className, ...props }: TabsTriggerProps) {
  const { active, setActive, variant } = useTabsContext();
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActive(value)}
      className={cn(
        "text-sm font-medium transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary/40 rounded",
        disabled && "opacity-40 cursor-not-allowed pointer-events-none",

        // underline variant
        variant === "underline" && [
          "px-4 py-2.5 -mb-px border-b-2",
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600",
        ],

        // pills variant
        variant === "pills" && [
          "px-4 py-1.5 rounded-lg",
          isActive
            ? "bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white shadow-sm"
            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200",
        ],

        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const { active } = useTabsContext();

  if (active !== value) return null;

  return (
    <div role="tabpanel" className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}
