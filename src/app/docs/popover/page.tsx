"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Popover } from "@/ui/Popover";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Popover } from "@/components/ui/Popover";

<Popover>
  <Popover.Trigger>Open profile card</Popover.Trigger>
  <Popover.Content>
    <h4 className="text-sm font-semibold">Project Access</h4>
    <p className="mt-1 text-xs text-slate-500">Invite teammates and set role permissions.</p>
    <div className="mt-3">
      <Popover.Close>Done</Popover.Close>
    </div>
  </Popover.Content>
</Popover>`;

const COPY_PASTE_SNIPPET = `import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type PopoverSide = "top" | "bottom";
type PopoverAlign = "start" | "center" | "end";

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  side: PopoverSide;
  align: PopoverAlign;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopoverContext() {
  const context = useContext(PopoverContext);
  if (!context) throw new Error("Popover sub-components must be used inside <Popover>");
  return context;
}

export interface PopoverProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: PopoverSide;
  align?: PopoverAlign;
  children: ReactNode;
  className?: string;
}

export interface PopoverTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export interface PopoverContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface PopoverCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export function Popover({
  open,
  defaultOpen = false,
  onOpenChange,
  side = "bottom",
  align = "start",
  children,
  className,
}: PopoverProps) {
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

    const handleOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("mousedown", handleOutside);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleOutside);
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, setOpen]);

  return (
    <PopoverContext.Provider value={{ open: isOpen, setOpen, side, align }}>
      <div ref={containerRef} className={cn("relative inline-block", className)}>
        {children}
      </div>
    </PopoverContext.Provider>
  );
}

Popover.Trigger = function PopoverTrigger({ children, className, onClick, ...props }: PopoverTriggerProps) {
  const { open, setOpen } = usePopoverContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition-all",
        "hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-200 dark:hover:bg-[#161b22]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

const SIDE_CLASS: Record<PopoverSide, string> = {
  top: "bottom-[calc(100%+8px)]",
  bottom: "top-[calc(100%+8px)]",
};

const ALIGN_CLASS: Record<PopoverAlign, string> = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

Popover.Content = function PopoverContent({ children, className, ...props }: PopoverContentProps) {
  const { open, side, align } = usePopoverContext();

  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 w-72 rounded-xl border border-slate-200 bg-white p-4 shadow-xl dark:border-[#1f2937] dark:bg-[#161b22]",
        SIDE_CLASS[side],
        ALIGN_CLASS[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Popover.Close = function PopoverClose({ children = "Close", className, onClick, ...props }: PopoverCloseProps) {
  const { setOpen } = usePopoverContext();

  return (
    <button
      type="button"
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
      className={cn("text-sm font-medium text-primary hover:underline", className)}
      {...props}
    >
      {children}
    </button>
  );
}`;

export default function PopoverDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Popover</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">
          Click-triggered floating panel for contextual actions and details.
        </p>

        <CliInstallBlock name="popover" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Popover>
              <Popover.Trigger>Open profile card</Popover.Trigger>
              <Popover.Content>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Project Access</h4>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Invite teammates and set role permissions.
                </p>
                <div className="mt-3">
                  <Popover.Close>Done</Popover.Close>
                </div>
              </Popover.Content>
            </Popover>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Popover.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Popover.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
