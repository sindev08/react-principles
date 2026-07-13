import Link from "next/link";

import { Button } from "@/ui/Button";
import { cn } from "@/shared/utils/cn";

const CAPABILITY_CHIPS = [
  { name: "get_recipe", category: "mcp" },
  { name: "get_component", category: "mcp" },
  { name: "search_recipes", category: "mcp" },
  { name: "/reactprinciples-review", category: "skill" },
  { name: "/reactprinciples-form", category: "skill" },
] as const;

const CATEGORY_CLASSES: Record<string, string> = {
  mcp: "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary",
  skill:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
};

const FEATURES = [
  {
    icon: "bolt",
    label:
      "One command wires your project in — AGENTS.md, MCP server, and skills",
  },
  {
    icon: "hub",
    label: "Your AI pulls recipes and real component source live over MCP",
  },
  {
    icon: "autorenew",
    label: "Updates reach your tools automatically — no copy-paste, no re-sync",
  },
  {
    icon: "all_inclusive",
    label: "Works across Claude Code, Cursor, Copilot, and any MCP tool",
  },
];

const SETUP_LINES = [
  "AGENTS.md — principles context",
  ".mcp.json — reactprinciples server",
  "Skills ready",
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
                  setup
                </span>
              </div>

              {/* Terminal body */}
              <div className="bg-slate-950 px-5 py-4 font-mono text-sm text-slate-100">
                <div className="mb-3">
                  <span className="text-primary">$</span>{" "}
                  <span className="text-slate-100">npx react-principles init</span>
                </div>
                {SETUP_LINES.map((line) => (
                  <div key={line} className="text-slate-400">
                    <span className="text-green-400">✓</span> {line}
                  </div>
                ))}
              </div>

              {/* Capabilities */}
              <div className="border-t border-slate-200 p-5 dark:border-white/5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Your AI can now
                </p>
                <div className="flex flex-wrap gap-2">
                  {CAPABILITY_CHIPS.map((chip) => (
                    <span
                      key={chip.name}
                      className={cn(
                        "rounded-full px-3 py-1 font-mono text-xs font-medium",
                        CATEGORY_CLASSES[chip.category],
                      )}
                    >
                      {chip.name}
                    </span>
                  ))}
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    +8 more
                  </span>
                </div>
              </div>

              {/* Always-current callout */}
              <div className="border-t border-slate-200 bg-slate-50 px-5 py-4 dark:border-white/5 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-primary">
                    autorenew
                  </span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Always current
                  </span>
                  <span className="ml-auto text-xs text-slate-500 dark:text-slate-400">
                    live from reactprinciples.dev
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
              AI Ecosystem
            </div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              One command.
              <br />
              Your AI already knows the rules.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Run <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">npx react-principles init</code> and
              your project is wired into the ecosystem: your AI follows the
              patterns, looks up recipes, and pulls real component source on its
              own — always in sync with the cookbook.
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
                Explore the AI setup
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
