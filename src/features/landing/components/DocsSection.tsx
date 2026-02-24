import { StatusBadge } from "@/features/cookbook/components/StatusBadge";
import { StepCard } from "@/features/cookbook/components/StepCard";

const STEPS = [
  {
    step: "01. Why",
    title: "The Motivation",
    description:
      "Understanding the problem first. We define exactly which architectural bottleneck this pattern solves.",
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
      "The pure, abstract implementation of the pattern, decoupled from any specific feature.",
  },
  {
    step: "04. Real World",
    title: "Implementation",
    description:
      "Connecting the pattern to Next.js or Vite to see it working in a complex production environment.",
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

        <div className="grid gap-8 md:grid-cols-4">
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
