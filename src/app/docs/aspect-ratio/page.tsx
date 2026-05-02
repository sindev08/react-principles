"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { AspectRatio } from "@/ui/AspectRatio";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-aspectratio--default";

const CODE_SNIPPET = `import { AspectRatio } from "@/ui/AspectRatio";

// Basic usage
<AspectRatio ratio={16 / 9}>
  <img src="/video-poster.jpg" alt="Video thumbnail" className="w-full h-full object-cover" />
</AspectRatio>

// Square ratio
<AspectRatio ratio={1}>
  <img src="/avatar.jpg" alt="Profile picture" className="w-full h-full object-cover" />
</AspectRatio>

// String ratio
<AspectRatio ratio="21/9">
  <img src="/ultrawide.jpg" alt="Cinematic shot" className="w-full h-full object-cover" />
</AspectRatio>`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AspectRatioProps {
  ratio: number | string;
  children: React.ReactNode;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function parseRatio(ratio: number | string): string {
  if (typeof ratio === "number") {
    return \`\${ratio} / 1\`;
  }
  return ratio;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function AspectRatio({ ratio, children, className }: AspectRatioProps) {
  const aspectRatio = parseRatio(ratio);

  return (
    <div
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio }}
    >
      {children}
    </div>
  );
}`;

const PROPS_ROWS = [
  {
    prop: "ratio",
    type: "number | string",
    default: "—",
    description: "Width-to-height ratio (e.g. 16/9, 4/3, 1). Can be a number (decimal) or string (fraction).",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "—",
    description: "Content to display inside the container (image, video, iframe, etc.).",
  },
  {
    prop: "className",
    type: "string",
    default: "—",
    description: "Additional CSS classes to apply (merged with base styles).",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AspectRatioDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Layout</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Aspect Ratio</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Aspect Ratio
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Container that enforces a fixed aspect ratio for responsive content. Maintains proportions at any screen size, preventing layout shift during page load.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Responsive", "No Layout Shift", "Simple API", "Modern CSS", "Versatile"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="aspect-ratio" />

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
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Common Aspect Ratios</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">16:9 - Widescreen</p>
                  <AspectRatio ratio={16 / 9}>
                    <img
                      src="https://picsum.photos/800/450?random=1"
                      alt="16:9 landscape"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">4:3 - Standard TV</p>
                  <AspectRatio ratio={4 / 3}>
                    <img
                      src="https://picsum.photos/800/600?random=2"
                      alt="4:3 landscape"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">1:1 - Square</p>
                  <AspectRatio ratio={1}>
                    <img
                      src="https://picsum.photos/600/600?random=3"
                      alt="1:1 square"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">21:9 - Ultrawide</p>
                  <AspectRatio ratio="21/9">
                    <img
                      src="https://picsum.photos/800/343?random=4"
                      alt="21:9 ultrawide"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Responsive Grid</h3>
              <div className="grid grid-cols-2 gap-4">
                <AspectRatio ratio={1}>
                  <img
                    src="https://picsum.photos/400/400?random=5"
                    alt="Grid item 1"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <AspectRatio ratio={1}>
                  <img
                    src="https://picsum.photos/400/400?random=6"
                    alt="Grid item 2"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <AspectRatio ratio={1}>
                  <img
                    src="https://picsum.photos/400/400?random=7"
                    alt="Grid item 3"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
                <AspectRatio ratio={1}>
                  <img
                    src="https://picsum.photos/400/400?random=8"
                    alt="Grid item 4"
                    className="w-full h-full object-cover"
                  />
                </AspectRatio>
              </div>
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
          <CodeBlock filename="src/ui/AspectRatio.tsx" copyText={CODE_SNIPPET}>
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
          <CodeBlock filename="AspectRatio.tsx" copyText={COPY_PASTE_SNIPPET}>
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
            Simple container component that maintains aspect ratio for responsive content.
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
      </div>
    </DocsPageLayout>
  );
}
