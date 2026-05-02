"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { ScrollArea } from "@/ui/ScrollArea";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-scrollarea--default";

const CODE_SNIPPET = `import { ScrollArea } from "@/ui/ScrollArea";

// Vertical scroll (default)
<ScrollArea className="h-64">
  <p>Long content that scrolls vertically...</p>
</ScrollArea>

// Horizontal scroll
<ScrollArea orientation="horizontal" className="w-96">
  <div className="flex gap-4">
    {/* Wide content that scrolls horizontally */}
  </div>
</ScrollArea>

// Both orientations
<ScrollArea orientation="both" className="h-64 w-96">
  <table>
    {/* Large table that scrolls both directions */}
  </table>
</ScrollArea>

// Always visible scrollbar
<ScrollArea type="always" className="h-64">
  {/* Scrollbar always visible */}
</ScrollArea>

// On hover
<ScrollArea type="hover" className="h-64">
  {/* Scrollbar appears on hover */}
</ScrollArea>`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ScrollAreaOrientation = "vertical" | "horizontal" | "both";
export type ScrollAreaType = "auto" | "always" | "scroll" | "hover";

export interface ScrollAreaProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ScrollAreaOrientation;
  type?: ScrollAreaType;
  children: ReactNode;
  className?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ORIENTATION_CLASSES: Record<ScrollAreaOrientation, string> = {
  vertical: "overflow-y-auto overflow-x-hidden",
  horizontal: "overflow-x-auto overflow-y-hidden",
  both: "overflow-auto",
};

const TYPE_MODIFIERS: Record<ScrollAreaType, string> = {
  auto: "",
  always: "",
  scroll: "",
  hover: "overflow-hidden hover:overflow-auto",
};

// ─── Component ────────────────────────────────────────────────────────────────

