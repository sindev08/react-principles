import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Color Tokens", href: "#colors" },
  { label: "Dark Mode", href: "#dark-mode" },
  { label: "Typography", href: "#typography" },
  { label: "Customizing", href: "#customizing" },
];

const TAILWIND_CONFIG = `// tailwind.config.js
module.exports = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4628F1",
        "background-light": "#f6f6f8",
        "background-dark": "#020617",
      },
      fontFamily: {
        display: ["Inter", "sans-serif"],
      },
    },
  },
};`;

const CUSTOM_COLOR = `// tailwind.config.js — change primary color
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: "#0ea5e9", // change to any hex value
      },
    },
  },
};`;

const DARK_TOGGLE = `// Toggle dark mode by adding/removing the "dark" class on <html>
document.documentElement.classList.add("dark");    // enable
document.documentElement.classList.remove("dark"); // disable
document.documentElement.classList.toggle("dark"); // toggle`;

const DARK_USAGE = `// Using dark mode in components
<div className="bg-white dark:bg-[#161b22]">
  <p className="text-slate-900 dark:text-white">Hello</p>
  <span className="text-slate-500 dark:text-slate-400">Subtitle</span>
</div>`;

const FONT_USAGE = `// Font is applied globally via CSS
body {
  font-family: "Inter", sans-serif;
}

// Use the display family in Tailwind
<h1 className="font-display font-black">Heading</h1>`;

// ─── Color swatch data ────────────────────────────────────────────────────────

const COLOR_TOKENS = [
  {
    name: "primary",
    value: "#4628F1",
    light: "bg-[#4628F1]",
    usage: "Buttons, active states, links, focus rings",
  },
  {
    name: "background-light",
    value: "#f6f6f8",
    light: "bg-[#f6f6f8] border border-slate-200",
    usage: "App background in light mode",
  },
  {
    name: "background-dark",
    value: "#020617",
    light: "bg-[#020617]",
    usage: "App background in dark mode",
  },
];

