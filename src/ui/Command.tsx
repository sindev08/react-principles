import { createContext, useContext, useMemo, useState, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

interface CommandContextValue {
  query: string;
  setQuery: (query: string) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext() {
  const context = useContext(CommandContext);
  if (!context) throw new Error("Command sub-components must be used inside <Command.Root>");
  return context;
}

function CommandRoot({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const [query, setQuery] = useState("");

  return (
    <CommandContext.Provider value={{ query, setQuery }}>
      <div
        className={cn(
          "rounded-xl border border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#161b22]",
          className
        )}
        {...props}
      />
    </CommandContext.Provider>
  );
}

function CommandInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const { query, setQuery } = useCommandContext();

  return (
    <div className="flex items-center gap-2 border-b border-slate-100 px-3 py-2 dark:border-[#1f2937]">
      <span className="material-symbols-outlined text-[18px] text-slate-400">search</span>
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className={cn(
          "h-8 w-full bg-transparent text-sm text-slate-900 outline-hidden placeholder:text-slate-400 dark:text-white",
          className
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-h-64 overflow-y-auto p-1", className)} {...props} />;
}

interface CommandItemProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  keywords?: string[];
  children: ReactNode;
}

function CommandItem({ value, keywords, className, children, ...props }: CommandItemProps) {
  const { query } = useCommandContext();

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return true;
    const terms = [value, ...(keywords ?? [])].join(" ").toLowerCase();
    return terms.includes(normalized);
  }, [query, value, keywords]);

  if (!visible) return null;

  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-[#0d1117]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function CommandEmpty({ className, children = "No results" }: { className?: string; children?: ReactNode }) {
  const { query } = useCommandContext();
  if (!query.trim()) return null;
  return <p className={cn("px-3 py-5 text-center text-xs text-slate-500 dark:text-slate-400", className)}>{children}</p>;
}

function CommandGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

function CommandLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

function CommandSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-1 h-px bg-slate-200 dark:bg-[#1f2937]", className)} {...props} />;
}

type CommandCompoundComponent = typeof CommandRoot & {
  Root: typeof CommandRoot;
  Input: typeof CommandInput;
  List: typeof CommandList;
  Item: typeof CommandItem;
  Empty: typeof CommandEmpty;
  Group: typeof CommandGroup;
  Label: typeof CommandLabel;
  Separator: typeof CommandSeparator;
};

export const Command = Object.assign(CommandRoot, {
  Root: CommandRoot,
  Input: CommandInput,
  List: CommandList,
  Item: CommandItem,
  Empty: CommandEmpty,
  Group: CommandGroup,
  Label: CommandLabel,
  Separator: CommandSeparator,
}) as CommandCompoundComponent;

export { CommandInput, CommandList, CommandItem, CommandEmpty, CommandGroup, CommandLabel, CommandSeparator };
