import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";

const TOC_ITEMS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Setup", href: "#setup" },
  { label: "Theme Toggle", href: "#toggle" },
  { label: "Writing Dark Styles", href: "#writing" },
  { label: "Gotchas", href: "#gotchas" },
];

const CUSTOM_VARIANT = `/* globals.css */
@custom-variant dark (&:is(.dark *));`;

const TOGGLE_SIMPLE = `"use client";

import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Init: read localStorage → fallback to system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  // Sync state → <html> class + localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <button onClick={toggle} aria-label="Toggle theme">
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}`;

const DARK_WRITING = `// ✅ Standard dark mode — use dark: prefix
<div className="bg-white dark:bg-[#161b22]">
  <h2 className="text-slate-900 dark:text-white">Title</h2>
  <p className="text-slate-500 dark:text-slate-400">Subtitle</p>
  <div className="border border-slate-200 dark:border-[#1f2937]" />
</div>

// ✅ Conditional with cn()
import { cn } from "@/lib/utils";

<div className={cn(
  "rounded-lg border p-4",
  "bg-white dark:bg-[#161b22]",
  "border-slate-200 dark:border-[#1f2937]",
  isActive && "ring-2 ring-primary"
)} />`;

const ANTI_FLASH = `// app/layout.tsx — add this script to <head> to prevent flash
<script
  dangerouslySetInnerHTML={{
    __html: \`
      (function() {
        var theme = localStorage.getItem('theme');
        if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      })();
    \`,
  }}
/>`;

export default function DarkModePage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/docs/theming" className="cursor-pointer transition-colors hover:text-primary">
            Theming
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Dark Mode</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Dark Mode
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            All components ship with <code className="font-mono text-sm text-primary">dark:</code> variants
            out of the box. You just need to set up class-based dark mode in your project
            and add a toggle.
          </p>
        </div>

        {/* How It Works */}
        <section id="how-it-works" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Adding the <code className="font-mono text-xs text-primary">dark</code> class
            to <code className="font-mono text-xs text-primary">&lt;html&gt;</code> activates
            all <code className="font-mono text-xs text-primary">dark:</code> variants
            across every installed component.
          </p>

          <div className="space-y-2">
            {[
              { step: "01", label: "User clicks toggle", detail: "theme state flips light ↔ dark" },
              { step: "02", label: "classList updated", detail: "classList.toggle('dark') on <html>" },
              { step: "03", label: "Tailwind activates", detail: "All dark: variants become active" },
              { step: "04", label: "localStorage saved", detail: "Preference persists across sessions" },
            ].map(({ step, label, detail }) => (
              <div key={step} className="flex items-start gap-4 rounded-xl border border-slate-100 dark:border-[#1f2937] bg-white dark:bg-[#161b22] px-4 py-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="text-xs font-bold">{step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Setup */}
        <section id="setup" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Setup</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
            Add <code className="font-mono text-xs text-primary">@custom-variant dark</code> to
            your <code className="font-mono text-xs text-primary">globals.css</code>. This tells
            Tailwind to activate <code className="font-mono text-xs text-primary">dark:</code> variants
            when the <code className="font-mono text-xs text-primary">dark</code> class is on any
            ancestor element.
          </p>
          <CodeBlock filename="globals.css" copyText={CUSTOM_VARIANT}>
            {CUSTOM_VARIANT}
          </CodeBlock>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            If you ran <code className="font-mono">npx react-principles-cli@latest init</code>,
            this line is already added to your globals.css.
          </p>
        </section>

        {/* Theme Toggle */}
        <section id="toggle" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Theme Toggle</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            A minimal toggle component using React state. On mount it reads from{" "}
            <code className="font-mono text-xs text-primary">localStorage</code> and falls back
            to the OS preference. Adapt this to your state management solution of choice.
          </p>
          <CodeBlock filename="components/ThemeToggle.tsx" copyText={TOGGLE_SIMPLE}>
            {TOGGLE_SIMPLE}
          </CodeBlock>
        </section>

        {/* Writing Dark Styles */}
        <section id="writing" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Writing Dark Styles</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Add <code className="font-mono text-xs text-primary">dark:</code> variants alongside
            the light class. Use <code className="font-mono text-xs text-primary">cn()</code> for
            conditional merging.
          </p>
          <CodeBlock filename="example.tsx" copyText={DARK_WRITING}>
            {DARK_WRITING}
          </CodeBlock>

          <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Purpose", "Light", "Dark"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {[
                  { p: "Card / panel", l: "bg-white", d: "dark:bg-[#161b22]" },
                  { p: "Inner surface", l: "bg-slate-50", d: "dark:bg-[#0d1117]" },
                  { p: "Border", l: "border-slate-200", d: "dark:border-[#1f2937]" },
                  { p: "Primary text", l: "text-slate-900", d: "dark:text-white" },
                  { p: "Secondary text", l: "text-slate-500", d: "dark:text-slate-400" },
                  { p: "Muted text", l: "text-slate-400", d: "dark:text-slate-500" },
                  { p: "Divider", l: "divide-slate-100", d: "dark:divide-[#1f2937]" },
                ].map(({ p, l, d }) => (
                  <tr key={p} className="hover:bg-slate-50 dark:hover:bg-[#161b22] transition-colors">
                    <td className="px-4 py-2.5 text-xs text-slate-600 dark:text-slate-400">{p}</td>
                    <td className="px-4 py-2.5"><code className="text-xs font-mono text-slate-600 dark:text-slate-400">{l}</code></td>
                    <td className="px-4 py-2.5"><code className="text-xs font-mono text-primary">{d}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Gotchas */}
        <section id="gotchas" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Gotchas</h2>

          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Theme flash on hard reload</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Since the theme is initialised in a React{" "}
              <code className="font-mono text-xs text-primary">useEffect</code>,
              there may be a brief flash on first paint if the stored preference is dark.
              Fix it by inlining a blocking script in{" "}
              <code className="font-mono text-xs text-primary">&lt;head&gt;</code> that reads
              localStorage before React hydrates.
            </p>
            <CodeBlock filename="app/layout.tsx" copyText={ANTI_FLASH}>
              {ANTI_FLASH}
            </CodeBlock>
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-slate-200 pt-8 dark:border-[#1f2937]">
          <Link href="/docs/theming" className="group flex flex-col gap-1 transition-colors">
            <span className="text-xs text-slate-400">Previous</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Theming
            </span>
          </Link>
          <Link href="/docs/accordion" className="group flex flex-col items-end gap-1 transition-colors">
            <span className="text-xs text-slate-400">Next</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Accordion
            </span>
          </Link>
        </div>
      </div>
    </DocsPageLayout>
  );
}
