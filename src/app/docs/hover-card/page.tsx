"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { HoverCard } from "@/ui/HoverCard";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { HoverCard } from "@/ui/HoverCard";

function MyComponent() {
  return (
    <HoverCard>
      <HoverCard.Trigger>Hover over me</HoverCard.Trigger>
      <HoverCard.Content>
        <p>Card content appears here</p>
      </HoverCard.Content>
    </HoverCard>
  );
}`;

const COPY_PASTE_SNIPPET = `"use client";

import {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type HTMLAttributes, type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export type HoverCardSide = "top" | "right" | "bottom" | "left";
export type HoverCardAlign = "start" | "center" | "end";

export interface HoverCardProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  openDelay?: number;
  closeDelay?: number;
  side?: HoverCardSide;
  align?: HoverCardAlign;
  children: ReactNode;
  className?: string;
}

export interface HoverCardTriggerProps extends HTMLAttributes<HTMLSpanElement> { children: ReactNode; }
export interface HoverCardContentProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }

// ─── Context ──────────────────────────────────────────────────────────────────

interface HoverCardContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  openDelay: number;
  closeDelay: number;
  side: HoverCardSide;
  align: HoverCardAlign;
}

const HoverCardContext = createContext<HoverCardContextValue | null>(null);