export function ScrollArea({
  orientation = "vertical",
  type = "auto",
  children,
  className,
  onKeyDown,
  ...props
}: ScrollAreaProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollAreaRef.current;
    if (!element) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const scrollAmount = 64;
      const pageAmount = element.clientHeight * 0.9;

      switch (e.key) {
        case "ArrowDown":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: scrollAmount, behavior: "smooth" });
          }
          break;
        case "ArrowUp":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: -scrollAmount, behavior: "smooth" });
          }
          break;
        case "ArrowRight":
          if (orientation === "horizontal" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ left: scrollAmount, behavior: "smooth" });
          }
          break;
        case "ArrowLeft":
          if (orientation === "horizontal" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ left: -scrollAmount, behavior: "smooth" });
          }
          break;
        case "PageDown":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: pageAmount, behavior: "smooth" });
          }
          break;
        case "PageUp":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollBy({ top: -pageAmount, behavior: "smooth" });
          }
          break;
        case "Home":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollTo({ top: 0, behavior: "smooth" });
          }
          break;
        case "End":
          if (orientation === "vertical" || orientation === "both") {
            e.preventDefault();
            element.scrollTo({ top: element.scrollHeight, behavior: "smooth" });
          }
          break;
      }

      if (onKeyDown) {
        const reactEvent = e as unknown as ReactKeyboardEvent<HTMLDivElement>;
        onKeyDown(reactEvent);
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [orientation, onKeyDown]);

  return (
    <div
      ref={scrollAreaRef}
      tabIndex={0}
      role="region"
      aria-orientation={orientation === "both" ? "vertical" : orientation}
      className={cn(
        "scrollarea-scrollbar",
        ORIENTATION_CLASSES[orientation],
        TYPE_MODIFIERS[type],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}`;

const PROPS_ROWS = [
  {
    prop: "orientation",
    type: '"vertical" | "horizontal" | "both"',
    default: "vertical",
    description: "Direction of scrolling. Vertical scrolls up/down, horizontal scrolls left/right, both allows scrolling in all directions.",
  },
  {
    prop: "type",
    type: '"auto" | "always" | "scroll" | "hover"',
    default: "auto",
    description: "Controls scrollbar visibility. Auto shows when needed, always keeps it visible, scroll forces it, hover shows on interaction.",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "—",
    description: "Content to display inside the scrollable area.",
  },
  {
    prop: "className",
    type: "string",
    default: "—",
    description: "Additional CSS classes to apply (merged with base styles).",
  },
  {
    prop: "...props",
    type: "HTMLAttributes<HTMLDivElement>",
    default: "—",
    description: "All standard div attributes like onClick, onFocus, etc.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ScrollAreaDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Layout</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">ScrollArea</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            ScrollArea
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Scrollable container with consistent custom scrollbar styling across all browsers and platforms. Includes keyboard navigation and configurable visibility options.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Cross-browser", "Keyboard Navigation", "Custom Scrollbar", "Accessible", "Dark Mode"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="scrollarea" />

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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Vertical Scrolling</h3>
              <ScrollArea className="h-64">
                <div className="space-y-4 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    This is a vertically scrollable area. Use the scrollbar or arrow keys to navigate through the content.
                  </p>
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
                      <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Horizontal Scrolling</h3>
              <ScrollArea orientation="horizontal" className="w-full">
                <div className="flex gap-4 p-4">
                  {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex-shrink-0 w-32 h-32 rounded-lg bg-slate-100 dark:bg-[#1f2937] flex items-center justify-center">
                      <span className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Scrollbar Visibility</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Auto (default)</p>
                  <ScrollArea className="h-32">
                    <div className="space-y-2 p-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300">Line {i + 1}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Always</p>
                  <ScrollArea type="always" className="h-32">
                    <div className="space-y-2 p-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300">Line {i + 1}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Hover</p>
                  <ScrollArea type="hover" className="h-32">
                    <div className="space-y-2 p-3">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="text-xs text-slate-700 dark:text-slate-300">Line {i + 1}</div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Keyboard Navigation</h3>
              <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 mb-4">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300 mb-2">Keyboard Shortcuts</h4>
                <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
                  <li>• <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0d1117] text-xs font-mono">Arrow Up/Down</kbd> - Scroll by small amount</li>
                  <li>• <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0d1117] text-xs font-mono">Page Up/Down</kbd> - Scroll by page</li>
                  <li>• <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0d1117] text-xs font-mono">Home/End</kbd> - Jump to start/end</li>
                  <li>• <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-[#0d1117] text-xs font-mono">Tab</kbd> - Focus on scrollable area</li>
                </ul>
              </div>
              <ScrollArea className="h-48">
                <div className="space-y-4 p-4">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click on this area and use keyboard shortcuts to navigate. Try Arrow Up/Down, Page Up/Down, and Home/End keys.
                  </p>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="p-3 rounded-lg bg-slate-100 dark:bg-[#1f2937]">
                      <p className="text-sm text-slate-700 dark:text-slate-300">Item {i + 1}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
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
          <CodeBlock filename="src/ui/ScrollArea.tsx" copyText={CODE_SNIPPET}>
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
          <CodeBlock filename="ScrollArea.tsx" copyText={COPY_PASTE_SNIPPET}>
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
            ScrollArea extends all standard div HTML attributes and accepts the following props:
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
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

        {/* 05 Accessibility */}
        <section id="accessibility" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Accessibility</h2>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Keyboard Navigation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                ScrollArea is fully keyboard accessible:
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li>Tab into the scrollable area to focus it</li>
                <li>Use Arrow keys for directional scrolling</li>
                <li>Page Up/Down for page-by-page navigation</li>
                <li>Home/End to jump to start or end</li>
                <li>Smooth scrolling for better UX</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">ARIA Attributes</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Built-in accessibility features:
              </p>
              <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1 list-disc list-inside">
                <li><code className="font-mono text-xs">role="region"</code> - Identifies as a scrollable region</li>
                <li><code className="font-mono text-xs">aria-orientation</code> - Indicates scroll direction</li>
                <li><code className="font-mono text-xs">tabIndex={0}</code> - Makes the area focusable</li>
                <li>Orientation-aware keyboard handling</li>
              </ul>
            </div>

            <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Screen Reader Support</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Screen readers announce the scrollable region and its orientation. Users can navigate using standard keyboard shortcuts.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
