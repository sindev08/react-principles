import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";

const TOC_ITEMS = [
  { label: "Theme Tokens", href: "#tokens" },
  { label: "Dark Mode", href: "#dark-mode" },
  { label: "Typography", href: "#typography" },
  { label: "Customize", href: "#customize" },
];

const THEME_TOKENS = `/* src/app/globals.css */
@import "tailwindcss";

@custom-variant dark (&:is(.dark *));

@theme {
  --color-primary: #4628f1;
  --color-background-light: #f6f6f8;
  --color-background-dark: #020617;
  --font-display: Inter, sans-serif;
}

:root {
  --background: #f6f6f8;
  --foreground: #0f172a;
}

.dark {
  --background: #020617;
  --foreground: #e2e8f0;
}`;

const DARK_TOGGLE = `// Theme class on <html>
document.documentElement.classList.add("dark");
document.documentElement.classList.remove("dark");
document.documentElement.classList.toggle("dark");`;

const DARK_USAGE = `<div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937]">
  <h2 className="text-slate-900 dark:text-white">Panel title</h2>
  <p className="text-slate-500 dark:text-slate-400">Muted text</p>
</div>`;

const FONT_USAGE = `/* src/app/globals.css */
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap") layer(base);

/* usage */
<h1 className="font-display font-black tracking-tight">Heading</h1>`;

const CUSTOMIZE_PRIMARY = `/* src/app/globals.css */
@theme {
  --color-primary: #0ea5e9; /* customize brand color */
}`;

const COLOR_TOKENS = [
  {
    name: "--color-primary",
    value: "#4628f1",
    swatch: "bg-[#4628f1]",
    usage: "Buttons, links, active tabs, focus rings",
  },
  {
    name: "--color-background-light",
    value: "#f6f6f8",
    swatch: "bg-background-light border border-slate-200",
    usage: "Light page background",
  },
  {
    name: "--color-background-dark",
    value: "#020617",
    swatch: "bg-background-dark",
    usage: "Dark page background",
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
            The project uses Tailwind CSS v4. Theme tokens and custom variants live in
            <code className="mx-1 font-mono text-sm text-primary">src/app/globals.css</code>
            with a class-based dark mode strategy.
          </p>
        </div>

        <section id="tokens" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Theme Tokens</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Core color and font tokens are defined through
            <code className="mx-1 font-mono text-xs text-primary">@theme</code>.
            Runtime page colors use
            <code className="mx-1 font-mono text-xs text-primary">:root</code> and
            <code className="mx-1 font-mono text-xs text-primary">.dark</code>
            CSS variables for background/foreground.
          </p>

          <div className="space-y-3 mb-8">
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

          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Surface colors are intentionally explicit in component classes for predictable design output:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
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

          <CodeBlock filename="src/app/globals.css" copyText={THEME_TOKENS}>
            {THEME_TOKENS}
          </CodeBlock>
        </section>

        <section id="dark-mode" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dark Mode</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Dark mode is class-based. The
            <code className="mx-1 font-mono text-xs text-primary">dark</code>
            class on
            <code className="mx-1 font-mono text-xs text-primary">&lt;html&gt;</code>
            activates all
            <code className="mx-1 font-mono text-xs text-primary">dark:</code>
            variants.
          </p>

          <div className="space-y-4">
            <CodeBlock filename="Theme class toggle" copyText={DARK_TOGGLE}>
              {DARK_TOGGLE}
            </CodeBlock>
            <CodeBlock filename="Component usage" copyText={DARK_USAGE}>
              {DARK_USAGE}
            </CodeBlock>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 p-4">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v4m0 2v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              The navbar theme toggle persists preference in
              <code className="mx-1 font-mono text-xs">localStorage</code>
              and toggles the
              <code className="mx-1 font-mono text-xs">dark</code>
              class before paint to avoid FOUC.
            </p>
          </div>
        </section>

        <section id="typography" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Typography</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Inter is the display and body font for this project. It is loaded in global CSS and registered as
            <code className="mx-1 font-mono text-xs text-primary">font-display</code>.
          </p>

          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 space-y-4 mb-4">
            {[
              { cls: "text-4xl font-black tracking-tight", label: "font-black text-4xl", sample: "Heading 1" },
              { cls: "text-2xl font-bold", label: "font-bold text-2xl", sample: "Heading 2" },
              { cls: "text-lg font-semibold", label: "font-semibold text-lg", sample: "Heading 3" },
              { cls: "text-base", label: "text-base", sample: "Body paragraph text" },
              { cls: "text-sm text-slate-500 dark:text-slate-400", label: "text-sm text-slate-500", sample: "Muted helper text" },
              { cls: "text-xs font-mono text-primary", label: "font-mono text-xs", sample: "inline code" },
            ].map(({ cls, label, sample }) => (
              <div key={label} className="flex items-baseline justify-between gap-4 border-b border-slate-100 dark:border-[#1f2937] pb-3 last:border-0 last:pb-0">
                <span className={`${cls} text-slate-900 dark:text-white shrink-0`}>{sample}</span>
                <code className="text-[10px] font-mono text-slate-400 text-right">{label}</code>
              </div>
            ))}
          </div>

          <CodeBlock filename="src/app/globals.css" copyText={FONT_USAGE}>
            {FONT_USAGE}
          </CodeBlock>
        </section>

        <section id="customize" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Customize</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            To change brand color globally, update
            <code className="mx-1 font-mono text-xs text-primary">--color-primary</code>
            in the
            <code className="mx-1 font-mono text-xs text-primary">@theme</code>
            block.
          </p>

          <CodeBlock filename="src/app/globals.css" copyText={CUSTOMIZE_PRIMARY}>
            {CUSTOMIZE_PRIMARY}
          </CodeBlock>

          <div className="mt-6 space-y-3">
            {[
              { label: "Token source", value: "Single source in src/app/globals.css" },
              { label: "Mode strategy", value: "Class-based dark mode using @custom-variant dark" },
              { label: "Runtime behavior", value: "Theme preference persisted in localStorage" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-3 rounded-xl border border-slate-100 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] px-4 py-3">
                <span className="text-xs font-semibold text-primary shrink-0 mt-0.5 w-28">{label}</span>
                <span className="text-xs text-slate-600 dark:text-slate-400">{value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