function useHoverCardContext() {
  const ctx = useContext(HoverCardContext);
  if (!ctx) throw new Error("HoverCard sub-components must be used inside <HoverCard>");
  return ctx;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export function HoverCard({
  open, defaultOpen = false, onOpenChange,
  openDelay = 700, closeDelay = 300,
  side = "bottom", align = "start",
  children, className,
}: HoverCardProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setOpen = useCallback((next: boolean) => {
    if (!isControlled) setInternalOpen(next);
    onOpenChange?.(next);
  }, [isControlled, onOpenChange]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimerRef.current) { clearTimeout(closeTimerRef.current); closeTimerRef.current = null; }
    if (isOpen) return;
    openTimerRef.current = setTimeout(() => { setOpen(true); openTimerRef.current = null; }, openDelay);
  }, [isOpen, openDelay, setOpen]);

  const handleMouseLeave = useCallback(() => {
    if (openTimerRef.current) { clearTimeout(openTimerRef.current); openTimerRef.current = null; }
    if (!isOpen) return;
    closeTimerRef.current = setTimeout(() => { setOpen(false); closeTimerRef.current = null; }, closeDelay);
  }, [isOpen, closeDelay, setOpen]);

  useEffect(() => () => {
    if (openTimerRef.current) clearTimeout(openTimerRef.current);
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  return (
    <HoverCardContext.Provider value={{ open: isOpen, setOpen, openDelay, closeDelay, side, align }}>
      <div ref={useRef<HTMLDivElement>(null)} className={cn("relative inline-flex", className)}
        onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        {children}
      </div>
    </HoverCardContext.Provider>
  );
}

// ─── Trigger ─────────────────────────────────────────────────────────────────

HoverCard.Trigger = function HoverCardTrigger({ children, className, ...props }: HoverCardTriggerProps) {
  return <span className={cn("inline-flex", className)} {...props}>{children}</span>;
};

// ─── Content ──────────────────────────────────────────────────────────────────

const SIDE_CLASS: Record<HoverCardSide, string> = {
  top: "bottom-[calc(100%+8px)]", bottom: "top-[calc(100%+8px)]",
  left: "right-[calc(100%+8px)]", right: "left-[calc(100%+8px)]",
};

const ALIGN_CLASS: Record<HoverCardAlign, string> = {
  start: "left-0", center: "left-1/2 -translate-x-1/2", end: "right-0",
};

const VERTICAL_ALIGN_CLASS: Record<HoverCardAlign, string> = {
  start: "top-0", center: "top-1/2 -translate-y-1/2", end: "bottom-0",
};

HoverCard.Content = function HoverCardContent({ children, className, ...props }: HoverCardContentProps) {
  const { open, side, align } = useHoverCardContext();
  if (!open) return null;
  const isHorizontal = side === "left" || side === "right";
  return (
    <div className={cn(
      "absolute z-50 w-80 rounded-lg border border-slate-200 bg-white p-4 shadow-lg dark:border-[#1f2937] dark:bg-[#161b22]",
      SIDE_CLASS[side], isHorizontal ? VERTICAL_ALIGN_CLASS[align] : ALIGN_CLASS[align], className,
    )} {...props}>
      {children}
    </div>
  );
};`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function HoverCardDocsPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Overlay</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Hover Card</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">HoverCard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A popover that appears on hover, used for non-critical previews like user profiles,
            link previews, or term definitions.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-[#1f2937] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">Accessible</span>
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-[#1f2937] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">Dark Mode</span>
            <span className="inline-flex items-center rounded-full border border-slate-200 dark:border-[#1f2937] px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">4 Sides</span>
          </div>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="hover-card" />
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Hover-only:</strong> Does not open on click — hover-activated only</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Configurable delays:</strong> <code className="font-mono text-xs bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 rounded">openDelay</code> (default 700ms) and <code className="font-mono text-xs bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 rounded">closeDelay</code> (default 300ms)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>4-side positioning:</strong> top, right, bottom, left with start/center/end alignment</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Controlled/uncontrolled:</strong> Use <code className="font-mono text-xs bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 rounded">open</code> + <code className="font-mono text-xs bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 rounded">onOpenChange</code> or let it manage its own state</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span><strong>Non-intrusive:</strong> Does not interfere with keyboard navigation</span>
            </li>
          </ul>
        </section>

        {/* Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>

          <div className="space-y-8">
            <div>
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Default (bottom, start)</p>
              <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8">
                <HoverCard>
                  <HoverCard.Trigger className="cursor-pointer rounded-md border border-slate-200 dark:border-[#1f2937] px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    Hover over me
                  </HoverCard.Trigger>
                  <HoverCard.Content>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">@sindev08</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Software Engineer building open-source UI components and patterns.
                      </p>
                    </div>
                  </HoverCard.Content>
                </HoverCard>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">Rich content (user profile preview)</p>
              <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8">
                <HoverCard openDelay={200}>
                  <HoverCard.Trigger className="cursor-pointer text-sm font-medium text-primary underline underline-offset-4">
                    Hover to preview profile
                  </HoverCard.Trigger>
                  <HoverCard.Content>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          SB
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">Singgih Budi Purnadi</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">@sindev08</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Full-stack developer passionate about React patterns and UI architecture.
                      </p>
                      <div className="flex gap-3 text-xs text-slate-500 dark:text-slate-400">
                        <span><strong className="text-slate-900 dark:text-white">128</strong> followers</span>
                        <span><strong className="text-slate-900 dark:text-white">42</strong> repos</span>
                      </div>
                    </div>
                  </HoverCard.Content>
                </HoverCard>
              </div>
            </div>
          </div>
        </section>

        {/* Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="HoverCard.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        {/* Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="HoverCard.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        {/* Usage Examples */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Examples</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Custom side and alignment</h3>
              <CodeBlock
                copyText={`<HoverCard side="top" align="center">
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <HoverCard.Content>
    <p>Centered above the trigger</p>
  </HoverCard.Content>
</HoverCard>`}
              >{`<HoverCard side="top" align="center">
  <HoverCard.Trigger>Hover me</HoverCard.Trigger>
  <HoverCard.Content>
    <p>Centered above the trigger</p>
  </HoverCard.Content>
</HoverCard>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Custom delays</h3>
              <CodeBlock
                copyText={`<HoverCard openDelay={0} closeDelay={200}>
  <HoverCard.Trigger>Instant open</HoverCard.Trigger>
  <HoverCard.Content>
    <p>Opens immediately, closes after 200ms</p>
  </HoverCard.Content>
</HoverCard>`}
              >{`<HoverCard openDelay={0} closeDelay={200}>
  <HoverCard.Trigger>Instant open</HoverCard.Trigger>
  <HoverCard.Content>
    <p>Opens immediately, closes after 200ms</p>
  </HoverCard.Content>
</HoverCard>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Controlled state</h3>
              <CodeBlock
                copyText={`const [open, setOpen] = useState(false);

<HoverCard open={open} onOpenChange={setOpen}>
  <HoverCard.Trigger>Programmatically controlled</HoverCard.Trigger>
  <HoverCard.Content>
    <p>This card is controlled</p>
  </HoverCard.Content>
</HoverCard>`}
              >{`const [open, setOpen] = useState(false);

<HoverCard open={open} onOpenChange={setOpen}>
  <HoverCard.Trigger>Programmatically controlled</HoverCard.Trigger>
  <HoverCard.Content>
    <p>This card is controlled</p>
  </HoverCard.Content>
</HoverCard>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">06</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {[
                  { prop: "open", type: "boolean", default: "—", description: "Controlled open state." },
                  { prop: "defaultOpen", type: "boolean", default: "false", description: "Uncontrolled initial state." },
                  { prop: "onOpenChange", type: "(open: boolean) => void", default: "—", description: "Called when open state changes." },
                  { prop: "openDelay", type: "number", default: "700", description: "Milliseconds before opening on hover." },
                  { prop: "closeDelay", type: "number", default: "300", description: "Milliseconds before closing when hover leaves." },
                  { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"bottom"', description: "Which side of the trigger the card appears on." },
                  { prop: "align", type: '"start" | "center" | "end"', default: '"start"', description: "Alignment of the card along the trigger edge." },
                  { prop: "className", type: "string", default: "—", description: "Additional CSS classes for the container." },
                ].map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3"><code className="font-mono text-xs font-semibold text-primary">{row.prop}</code></td>
                    <td className="px-4 py-3 max-w-[260px]"><code className="font-mono text-xs text-slate-600 dark:text-slate-400">{row.type}</code></td>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code></td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
