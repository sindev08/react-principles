import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "ThemeToggle", href: "#toggle" },
  { label: "System Preference", href: "#system" },
  { label: "Writing Dark Styles", href: "#writing" },
  { label: "Gotchas", href: "#gotchas" },
];

const ZUSTAND_STORE = `// stores/useAppStore.ts
type Theme = "light" | "dark";

export const useAppStore = create<AppState>((set) => ({
  theme: "light",
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === "light" ? "dark" : "light",
    })),
  setTheme: (theme) => set({ theme }),
  // ...
}));`;

const TOGGLE_COMPONENT = `// components/landing/ThemeToggle.tsx
export function ThemeToggle() {
  const { theme, toggleTheme } = useAppStore();

  // Sync state → <html> class + localStorage
  useEffect(() => {
    const root = document.documentElement;
    theme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Init: read localStorage → fallback to system preference
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      useAppStore.getState().setTheme(stored);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      useAppStore.getState().setTheme("dark");
    }
  }, []);

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme">
      <span className="material-symbols-outlined">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}`;

const CSS_VARS = `/* app/globals.css (Next.js) | src/index.css (Vite) */
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

const DARK_WRITING = `// ✅ Standard dark mode — use dark: prefix
<div className="bg-white dark:bg-[#161b22]">
  <h2 className="text-slate-900 dark:text-white">Title</h2>
  <p className="text-slate-500 dark:text-slate-400">Subtitle</p>
  <div className="border-slate-200 dark:border-[#1f2937]" />
</div>

// ✅ Conditional with cn()
import { cn } from "@react-principles/shared/utils";

<div className={cn(
  "rounded-lg border p-4",
  "bg-white dark:bg-[#161b22]",
  "border-slate-200 dark:border-[#1f2937]",
  isActive && "ring-2 ring-primary"
)} />`;

const FORCED_PREVIEW = `// ✅ Forced-theme preview (no dark: prefix)
// Used in docs "Theme Preview" sections to show both themes side-by-side
// regardless of the app's current theme setting.

function ThemedPreview({ theme }: { theme: "light" | "dark" }) {
  const bg = theme === "dark" ? "bg-[#161b22]" : "bg-white";
  const text = theme === "dark" ? "text-white" : "text-slate-900";

  return (
    // No dark: prefix here — hardcoded classes only
    <div className={\`\${bg} rounded-xl p-4\`}>
      <p className={text}>Always renders as specified theme</p>
    </div>
  );
}`;

// ─── Flow steps ───────────────────────────────────────────────────────────────

const FLOW_STEPS = [
  { step: "01", label: "User clicks toggle", detail: "ThemeToggle calls toggleTheme()" },
  { step: "02", label: "Zustand updates", detail: "theme state flips light ↔ dark" },
  { step: "03", label: "useEffect fires", detail: "classList.add/remove('dark') on <html>" },
  { step: "04", label: "Tailwind activates", detail: "All dark: variants become active" },
  { step: "05", label: "localStorage saved", detail: "Preference persists across sessions" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DarkModePage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Getting Started</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Dark Mode</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Dark Mode
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Dark mode is managed by a Zustand store, persisted to localStorage, and applied
            via Tailwind's class strategy. The toggle button in the navbar handles everything.
          </p>
        </div>

        {/* 01 How It Works */}
        <section id="how-it-works" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">How It Works</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Five steps from click to render:
          </p>

          <div className="space-y-2 mb-8">
            {FLOW_STEPS.map(({ step, label, detail }) => (
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

          <CodeBlock filename="stores/useAppStore.ts" copyText={ZUSTAND_STORE}>
            {ZUSTAND_STORE}
          </CodeBlock>
        </section>

        {/* 02 ThemeToggle */}
        <section id="toggle" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">ThemeToggle</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            The <code className="font-mono text-xs text-primary">ThemeToggle</code> component lives in the navbar.
            It bridges Zustand state to the DOM and handles initialization on mount.
          </p>
          <CodeBlock filename="components/landing/ThemeToggle.tsx" copyText={TOGGLE_COMPONENT}>
            {TOGGLE_COMPONENT}
          </CodeBlock>

          <div className="mt-6">
            <CodeBlock filename="globals.css — CSS variable switch" copyText={CSS_VARS}>
              {CSS_VARS}
            </CodeBlock>
          </div>
        </section>

        {/* 03 System Preference */}
        <section id="system" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">System Preference</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            On first visit (no localStorage entry), the app reads the OS preference via
            <code className="mx-1 font-mono text-xs text-primary">prefers-color-scheme</code>.
            Subsequent visits use the stored value.
          </p>

          <div className="space-y-3">
            {[
              {
                label: "First visit, OS = dark",
                value: "Reads prefers-color-scheme: dark → sets theme to dark",
                icon: "🌙",
              },
              {
                label: "First visit, OS = light",
                value: "prefers-color-scheme: light → default light theme",
                icon: "☀️",
              },
              {
                label: "Return visit",
                value: "localStorage[\"theme\"] overrides everything",
                icon: "💾",
              },
            ].map(({ label, value, icon }) => (
              <div key={label} className="flex gap-4 rounded-xl border border-slate-100 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] px-4 py-3">
                <span className="text-lg shrink-0">{icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{label}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 04 Writing Dark Styles */}
        <section id="writing" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Writing Dark Styles</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Add <code className="font-mono text-xs text-primary">dark:</code> variants alongside the light class. Use <code className="font-mono text-xs text-primary">cn()</code> from the shared utils for conditional merging.
          </p>
          <CodeBlock filename="Dark mode in components" copyText={DARK_WRITING}>
            {DARK_WRITING}
          </CodeBlock>

          {/* Quick reference */}
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
                  { p: "Page background", l: "bg-background-light", d: "dark:bg-background-dark" },
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

        {/* 05 Gotchas */}
        <section id="gotchas" className="mb-14">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Gotchas</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm leading-relaxed">
            Two patterns that can cause confusion.
          </p>

          {/* Forced theme preview */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Forced-theme previews</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              The "Theme Preview" section on every component docs page renders both light and dark appearances
              simultaneously — regardless of the app's current theme. This requires <strong>hardcoded classes only</strong>,
              no <code className="font-mono text-xs text-primary">dark:</code> prefix.
            </p>
            <CodeBlock filename="Forced-theme pattern" copyText={FORCED_PREVIEW}>
              {FORCED_PREVIEW}
            </CodeBlock>
          </div>

          {/* SSR flash */}
          <div className="mb-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Theme flash on hard reload</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Since the theme is initialised in a React <code className="font-mono text-xs text-primary">useEffect</code>,
              there may be a brief flash on first paint if the stored preference is dark but the initial HTML renders with light styles.
              A common fix is to inline a small script in <code className="font-mono text-xs text-primary">&lt;head&gt;</code> that reads localStorage before React hydrates.
            </p>
            <div className="flex gap-3 rounded-xl border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-900/10 p-4">
              <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" viewBox="0 0 16 16" fill="none">
                <path d="M8 1.5L1.5 13h13L8 1.5zM8 6v3.5m0 1.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-sm text-amber-800 dark:text-amber-300">
                This project doesn't implement the anti-flash script — it's a reference implementation, not a production app. For production, add a blocking script in <code className="font-mono text-xs">&lt;head&gt;</code> that checks localStorage and sets the class before render.
              </p>
            </div>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
