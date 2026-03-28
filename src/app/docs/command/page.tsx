"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Command } from "@/ui/Command";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Command } from "@/components/ui/Command";

<Command>
  <Command.Input placeholder="Type a command..." />
  <Command.List>
    <Command.Group>
      <Command.Label>Navigation</Command.Label>
      <Command.Item value="Go to dashboard">Go to dashboard</Command.Item>
      <Command.Item value="Open settings">Open settings</Command.Item>
    </Command.Group>
  </Command.List>
</Command>`;

const COPY_PASTE_SNIPPET = `import { createContext, useContext, useMemo, useState, type HTMLAttributes, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CommandContextValue {
  query: string;
  setQuery: (query: string) => void;
}

const CommandContext = createContext<CommandContextValue | null>(null);

function useCommandContext() {
  const context = useContext(CommandContext);
  if (!context) throw new Error("Command sub-components must be used inside <Command>");
  return context;
}

export function Command({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
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

Command.Input = function CommandInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
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

Command.List = function CommandList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("max-h-64 overflow-y-auto p-1", className)} {...props} />;
}

interface CommandItemProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  keywords?: string[];
  children: ReactNode;
}

Command.Item = function CommandItem({ value, keywords, className, children, ...props }: CommandItemProps) {
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

Command.Empty = function CommandEmpty({ className, children = "No results" }: { className?: string; children?: ReactNode }) {
  const { query } = useCommandContext();
  if (!query.trim()) return null;
  return <p className={cn("px-3 py-5 text-center text-xs text-slate-500 dark:text-slate-400", className)}>{children}</p>;
}

Command.Group = function CommandGroup({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-1", className)} {...props} />;
}

Command.Label = function CommandLabel({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400", className)}
      {...props}
    />
  );
}

Command.Separator = function CommandSeparator({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-1 h-px bg-slate-200 dark:bg-[#1f2937]", className)} {...props} />;
}`;

export default function CommandDocPage() {
  const [lastCommand, setLastCommand] = useState("None");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Command</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">Quick-action list with search filtering for power users.</p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Command>
              <Command.Input placeholder="Type a command..." />
              <Command.List>
                <Command.Group>
                  <Command.Label>Navigation</Command.Label>
                  <Command.Item value="Go to dashboard" onClick={() => setLastCommand("Go to dashboard")}>Go to dashboard</Command.Item>
                  <Command.Item value="Open settings" onClick={() => setLastCommand("Open settings")}>Open settings</Command.Item>
                </Command.Group>
                <Command.Separator />
                <Command.Group>
                  <Command.Label>Project</Command.Label>
                  <Command.Item value="Invite member" onClick={() => setLastCommand("Invite member")}>Invite member</Command.Item>
                  <Command.Item value="Archive project" onClick={() => setLastCommand("Archive project")}>Archive project</Command.Item>
                </Command.Group>
                <Command.Empty>No commands found</Command.Empty>
              </Command.List>
            </Command>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last command: {lastCommand}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Command.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Command.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
