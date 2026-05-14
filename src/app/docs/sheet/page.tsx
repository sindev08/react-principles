"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Sheet } from "@/ui/Sheet";
import { cn } from "@/shared/utils/cn";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Sheet } from "@/ui/Sheet";

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen} side="right">
      <Sheet.Trigger>Open Sheet</Sheet.Trigger>
      <Sheet.Content>
        <Sheet.Header>
          <Sheet.Title>Title</Sheet.Title>
          <Sheet.Description>Description</Sheet.Description>
        </Sheet.Header>
        <div>Content</div>
        <Sheet.Footer>
          <Sheet.Close>Close</Sheet.Close>
        </Sheet.Footer>
      </Sheet.Content>
    </Sheet>
  );
}

// Different sides
<Sheet open={open} onOpenChange={setOpen} side="top">
  {/* Slides from top - size controls height */}
</Sheet>

<Sheet open={open} onOpenChange={setOpen} side="bottom" size="sm">
  {/* Slides from bottom with small height (50vh) */}
</Sheet>

// Size behavior:
// - Top/Bottom sheets: size controls height (sm=50vh, md=70vh, lg=85vh, xl=90vh, full=100vh)
// - Left/Right sheets: size controls width (sm=320px, md=384px, lg=512px, xl=576px, full=100%)`;

