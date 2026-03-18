"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { DropdownMenu } from "@/ui/DropdownMenu";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { DropdownMenu } from "@/ui/DropdownMenu";

<DropdownMenu>
  <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Profile</DropdownMenu.Label>
    <DropdownMenu.Item onSelect={() => console.log("Edit")}>Edit profile</DropdownMenu.Item>
    <DropdownMenu.Item onSelect={() => console.log("Invite")}>Invite member</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item onSelect={() => console.log("Delete")}>Delete project</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`;

const COPY_PASTE_SNIPPET = `import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
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
}`;

export default function DropdownMenuDocPage() {
  const [lastAction, setLastAction] = useState("None");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Dropdown Menu</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Compact action menu for contextual operations.
        </p>

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <DropdownMenu>
              <DropdownMenu.Trigger>Actions</DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Label>Project</DropdownMenu.Label>
                <DropdownMenu.Item onSelect={() => setLastAction("Edit profile")}>Edit profile</DropdownMenu.Item>
                <DropdownMenu.Item onSelect={() => setLastAction("Invite member")}>Invite member</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item onSelect={() => setLastAction("Delete project")}>Delete project</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
            <p className="text-xs text-slate-500 dark:text-slate-400">Last action: {lastAction}</p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/DropdownMenu.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="DropdownMenu.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
