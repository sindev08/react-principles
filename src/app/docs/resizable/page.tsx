"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Resizable } from "@/ui/Resizable";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-resizable--default";

const CODE_SNIPPET = `import { Resizable } from "@/ui/Resizable";

// Horizontal layout
<Resizable direction="horizontal" className="h-96">
  <Resizable.Panel defaultSize={50}>
    <div>Left panel</div>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={50}>
    <div>Right panel</div>
  </Resizable.Panel>
</Resizable>

// With visual grip
<Resizable direction="horizontal" className="h-96">
  <Resizable.Panel defaultSize={40}>
    <div>Sidebar</div>
  </Resizable.Panel>
  <Resizable.Handle withHandle />
  <Resizable.Panel defaultSize={60}>
    <div>Main content</div>
  </Resizable.Panel>
</Resizable>

// Three panels
<Resizable direction="horizontal" className="h-96">
  <Resizable.Panel defaultSize={33.33}>
    <div>Panel 1</div>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={33.33}>
    <div>Panel 2</div>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={33.34}>
    <div>Panel 3</div>
  </Resizable.Panel>
</Resizable>`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";
import React, { useRef, useState, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ResizableDirection = "horizontal" | "vertical";

export interface ResizableProps {
  direction: ResizableDirection;
  children: ReactNode;
  className?: string;
}

export interface ResizablePanelProps {
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  children: ReactNode;
  className?: string;
}

export interface ResizableHandleProps {
  withHandle?: boolean;
  disabled?: boolean;
  className?: string;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Resizable({ direction, children, className }: ResizableProps) {
  const [sizes, setSizes] = useState<number[]>([]);
  const [activeHandle, setActiveHandle] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Count panels and assign indices
  let panelCount = 0;
  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    if (child.type === Resizable.Panel) {
      const index = panelCount++;

      // Initialize size
      if (sizes[index] === undefined) {
        setSizes((prev) => {
          const next = [...prev];
          next[index] = (child.props as ResizablePanelProps).defaultSize || 50;
          return next;
        });
      }

      return React.cloneElement(child, {
        index,
        sizes,
        setSizes,
        containerRef,
        direction,
        activeHandle,
        setActiveHandle,
      } as any);
    }

    if (child.type === Resizable.Handle) {
      const handleIndex = panelCount - 1;
      return React.cloneElement(child, {
        index: handleIndex,
        sizes,
        setSizes,
        containerRef,
        direction,
        activeHandle,
        setActiveHandle,
      } as any);
    }

    return child;
  });

  return (
    <div
      ref={containerRef}
      className={cn("flex", direction === "horizontal" ? "flex-row" : "flex-col", className)}
    >
      {childrenWithProps}
    </div>
  );
}

// ─── Panel Sub-Component ───────────────────────────────────────────────────────

