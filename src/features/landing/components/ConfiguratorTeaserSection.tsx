import Link from "next/link";

import { Button } from "@/ui/Button";
import { cn } from "@/shared/utils/cn";

const STYLE_PRESETS = ["Arc", "Edge", "Soleil"] as const;
const FRAMEWORKS = ["Next.js", "Vite"] as const;

const COMPONENT_CHIPS = [
  { name: "Button", selected: true },
  { name: "Card", selected: true },
  { name: "Dialog", selected: true },
  { name: "Input", selected: true },
  { name: "Table", selected: false },
  { name: "Toast", selected: true },
  { name: "Select", selected: false },
  { name: "Badge", selected: true },
];

const STACK_OPTIONS = [
  { label: "Zustand", icon: "store", enabled: true },
  { label: "React Query", icon: "sync", enabled: true },
  { label: "React Hook Form", icon: "edit_note", enabled: true },
  { label: "Monorepo", icon: "folder_copy", enabled: false },
];

const FEATURES = [
  { icon: "palette", label: "3 style presets — Arc, Edge, Soleil" },
  { icon: "devices", label: "Next.js or Vite — pick your framework" },
  { icon: "widgets", label: "45+ UI components to mix and match" },
  { icon: "terminal", label: "Export as CLI preset or copy-paste" },
];

export function ConfiguratorTeaserSection() {
  return (
    <section
      id="configurator"
      className="relative overflow-hidden bg-background-light px-6 py-24 dark:bg-slate-950"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 md:grid-cols-2">

          {/* Left column */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/10">
              <span className="material-symbols-outlined text-base">tune</span>
              Project configurator
            </div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Build your stack,<br />your way.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Configure your style, pick your components, choose your stack — then get a ready-to-use preset you can bootstrap instantly with the CLI or copy-paste directly into your project.
            </p>
            <ul className="mb-10 space-y-4">
              {FEATURES.map((feature) => (
                <li key={feature.label} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <span className="material-symbols-outlined text-[18px]">{feature.icon}</span>
                  </span>
                  {feature.label}
                </li>
              ))}
            </ul>
            <Link href="/create">
              <Button variant="primary" size="md">
                Configure your project
              </Button>
            </Link>
          </div>

          {/* Right column — static configurator mock */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 scale-75 rounded-full bg-primary/5 blur-3xl" />
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/5 dark:bg-slate-900">

              {/* Style preset */}
              <div className="mb-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Style preset
                </p>
                <div className="flex gap-2">
                  {STYLE_PRESETS.map((preset, i) => (
                    <span
                      key={preset}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-sm font-semibold",
                        i === 0
                          ? "bg-primary text-white"
                          : "border border-slate-200 text-slate-500 dark:border-white/10 dark:text-slate-400"
                      )}
                    >
                      {preset}
                    </span>
                  ))}
                </div>
              </div>

              {/* Framework toggle */}
              <div className="mb-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Framework
                </p>
                <div className="flex gap-2">
                  {FRAMEWORKS.map((fw, i) => (
                    <span
                      key={fw}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-semibold",
                        i === 0
                          ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                          : "border border-slate-200 text-slate-400 dark:border-white/10 dark:text-slate-500"
                      )}
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Component chips */}
              <div className="mb-5">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Components
                </p>
                <div className="flex flex-wrap gap-2">
                  {COMPONENT_CHIPS.map((chip) => (
                    <span
                      key={chip.name}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
                        chip.selected
                          ? "bg-primary/10 text-primary"
                          : "border border-slate-200 text-slate-400 dark:border-white/10 dark:text-slate-500"
                      )}
                    >
                      {chip.selected && (
                        <span className="material-symbols-outlined text-[12px]">check</span>
                      )}
                      {chip.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stack toggles */}
              <div className="mb-6">
                <p className="mb-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Stack
                </p>
                <div className="space-y-3">
                  {STACK_OPTIONS.map((option) => (
                    <div key={option.label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                        <span className="material-symbols-outlined text-base text-slate-400">
                          {option.icon}
                        </span>
                        {option.label}
                      </div>
                      {/* Static toggle — decorative only */}
                      <div
                        className={cn(
                          "relative h-5 w-9 rounded-full",
                          option.enabled ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
                        )}
                      >
                        <div
                          className={cn(
                            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm",
                            option.enabled ? "translate-x-4" : "translate-x-0.5"
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Decorative generate button */}
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-center dark:border-primary/15 dark:bg-primary/10">
                <span className="text-sm font-semibold text-primary/50">
                  Generate Preset →
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
