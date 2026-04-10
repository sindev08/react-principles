"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Skeleton } from "@/ui/Skeleton";
import type { SkeletonVariant } from "@/ui/Skeleton";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const VARIANTS: { variant: SkeletonVariant; label: string }[] = [
  { variant: "line", label: "Line" },
  { variant: "rect", label: "Rect" },
  { variant: "circle", label: "Circle" },
];

const CODE_SNIPPET = `import { Skeleton } from "@/ui/Skeleton";

<div className="space-y-3">
  <Skeleton variant="line" width="70%" />
  <Skeleton variant="line" width="45%" />
  <Skeleton variant="rect" className="h-24" />
</div>`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

export type SkeletonVariant = "line" | "rect" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  width?: number | string;
  height?: number | string;
  className?: string;
}`;

const PROPS_ROWS = [
  { prop: "variant", type: '"line" | "rect" | "circle"', default: '"line"', description: "Switches between text-line, block, and circular placeholder shapes." },
  { prop: "width", type: "number | string", default: "—", description: "Optional inline width override for the placeholder." },
  { prop: "height", type: "number | string", default: "—", description: "Optional inline height override for the placeholder." },
  { prop: "className", type: "string", default: "—", description: "Additional classes merged into the skeleton element." },
];

function ThemedSkeletonPanel({ theme }: { theme: "light" | "dark" }) {
  const dark = theme === "dark";
  const shell = dark ? "border-[#1f2937] bg-[#0d1117]" : "border-slate-200 bg-white";

  return (
    <div className={`rounded-xl border p-6 space-y-4 ${shell}`}>
      <Skeleton variant="line" width="70%" />
      <Skeleton variant="line" width="45%" />
      <Skeleton variant="rect" className="h-24" />
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" width="50%" />
          <Skeleton variant="line" width="35%" />
        </div>
      </div>
    </div>
  );
}

export default function SkeletonDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Feedback</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Skeleton</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Skeleton
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Animated loading placeholder that preserves layout while content is fetching and gives
            users a clearer sense of what is about to appear.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode", "3 Variants", "Animated"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="skeleton" />

        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedSkeletonPanel theme="light" />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedSkeletonPanel theme="dark" />
            </div>
          </div>
        </section>

        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="flex items-center gap-4">
              {VARIANTS.map(({ variant, label }) => (
                <div key={variant} className="space-y-3 text-center">
                  <div className="rounded-xl border border-dashed border-slate-200 p-4 dark:border-[#1f2937]">
                    {variant === "line" ? <Skeleton variant="line" width={120} /> : null}
                    {variant === "rect" ? <Skeleton variant="rect" className="h-24 w-32" /> : null}
                    {variant === "circle" ? <Skeleton variant="circle" className="h-16 w-16" /> : null}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Skeleton.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Skeleton.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3"><code className="text-xs font-mono font-semibold text-primary">{row.prop}</code></td>
                    <td className="px-4 py-3 max-w-[240px]"><code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
                    <td className="px-4 py-3"><code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code></td>
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
