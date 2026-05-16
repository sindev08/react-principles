import Link from "next/link";

import { Button } from "@/ui/Button";
import { cn } from "@/shared/utils/cn";

const SKILL_CHIPS = [
  { name: "/reactprinciples-review", category: "review" },
  { name: "/reactprinciples-component", category: "scaffold" },
  { name: "/reactprinciples-hook", category: "scaffold" },
  { name: "/reactprinciples-store", category: "scaffold" },
  { name: "/reactprinciples-query", category: "scaffold" },
  { name: "/reactprinciples-form", category: "scaffold" },
] as const;

const CATEGORY_CLASSES: Record<string, string> = {
  review: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  scaffold:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const FEATURES = [
  {
    icon: "terminal",
    label: "10 invocable skills — review code, scaffold components, hooks, forms",
  },
  {
    icon: "description",
    label: "llms.txt — drop the entire cookbook into any AI context window",
  },
  {
    icon: "all_inclusive",
    label: "Works across Claude Code, Cursor, Copilot, and any Agent Skills tool",
  },
  {
    icon: "package",
    label: "One install command — npx skills add sindev08/react-principles-skills",
  },
];

export function AICorpusTeaserSection() {
  return (
    <section
      id="ai-corpus"
      className="relative overflow-hidden bg-white px-6 py-24 dark:bg-slate-900"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left column — visual mock */}
          <div className="relative order-2 md:order-1">
            <div className="absolute inset-0 -z-10 scale-75 rounded-full bg-primary/5 blur-3xl" />
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-white/5 dark:bg-slate-950">
              {/* Terminal header */}
              <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/5 dark:bg-slate-900">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 font-mono text-xs text-slate-500">
                  install
                </span>
              </div>

              {/* Terminal body */}
              <div className="bg-slate-950 px-5 py-4 font-mono text-sm text-slate-100">
                <div className="mb-2">
                  <span className="text-primary">$</span>{" "}
                  <span className="text-slate-100">
                    npx skills add sindev08/react-principles-skills
                  </span>
                </div>
                <div className="text-slate-500">
                  ✓ Installed 10 skills to ~/.claude/skills/
                </div>
              </div>

              {/* Skills list */}
              <div className="border-t border-slate-200 p-5 dark:border-white/5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Available skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {SKILL_CHIPS.map((skill) => (
                    <span
                      key={skill.name}
                      className={cn(
                        "rounded-full px-3 py-1 font-mono text-xs font-medium",
                        CATEGORY_CLASSES[skill.category],
                      )}
                    >
                      {skill.name}
                    </span>
                  ))}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    +4 more
                  </span>
                </div>
              </div>

              {/* llms.txt callout */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/5 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base text-primary">
                      description
                    </span>
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      llms.txt
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    ~5K / ~17K tokens
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column — copy */}
          <div className="order-1 md:order-2">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/10">
              <span className="material-symbols-outlined text-base">
                auto_awesome
              </span>
              AI Corpus
            </div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Your AI tools,
              <br />
              React Principles–aware.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              The cookbook compiled for AI assistants. Drop our principles into
              any AI context window, or install invocable skills that scaffold
              and review code following documented patterns.
            </p>
            <ul className="mb-10 space-y-4">
              {FEATURES.map((feature) => (
                <li
                  key={feature.label}
                  className="flex items-start gap-3 text-slate-700 dark:text-slate-300"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[18px]">
                      {feature.icon}
                    </span>
                  </span>
                  <span className="pt-1">{feature.label}</span>
                </li>
              ))}
            </ul>
            <Link href="/ai">
              <Button variant="primary" size="md">
                Explore the AI corpus
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