Resizable.Panel = function ResizablePanel({
  defaultSize = 50,
  children,
  className,
  index,
  sizes,
}: ResizablePanelProps & {
  index?: number;
  sizes?: number[];
  setSizes?: any;
  containerRef?: any;
  direction?: ResizableDirection;
  activeHandle?: number | null;
  setActiveHandle?: any;
}) {
  const size = index !== undefined && sizes?.[index] !== undefined ? sizes[index] : defaultSize;

  return (
    <div
      className={cn("flex-shrink-0", className)}
      style={{ flexBasis: \`\${size}%\`, flexShrink: 0 }}
    >
      {children}
    </div>
  );
};

// ─── Handle Sub-Component ───────────────────────────────────────────────────────────

Resizable.Handle = function ResizableHandle({
  withHandle = false,
  disabled = false,
  className,
  index,
  sizes,
  setSizes,
  containerRef,
  direction = "horizontal",
  activeHandle,
}: ResizableHandleProps & {
  index?: number;
  sizes?: number[];
  setSizes?: any;
  containerRef?: any;
  activeHandle?: number | null;
}) {
  const isHorizontal = direction === "horizontal";

  const handleMouseDown = (e: React.MouseEvent) => {
    if (disabled || index === undefined) return;
    e.preventDefault();

    const container = containerRef.current;
    if (!container || !setSizes) return;

    const startX = e.clientX;
    const initialSizes = [...(sizes || [])];

    setActiveHandle(index);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const containerWidth = container.offsetWidth;
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / containerWidth) * 100;

      if (index === undefined) return;

      const initialPanelSize = initialSizes[index] || 50;
      const newPanelSize = Math.max(10, Math.min(90, initialPanelSize + deltaPercent));
      const newNextPanelSize = initialSizes[index + 1] - (newPanelSize - initialPanelSize);

      if (newNextPanelSize >= 10 && newNextPanelSize <= 90) {
        setSizes((prev: number[]) => {
          const next = [...prev];
          next[index] = newPanelSize;
          next[index + 1] = newNextPanelSize;
          return next;
        });
      }
    };

    const handleMouseUp = () => {
      setActiveHandle(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      tabIndex={disabled ? -1 : 0}
      role="separator"
      aria-orientation={direction}
      className={cn(
        "flex-shrink-0 bg-slate-200 dark:bg-[#1f2937]",
        "hover:bg-primary/20",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "select-none",
        !disabled && (isHorizontal ? "cursor-col-resize" : "cursor-row-resize"),
        isHorizontal ? "w-1" : "h-1",
        activeHandle === index && !disabled && "bg-primary",
        className
      )}
      onMouseDown={handleMouseDown}
    >
      {withHandle && (
        <div className={cn("flex items-center justify-center", isHorizontal ? "h-full w-4" : "w-full h-4")}>
          <div className={cn("bg-slate-400 dark:bg-slate-600 rounded-full", isHorizontal ? "w-1 h-8" : "w-8 h-1")} />
        </div>
      )}
    </div>
  );
};`;

const PROPS_ROWS = [
  {
    component: "Resizable",
    prop: "direction",
    type: '"horizontal" | "vertical"',
    default: "—",
    description: "Layout direction. Currently only horizontal is fully implemented.",
  },
  {
    component: "Resizable.Panel",
    prop: "defaultSize",
    type: "number",
    default: "50",
    description: "Initial size of panel as percentage (0-100).",
  },
  {
    component: "Resizable.Panel",
    prop: "minSize",
    type: "number",
    default: "10",
    description: "Minimum size as percentage. Panel won't shrink below this.",
  },
  {
    component: "Resizable.Panel",
    prop: "maxSize",
    type: "number",
    default: "90",
    description: "Maximum size as percentage. Panel won't grow beyond this.",
  },
  {
    component: "Resizable.Handle",
    prop: "withHandle",
    type: "boolean",
    default: "false",
    description: "Show visual grip/handle on the drag separator.",
  },
  {
    component: "Resizable.Handle",
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disable the handle and prevent resizing.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ResizableDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Layout</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Resizable</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Resizable
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Panel layout where panels can be resized by dragging handles between them. Uses compound component API for flexible layouts.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Drag to Resize", "Compound API", "Min/Max Bounds", "Horizontal Layout"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="resizable" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">Explore all variants and interactive states in Storybook.</p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>

          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Basic Horizontal Layout</h3>
              <Resizable direction="horizontal" className="h-64">
                <Resizable.Panel defaultSize={50}>
                  <div className="p-4 h-full bg-slate-100 dark:bg-[#1f2937]">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Left Panel</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Drag the handle to resize</p>
                  </div>
                </Resizable.Panel>
                <Resizable.Handle withHandle />
                <Resizable.Panel defaultSize={50}>
                  <div className="p-4 h-full bg-slate-200 dark:bg-[#161b22]">
                    <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Right Panel</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">Panels resize smoothly</p>
                  </div>
                </Resizable.Panel>
              </Resizable>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Code Editor Layout</h3>
              <Resizable direction="horizontal" className="h-96">
                <Resizable.Panel defaultSize={30} minSize={20} maxSize={40}>
                  <div className="p-4 h-full bg-slate-900 dark:bg-black">
                    <h4 className="text-sm font-semibold text-white mb-4">File Explorer</h4>
                    <div className="space-y-2">
                      {["src/", "components/", "utils/", "index.tsx"].map((item, i) => (
                        <div key={i} className="text-xs text-slate-400 px-3 py-2 hover:bg-white/10 rounded cursor-pointer">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </Resizable.Panel>
                <Resizable.Handle withHandle />
                <Resizable.Panel defaultSize={70} minSize={60}>
                  <div className="p-4 h-full bg-slate-800 dark:bg-[#161b22]">
                    <h4 className="text-sm font-semibold text-white mb-4">Code Editor</h4>
                    <div className="text-xs text-slate-400 font-mono space-y-1">
                      <div>import React from 'react';</div>
                      <div></div>
                      <div>export default function App() {`{`}</div>
                      <div>  return &lt;div&gt;Hello&lt;/div&gt;;</div>
                      <div>{`}`}</div>
                    </div>
                  </div>
                </Resizable.Panel>
              </Resizable>
            </div>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Resizable.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Resizable.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Resizable uses a compound component API with three components:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Component", "Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.component}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 05 Usage Examples */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Examples</h2>
          </div>
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Basic Two-Panel Layout</h3>
              <div className="bg-slate-50 dark:bg-[#1f2937] rounded-lg p-4">
                <pre className="text-xs text-slate-800 dark:text-slate-300 overflow-x-auto">
{`<Resizable direction="horizontal" className="h-96">
  <Resizable.Panel defaultSize={50}>
    <div>Left panel content</div>
  </Resizable.Panel>
  <Resizable.Handle withHandle />
  <Resizable.Panel defaultSize={50}>
    <div>Right panel content</div>
  </Resizable.Panel>
</Resizable>`}
                </pre>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Three-Panel Layout</h3>
              <div className="bg-slate-50 dark:bg-[#1f2937] rounded-lg p-4">
                <pre className="text-xs text-slate-800 dark:text-slate-300 overflow-x-auto">
{`<Resizable direction="horizontal" className="h-96">
  <Resizable.Panel defaultSize={33.33}>
    <div>Panel 1</div>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={33.33}>
    <div>Panel 2</div>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel defaultSize={33.34}>
    <div>Panel 3</div>
  </Resizable.Panel>
</Resizable>`}
                </pre>
              </div>
            </div>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