const COPY_PASTE_SNIPPET = `"use client";

import { createContext, useContext, useEffect, type HTMLAttributes, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/shared/utils/cn";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SheetSide = "top" | "right" | "bottom" | "left";
export type SheetSize = "sm" | "md" | "lg" | "xl" | "full";

export interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: SheetSide;
  size?: SheetSize;
  children: ReactNode;
  className?: string;
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface SheetContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side: SheetSide;
  size: SheetSize;
}

const SheetContext = createContext<SheetContextValue | null>(null);

function useSheetContext() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("Sheet sub-components must be used inside <Sheet>");
  }
  return context;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const WIDTH_CLASSES: Record<SheetSize, string> = {
  sm: "w-80",
  md: "w-96",
  lg: "w-[512px]",
  xl: "w-[576px]",
  full: "w-full",
  content: "w-auto",
};

const HEIGHT_CLASSES: Record<SheetSize, string> = {
  sm: "h-[50vh]",
  md: "h-[70vh]",
  lg: "h-[85vh]",
  xl: "h-[90vh]",
  full: "h-full",
  content: "h-auto",
};

const SIDE_CLASSES: Record<SheetSide, { panel: string; hidden: string }> = {
  right: { panel: "right-0 inset-y-0", hidden: "translate-x-full" },
  left: { panel: "left-0 inset-y-0", hidden: "-translate-x-full" },
  top: { panel: "top-0 inset-x-0", hidden: "-translate-y-full" },
  bottom: { panel: "bottom-0 inset-x-0", hidden: "translate-y-full" },
};

// ─── Main Component ───────────────────────────────────────────────────────────

export function Sheet({ open, onOpenChange, side = "right", size = "md", children }: SheetProps) {
  useEffect(() => {
    if (!open) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  return (
    <SheetContext.Provider value={{ open, onOpenChange, side, size }}>
      {children}
    </SheetContext.Provider>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

Sheet.Trigger = function SheetTrigger({ children, className, ...props }) {
  const { open, onOpenChange } = useSheetContext();
  return (
    <button
      type="button"
      onClick={() => onOpenChange(!open)}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
        "bg-primary text-white hover:bg-primary/90",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        "transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

Sheet.Content = function SheetContent({ children, className, ...props }) {
  const { open, onOpenChange, side, size } = useSheetContext();
  const { mounted, visible } = useAnimatedMount(open, 300);

  if (!mounted) return null;

  const { panel, hidden } = SIDE_CLASSES[side];

  return createPortal(
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300",
          visible ? "opacity-100" : "opacity-0"
        )}
        onClick={() => onOpenChange(false)}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "absolute flex flex-col bg-white dark:bg-[#161b22]",
          "border-slate-200 dark:border-[#1f2937]",
          side === "right" && "border-l",
          side === "left" && "border-r",
          side === "top" && "border-b",
          side === "bottom" && "border-t",
          "shadow-2xl shadow-black/20",
          "transition-transform duration-300 ease-in-out",
          side === "top" || side === "bottom"
            ? \`w-full \${HEIGHT_CLASSES[size]}\`
            : \`h-full \${WIDTH_CLASSES[size]}\`,
          panel,
          visible ? "translate-x-0 translate-y-0" : hidden,
          className
        )}
      >
        {/* Close button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1f2937] hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          aria-label="Close sheet"
        >
          <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="flex-1 overflow-y-auto px-6 py-4" {...props}>
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

Sheet.Header = function SheetHeader({ children, className, ...props }) {
  return (
    <div className={cn("px-6 pt-6 pb-4 border-b border-slate-100 dark:border-[#1f2937]", className)} {...props}>
      {children}
    </div>
  );
};

Sheet.Title = function SheetTitle({ children, className, ...props }) {
  return (
    <h2 className={cn("text-lg font-semibold text-slate-900 dark:text-white pr-8", className)} {...props}>
      {children}
    </h2>
  );
};

Sheet.Description = function SheetDescription({ children, className, ...props }) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
};

Sheet.Footer = function SheetFooter({ children, className, ...props }) {
  return (
    <div className={cn("px-6 py-4 border-t border-slate-100 dark:border-[#1f2937] flex items-center justify-end gap-3 shrink-0", className)} {...props}>
      {children}
    </div>
  );
};

Sheet.Close = function SheetClose({ children, className, ...props }) {
  const { onOpenChange } = useSheetContext();
  return (
    <button
      type="button"
      onClick={() => onOpenChange(false)}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium",
        "bg-slate-100 dark:bg-[#1f2937] text-slate-900 dark:text-white",
        "hover:bg-slate-200 dark:hover:bg-[#161b22]",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        "transition-colors",
        className
      )}
      {...props}
    >
      {children || "Close"}
    </button>
  );
};
`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function SheetDocsPage() {
  const [open, setOpen] = useState(false);
  const [side, setSide] = useState<"top" | "right" | "bottom" | "left">("right");
  const [size, setSize] = useState<"sm" | "md" | "lg" | "xl" | "full">("md");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Sheet</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Sheet
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A panel that slides in from the edge of the screen. More flexible than Drawer with
            support for all four sides (top, right, bottom, left).
          </p>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="sheet" />
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
              <span>
                <strong>4-Side Support:</strong> Slides in from top, right, bottom, or left edge
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Smooth Animation:</strong> 300ms slide-in with backdrop fade using{" "}
                <code>useAnimatedMount</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Flexible Sizing:</strong> 5 size variants (sm, md, lg, xl, full)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Keyboard Accessible:</strong> Closes on Escape key
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Backdrop Click:</strong> Click outside to close
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Body Scroll Lock:</strong> Prevents background scrolling when open
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Compound Components:</strong> Trigger, Content, Header, Title, Description,
                Footer, Close
              </span>
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

          <div className="space-y-6">
            {/* Controls */}
            <div className="p-6 bg-slate-100 dark:bg-[#1f2937] rounded-sm space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Side
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["top", "right", "bottom", "left"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSide(s)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                        side === s
                          ? "bg-primary text-white"
                          : "bg-white dark:bg-[#0d1117] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161b22]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {(["sm", "md", "lg", "xl", "full"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={cn(
                        "px-4 py-2 text-sm font-medium rounded-sm transition-colors",
                        size === s
                          ? "bg-primary text-white"
                          : "bg-white dark:bg-[#0d1117] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#161b22]"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Demo */}
            <div className="flex gap-4">
              <Sheet open={open} onOpenChange={setOpen} side={side} size={size}>
                <Sheet.Content>
                  <Sheet.Header>
                    <Sheet.Title>
                      {side.charAt(0).toUpperCase() + side.slice(1)} Sheet ({size})
                    </Sheet.Title>
                    <Sheet.Description>
                      Slides in from the {side} side with {size} size
                    </Sheet.Description>
                  </Sheet.Header>
                  <div className="space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This is a {side} sheet with {size} size. Use the controls above to switch
                      between different sides and sizes.
                    </p>
                    <div className="p-4 bg-slate-50 dark:bg-[#0d1117] rounded-sm">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        <strong>Size info:</strong>
                      </p>
                      <ul className="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                        <li>• sm: 50vh height / 320px width</li>
                        <li>• md: 70vh height / 384px width</li>
                        <li>• lg: 85vh height / 512px width</li>
                        <li>• xl: 90vh height / 576px width</li>
                        <li>• full: 100vh height / 100% width</li>
                        <li className="text-primary">• For top/bottom: size controls height, width is 100%</li>
                        <li className="text-primary">• For left/right: size controls width, height is 100%</li>
                      </ul>
                    </div>
                  </div>
                  <Sheet.Footer>
                    <Sheet.Close>Close</Sheet.Close>
                  </Sheet.Footer>
                </Sheet.Content>
              </Sheet>

              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Open Sheet
              </button>
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
          <CodeBlock filename="Sheet.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Sheet.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
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
            {/* Basic right sheet */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Basic right sheet
              </h3>
              <CodeBlock
                copyText={`const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen} side="right">
  <Sheet.Trigger>Open Sheet</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
    </Sheet.Header>
    <div className="p-6">Content</div>
  </Sheet.Content>
</Sheet>`}
              >{`const [open, setOpen] = useState(false);

<Sheet open={open} onOpenChange={setOpen} side="right">
  <Sheet.Trigger>Open Sheet</Sheet.Trigger>
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Title</Sheet.Title>
    </Sheet.Header>
    <div className="p-6">Content</div>
  </Sheet.Content>
</Sheet>`}</CodeBlock>
            </div>

            {/* Top sheet with custom size */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Top sheet with small size
              </h3>
              <CodeBlock
                copyText={`<Sheet open={open} onOpenChange={setOpen} side="top" size="sm">
  <Sheet.Content>
    <div className="p-6">
      Small panel from top (50vh height, 100% width)
    </div>
  </Sheet.Content>
</Sheet>`}
              >{`<Sheet open={open} onOpenChange={setOpen} side="top" size="sm">
  <Sheet.Content>
    <div className="p-6">
      Small panel from top (50vh height, 100% width)
    </div>
  </Sheet.Content>
</Sheet>`}</CodeBlock>
            </div>

            {/* Bottom sheet with footer */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Bottom sheet with footer actions
              </h3>
              <CodeBlock
                copyText={`<Sheet open={open} onOpenChange={setOpen} side="bottom">
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Confirm Action</Sheet.Title>
      <Sheet.Description>Are you sure?</Sheet.Description>
    </Sheet.Header>
    <div className="p-6">Details...</div>
    <Sheet.Footer>
      <Sheet.Close>Cancel</Sheet.Close>
      <button>Confirm</button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet>`}
              >{`<Sheet open={open} onOpenChange={setOpen} side="bottom">
  <Sheet.Content>
    <Sheet.Header>
      <Sheet.Title>Confirm Action</Sheet.Title>
      <Sheet.Description>Are you sure?</Sheet.Description>
    </Sheet.Header>
    <div className="p-6">Details...</div>
    <Sheet.Footer>
      <Sheet.Close>Cancel</Sheet.Close>
      <button>Confirm</button>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet>`}</CodeBlock>
            </div>

            {/* Full screen overlay */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Full screen sheet
              </h3>
              <CodeBlock
                copyText={`<Sheet open={open} onOpenChange={setOpen} side="right" size="full">
  <Sheet.Content>
    {/* Full viewport width/height */}
  </Sheet.Content>
</Sheet>`}
              >{`<Sheet open={open} onOpenChange={setOpen} side="right" size="full">
  <Sheet.Content>
    {/* Full viewport width/height */}
  </Sheet.Content>
</Sheet>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Props Table */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">06</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1f2937]">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Component
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Prop
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Default
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={5}>
                    Sheet
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    open
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Controlled open state
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    onOpenChange
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    (open: boolean) =&gt; void
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Callback when open state changes
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    side
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    "top" | "right" | "bottom" | "left"
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"right"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Which edge to slide from
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    size
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    "sm" | "md" | "lg" | "xl" | "full"
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"md"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Size of the sheet panel. For top/bottom: controls height (sm=50vh, md=70vh, lg=85vh, xl=90vh, full=100vh). For left/right: controls width (sm=320px, md=384px, lg=512px, xl=576px, full=100%)
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                    className
                  </td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                    Additional CSS classes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
