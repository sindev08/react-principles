import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";

const TOC_ITEMS = [
  { label: "Theme Tokens", href: "#tokens" },
  { label: "Dark Mode", href: "#dark-mode" },
  { label: "Customize", href: "#customize" },
];

const GLOBALS_CSS = `/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-primary: #4628f1;
}

:root {
  --background: #f6f6f8;
  --foreground: #0f172a;
}

.dark {
  --background: #020617;
  --foreground: #e2e8f0;
}

body {
  color: var(--foreground);
  background: var(--background);
}`;

const CUSTOMIZE_PRIMARY = `/* Change brand color globally */
@theme {
  --color-primary: #0ea5e9;
}`;

const COLOR_TOKENS = [
  {
    name: "--color-primary",
    value: "#4628f1",
    swatch: "bg-[#4628f1]",
    usage: "Buttons, links, active tabs, focus rings",
  },
  {
    name: "--background (light)",
    value: "#f6f6f8",
    swatch: "bg-[#f6f6f8] border border-slate-200",
    usage: "Page background in light mode",
  },
  {
    name: "--background (dark)",
    value: "#020617",
    swatch: "bg-[#020617]",
    usage: "Page background in dark mode",
  },
];

const SURFACES = [
  { label: "Panel light", hex: "#ffffff", swatch: "bg-white border border-slate-200", desc: "Card/dialog surface" },
  { label: "Panel dark", hex: "#161b22", swatch: "bg-[#161b22]", desc: "Card/dialog surface" },
  { label: "Inner dark", hex: "#0d1117", swatch: "bg-[#0d1117]", desc: "Nested surface" },
  { label: "Border dark", hex: "#1f2937", swatch: "bg-[#1f2937]", desc: "Dividers/borders" },
];

export default function ThemingPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/docs/installation" className="cursor-pointer transition-colors hover:text-primary">
            Installation
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Theming</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Theming
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Components installed via the CLI use Tailwind CSS v4 with CSS custom properties
            for colors. Add the following setup to your{" "}
            <code className="font-mono text-sm text-primary">globals.css</code> to make
            everything work correctly.
          </p>
        </div>

        {/* Theme Tokens */}
        <section id="tokens" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Theme Tokens</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Add this to your <code className="font-mono text-xs text-primary">globals.css</code>.
            The <code className="font-mono text-xs text-primary">@custom-variant dark</code> line
            enables class-based dark mode, and{" "}
            <code className="font-mono text-xs text-primary">--color-primary</code> is used
            by all components for interactive states.
          </p>

          <CodeBlock filename="src/app/globals.css" copyText={GLOBALS_CSS}>
            {GLOBALS_CSS}
          </CodeBlock>

          <div className="mt-8 space-y-3">
            {COLOR_TOKENS.map((token) => (
              <div
                key={token.name}
                className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-4"
              >
                <div className={`h-12 w-12 rounded-lg shrink-0 ${token.swatch}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <code className="text-sm font-mono font-semibold text-primary">{token.name}</code>
                    <span className="text-xs text-slate-400 font-mono">{token.value}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{token.usage}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 mt-8 mb-4">
            Surface colors used across components:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SURFACES.map((surface) => (
              <div key={surface.label} className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#1f2937]">
                <div className={`h-10 ${surface.swatch}`} />
                <div className="bg-white dark:bg-[#161b22] px-2.5 py-2">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{surface.label}</p>
                  <p className="text-[10px] font-mono text-slate-400">{surface.hex}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{surface.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dark Mode */}
        <section id="dark-mode" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dark Mode</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            All components use class-based dark mode. The{" "}
            <code className="font-mono text-xs text-primary">dark</code> class on{" "}
            <code className="font-mono text-xs text-primary">&lt;html&gt;</code> activates
            all <code className="font-mono text-xs text-primary">dark:</code> variants.
            See the <Link href="/docs/dark-mode" className="text-primary hover:underline">Dark Mode</Link> page
            for implementation details.
          </p>

          <div className="space-y-3">
            {[
              { label: "Token source", value: "Single source in globals.css" },
              { label: "Mode strategy", value: "Class-based via @custom-variant dark" },
              { label: "Activation", value: "Add class=\"dark\" to <html>" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 rounded-xl border border-slate-100 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] px-4 py-3">
                <span className="text-xs font-semibold text-primary shrink-0 mt-0.5 w-28">{label}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Customize */}
        <section id="customize" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Customize</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            To change the brand color globally, update{" "}
            <code className="font-mono text-xs text-primary">--color-primary</code> in the{" "}
            <code className="font-mono text-xs text-primary">@theme</code> block.
            All components will pick up the new value automatically.
          </p>

          <CodeBlock filename="src/app/globals.css" copyText={CUSTOMIZE_PRIMARY}>
            {CUSTOMIZE_PRIMARY}
          </CodeBlock>
        </section>

        <div className="flex items-center justify-between border-t border-slate-200 pt-8 dark:border-[#1f2937]">
          <Link href="/docs/installation" className="group flex flex-col gap-1 transition-colors">
            <span className="text-xs text-slate-400">Previous</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Installation
            </span>
          </Link>
          <Link href="/docs/dark-mode" className="group flex flex-col items-end gap-1 transition-colors">
            <span className="text-xs text-slate-400">Next</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Dark Mode
            </span>
          </Link>
        </div>
      </div>
    </DocsPageLayout>
  );
}
