import { StatusBadge } from "@/features/cookbook/components/StatusBadge";
import { StepCard } from "@/features/cookbook/components/StepCard";

const STEPS = [
  {
    step: "01. Principle",
    title: "The Why",
    description:
      "The architectural reason this pattern exists — which problem it solves and what goes wrong without it.",
  },
  {
    step: "02. Rules",
    title: "Constraints",
    description:
      "A set of immutable rules for implementation to ensure consistency and avoid anti-patterns.",
  },
  {
    step: "03. Pattern",
    title: "The Core",
    description:
      "The pure, abstract implementation — decoupled from any specific feature or framework.",
  },
  {
    step: "04. Implementation",
    title: "Real World",
    description:
      "The same pattern applied to Next.js App Router and Vite side by side. Switch frameworks with one click.",
  },
  {
    step: "05. Live Demo",
    title: "Try It",
    description:
      "An interactive sandbox embedded directly in the recipe — no setup, no context switching.",
  },
];

export function DocsSection() {
  return (
    <section
      className="px-6 py-24 bg-background-light dark:bg-slate-950"
      id="docs"
    >
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-end justify-between gap-6 mb-16 md:flex-row">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Systematic Learning
            </h2>
            <p className="text-slate-500">
              Every pattern follows a rigid, helpful structure.
            </p>
          </div>
          <div className="flex gap-2">
            <StatusBadge label="Live Previews" color="green" />
            <StatusBadge label="Source Access" color="blue" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-5">
          {STEPS.map((step) => (
            <StepCard
              key={step.step}
              step={step.step}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
