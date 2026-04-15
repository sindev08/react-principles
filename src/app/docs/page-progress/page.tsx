"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Button } from "@/ui/Button";
import { PageProgress } from "@/ui/PageProgress";
import { useProgressBar } from "@/shared/hooks/useProgressBar";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-page-progress--default";

const CODE_SNIPPET = `import { useState } from "react";
import { PageProgress } from "@/ui/PageProgress";
import { useProgressBar } from "@/shared/hooks/useProgressBar";

export function RouteFeedback() {
  const [navigationKey, setNavigationKey] = useState("initial");
  const { progress, visible } = useProgressBar(navigationKey);

  return (
    <>
      <button onClick={() => setNavigationKey(\`nav-\${Date.now()}\`)}>
        Simulate navigation
      </button>
      <PageProgress progress={progress} visible={visible} />
    </>
  );
}`;

const COPY_PASTE_SNIPPET = `import { cn } from "@/lib/utils";

export interface PageProgressProps {
  progress: number;
  visible: boolean;
}

export function PageProgress({ progress, visible }: PageProgressProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed left-0 top-0 z-200 h-0.5 bg-primary",
        "shadow-[0_0_8px_1px_rgba(70,40,241,0.7)]",
        "transition-opacity duration-300",
        visible ? "opacity-100" : "opacity-0"
      )}
      style={{
        width: \`\${progress}%\`,
        transition: \`width \${progress === 0 ? "0ms" : progress === 100 ? "150ms" : "350ms"} ease-out, opacity 300ms\`,
      }}
    />
  );
}`;

const PROPS_ROWS = [
  {
    prop: "progress",
    type: "number",
    default: "—",
    description: "Current completion percentage from 0 to 100.",
  },
  {
    prop: "visible",
    type: "boolean",
    default: "—",
    description: "Controls the fade-in and fade-out visibility state.",
  },
];

function PageProgressDemo() {
  const [navigationKey, setNavigationKey] = useState("initial");
  const [attempts, setAttempts] = useState(0);
  const { progress, visible } = useProgressBar(navigationKey);

  const handleSimulateNavigation = () => {
    setAttempts((count) => count + 1);
    setNavigationKey(`navigation-${Date.now()}`);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-5">
      <PageProgress progress={progress} visible={visible} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            Simulate a route transition
          </p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Trigger the hook and watch the top edge of the viewport for the animated progress bar.
          </p>
        </div>
        <Button onClick={handleSimulateNavigation}>Simulate navigation</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Visible
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {visible ? "Yes" : "No"}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Progress
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {Math.round(progress)}%
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Runs
          </p>
          <p className="mt-2 text-lg font-bold text-slate-900 dark:text-white">
            {attempts}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PageProgressDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Navigation</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Page Progress</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Page Progress
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A thin top-of-page progress indicator for route transitions and optimistic navigation
            feedback. It pairs with the <code className="font-mono">useProgressBar</code> hook to
            animate route changes without blocking content.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Dark Mode", "Animated", "Portal"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="page-progress" />

        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
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
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
            This demo wires the component to <code className="font-mono">useProgressBar</code> so
            you can replay a route transition and observe the bar animating at the top of the
            viewport.
          </p>
          <PageProgressDemo />
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/PageProgress.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Copy-Paste (Single File)
            </h2>
          </div>
          <CodeBlock filename="PageProgress.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr
                    key={row.prop}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]"
                  >
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400">
                        {row.type}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {row.default}
                      </code>
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
