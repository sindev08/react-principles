import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import type { Framework } from "@/features/cookbook/components/CookbookListPage";

const LAST_UPDATED = "Feb 26, 2026";

const TOC_ITEMS = [
  { label: "Why This Cookbook", href: "#why" },
  { label: "How Recipes Work", href: "#structure" },
  { label: "Folder Structure", href: "#folders" },
  { label: "Conventions", href: "#conventions" },
];

const RECIPE_STEPS = [
  {
    step: "01",
    label: "Principle",
    description: "The core idea behind the pattern — why it exists and what problem it solves.",
  },
  {
    step: "02",
    label: "Rules",
    description: "The do's and don'ts. Practical guidelines distilled from real-world usage.",
  },
  {
    step: "03",
    label: "Pattern",
    description: "The abstract structure. A minimal code example showing the shape of the solution.",
  },
  {
    step: "04",
    label: "Implementation",
    description: "The full working code. Specific to your chosen framework (Next.js or Vite).",
  },
  {
    step: "05",
    label: "Live Demo",
    description: "An interactive example you can explore directly in the browser.",
  },
];

const FOLDER_STRUCTURE = `src/
├── features/
│   └── [feature]/
│       ├── components/    — UI components for this feature
│       ├── hooks/         — Query & mutation hooks (co-located)
│       └── stores/        — Zustand stores (if needed)
├── shared/
│   ├── components/        — Cross-feature UI components
│   ├── hooks/             — Pure UI hooks (no API calls)
│   └── types/             — Shared TypeScript types
├── lib/                   — API client, query keys, mock data
└── ui/                    — Design system primitives`;

const CONVENTIONS = [
  { label: "TypeScript", value: "strict: true — no any, use unknown and narrow" },
  { label: "Components", value: "PascalCase — UserTable.tsx, AuthForm.tsx" },
  { label: "Hooks", value: "use prefix — useUsers.ts, useCreateUser.ts" },
  { label: "Stores", value: "use + domain + Store — useAppStore.ts" },
  { label: "Handlers", value: "handle + verb — handleSubmit, handleChange" },
  { label: "Dark mode", value: "Tailwind dark: prefix, class-based toggle" },
];

const LAYERS = [
  {
    label: "SOLID Principles",
    sublabel: "The why",
    description:
      "Abstract design philosophy. Guides how code should be shaped — single responsibility, open for extension, closed for modification.",
    color: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/50",
  },
  {
    label: "Design Patterns",
    sublabel: "The what",
    description:
      "Proven solutions to recurring problems. Concrete, reusable structures that apply SOLID principles in practice.",
    color: "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-900/50",
  },
  {
    label: "Cookbook",
    sublabel: "The how",
    description:
      "Actionable recipes that show patterns in real code. Step-by-step, framework-specific, immediately usable.",
    color: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-900/50",
  },
];

interface CookbookFoundationPageProps {
  framework: Framework;
}

export function CookbookFoundationPage({ framework }: CookbookFoundationPageProps) {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center justify-between gap-2 text-sm font-medium text-slate-500">
          <div className="flex items-center gap-2">
            <Link href={`/${framework}/cookbook`} className="hover:text-primary transition-colors">
              Cookbook
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-slate-900 dark:text-white">Foundation</span>
          </div>
          <span className="shrink-0 text-xs text-slate-400">Updated {LAST_UPDATED}</span>
        </nav>

        {/* Page Header */}
        <div className="pb-10 mb-12 border-b border-slate-200 dark:border-[#1f2937]">
          <div className="flex items-center gap-3 mb-4">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
              Start Here
            </span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl mb-4">
            React Principles Foundation
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Before diving into recipes, here's everything you need to know about how this cookbook
            is structured and why it was built this way.
          </p>
        </div>

        {/* Section 1: Why */}
        <section className="mb-16" id="why">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Why This Cookbook
          </h2>
          <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
            <p>
              Most resources teach React in isolation — isolated components, isolated hooks,
              isolated patterns. Real applications need structure, conventions, and a shared
              understanding of <em>why</em> things are built a certain way.
            </p>
            <p>This cookbook connects three layers that usually live in separate places:</p>
            <div className="grid gap-4 mt-6">
              {LAYERS.map(({ label, sublabel, description, color }) => (
                <div key={label} className={`p-5 rounded-xl border ${color}`}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="font-bold text-slate-900 dark:text-white">{label}</span>
                    <span className="text-xs font-medium text-slate-400">— {sublabel}</span>
                  </div>
                  <p className="text-sm">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 2: Recipe Structure */}
        <section className="mb-16" id="structure">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            How Recipes Work
          </h2>
          <p className="mb-8 text-slate-600 dark:text-slate-400 leading-relaxed">
            Every recipe follows the same five-step structure. Each step builds on the previous,
            taking you from concept to working code.
          </p>
          <div className="space-y-1">
            {RECIPE_STEPS.map(({ step, label, description }, i) => (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                    <span className="text-sm font-bold">{step}</span>
                  </div>
                  {i < RECIPE_STEPS.length - 1 && (
                    <div className="my-1 h-6 w-px bg-slate-200 dark:bg-[#1f2937]" />
                  )}
                </div>
                <div className="pb-4">
                  <span className="block font-bold text-slate-900 dark:text-white mb-1">
                    {label}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{description}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Folder Structure */}
        <section className="mb-16" id="folders">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Folder Structure</h2>
            <span className="rounded-full border border-slate-200 dark:border-[#1f2937] px-2.5 py-0.5 text-xs font-medium text-slate-400">
              reference
            </span>
          </div>
          <p className="mb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
            Examples in this cookbook use the structure below. It's not a mandate — adapt it to
            your team's conventions. The goal is to show one coherent way everything fits together.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-[#0d1117] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1f2937]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#2d3748]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2d3748]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#2d3748]" />
              <span className="ml-2 text-xs font-mono text-slate-500">project structure</span>
            </div>
            <pre className="overflow-x-auto p-5 text-sm font-mono leading-relaxed text-slate-300">
              <code>{FOLDER_STRUCTURE}</code>
            </pre>
          </div>
        </section>

        {/* Section 4: Conventions */}
        <section className="mb-16" id="conventions">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Conventions</h2>
          <p className="mb-6 text-slate-600 dark:text-slate-400 leading-relaxed">
            Code examples across all recipes follow these conventions consistently.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] overflow-hidden divide-y divide-slate-100 dark:divide-[#1f2937]">
            {CONVENTIONS.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-start gap-4 px-5 py-4 bg-white dark:bg-[#161b22]"
              >
                <span className="shrink-0 w-28 text-xs font-bold uppercase tracking-wide text-slate-400">
                  {label}
                </span>
                <span className="text-sm font-mono text-slate-700 dark:text-slate-300">{value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="flex items-center justify-between gap-6 p-6 rounded-xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <div>
            <p className="font-bold text-slate-900 dark:text-white mb-1">Ready to start?</p>
            <p className="text-sm text-slate-500">Browse all recipes in the cookbook.</p>
          </div>
          <Link
            href={`/${framework}/cookbook`}
            className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary font-semibold text-white text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
          >
            Browse Recipes
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </DocsPageLayout>
  );
}