const SURFACE_COLORS = [
  { label: "Panel light", hex: "#ffffff", cls: "bg-white border border-slate-200", desc: "Card / dialog surface" },
  { label: "Panel dark", hex: "#161b22", cls: "bg-[#161b22]", desc: "Card / dialog surface" },
  { label: "Subtle dark", hex: "#0d1117", cls: "bg-[#0d1117]", desc: "Inner panels, code blocks" },
  { label: "Border dark", hex: "#1f2937", cls: "bg-[#1f2937]", desc: "Dividers, borders" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ThemingPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Getting Started</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Theming</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Theming
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            All components are styled with Tailwind CSS. Colors, dark mode, and typography
            are configured in <code className="font-mono text-sm text-primary">tailwind.config.js</code> — no CSS variables or runtime tokens.
          </p>
        </div>

        {/* 01 Color Tokens */}
        <section id="colors" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Color Tokens</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Three custom colors are registered in the Tailwind theme. They are available as
            utility classes anywhere in the project.
          </p>

          {/* Primary + backgrounds */}
          <div className="space-y-3 mb-8">
            {COLOR_TOKENS.map((c) => (
              <div key={c.name} className="flex items-center gap-4 rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-4">
                <div className={`h-12 w-12 rounded-lg shrink-0 ${c.light}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <code className="text-sm font-mono font-semibold text-primary">{c.name}</code>
                    <span className="text-xs text-slate-400 font-mono">{c.value}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{c.usage}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Hardcoded surface colors note */}
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Component surfaces use <strong className="text-slate-700 dark:text-slate-300">hardcoded hex values</strong> directly in class names rather than named tokens. These are the de-facto surface palette used throughout:
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SURFACE_COLORS.map((s) => (
              <div key={s.label} className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#1f2937]">
                <div className={`h-10 ${s.cls}`} />
                <div className="bg-white dark:bg-[#161b22] px-2.5 py-2">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">{s.label}</p>
                  <p className="text-[10px] font-mono text-slate-400">{s.hex}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <CodeBlock filename="tailwind.config.js" copyText={TAILWIND_CONFIG}>
              {TAILWIND_CONFIG}
            </CodeBlock>
          </div>
        </section>

        {/* 02 Dark Mode */}
        <section id="dark-mode" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Dark Mode</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Dark mode uses Tailwind's <strong className="text-slate-700 dark:text-slate-300">class strategy</strong>. When the
            <code className="mx-1 font-mono text-xs text-primary">dark</code> class is present on
            <code className="ml-1 font-mono text-xs text-primary">&lt;html&gt;</code>,
            all <code className="font-mono text-xs text-primary">dark:</code> variants activate.
          </p>

          <div className="space-y-4">
            <CodeBlock filename="Toggle dark mode" copyText={DARK_TOGGLE}>
              {DARK_TOGGLE}
            </CodeBlock>
            <CodeBlock filename="Usage in components" copyText={DARK_USAGE}>
              {DARK_USAGE}
            </CodeBlock>
          </div>

          <div className="mt-6 flex gap-3 rounded-xl border border-blue-200 dark:border-blue-900/40 bg-blue-50 dark:bg-blue-900/10 p-4">
            <svg className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 5v4m0 2v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              The theme toggle button in the top navbar adds/removes the <code className="font-mono text-xs">dark</code> class on <code className="font-mono text-xs">&lt;html&gt;</code> and persists the preference to <code className="font-mono text-xs">localStorage</code>.
            </p>
          </div>
        </section>

        {/* 03 Typography */}
        <section id="typography" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Typography</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            <strong className="text-slate-700 dark:text-slate-300">Inter</strong> is the sole typeface, loaded from Google Fonts. It's registered as <code className="font-mono text-xs text-primary">font-display</code> in Tailwind.
          </p>

          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 space-y-4 mb-4">
            {[
              { cls: "text-4xl font-black tracking-tight", label: "font-black text-4xl", sample: "Heading 1" },
              { cls: "text-2xl font-bold", label: "font-bold text-2xl", sample: "Heading 2" },
              { cls: "text-lg font-semibold", label: "font-semibold text-lg", sample: "Heading 3" },
              { cls: "text-base", label: "text-base", sample: "Body text — used for content paragraphs." },
              { cls: "text-sm text-slate-500 dark:text-slate-400", label: "text-sm text-slate-500", sample: "Secondary / muted text" },
              { cls: "text-xs font-mono text-primary", label: "font-mono text-xs", sample: "code snippet inline" },
            ].map(({ cls, label, sample }) => (
              <div key={label} className="flex items-baseline justify-between gap-4 border-b border-slate-100 dark:border-[#1f2937] pb-3 last:border-0 last:pb-0">
                <span className={`${cls} text-slate-900 dark:text-white shrink-0`}>{sample}</span>
                <code className="text-[10px] font-mono text-slate-400 text-right">{label}</code>
              </div>
            ))}
          </div>

          <CodeBlock filename="Font usage" copyText={FONT_USAGE}>
            {FONT_USAGE}
          </CodeBlock>
        </section>

        {/* 04 Customizing */}
        <section id="customizing" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Customizing</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            To change the primary color across all components, update the single value in <code className="font-mono text-xs text-primary">tailwind.config.js</code>. No CSS variables to hunt down.
          </p>

          <CodeBlock filename="tailwind.config.js" copyText={CUSTOM_COLOR}>
            {CUSTOM_COLOR}
          </CodeBlock>

          <div className="mt-6 space-y-3">
            {[
              { label: "Scope", value: "Per-app — each app (nextjs/, vite/) has its own tailwind.config.js" },
              { label: "Shared package", value: "packages/shared uses the consuming app's Tailwind config via content paths" },
              { label: "No runtime theming", value: "Theme changes require a rebuild — this is not a CSS-variables-at-runtime system" },
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
