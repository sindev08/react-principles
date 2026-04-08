import { FeatureCard } from "@/features/cookbook/components/FeatureCard";

const FEATURES = [
  {
    icon: (
      <span className="material-symbols-outlined text-primary">layers</span>
    ),
    title: "Architecture First",
    description: "Decoupled logic that works across different React frameworks.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-primary">monitoring</span>
    ),
    title: "Production Ready",
    description:
      "Battle-tested solutions for state management, data fetching, and forms.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-primary">widgets</span>
    ),
    title: "UI Components",
    description:
      "35 accessible, zero-dependency components built with pure Tailwind CSS.",
  },
  {
    icon: (
      <span className="material-symbols-outlined text-primary">terminal</span>
    ),
    title: "CLI Ready",
    description:
      "Add any component to your project instantly with a single command.",
  },
];

const LAB_ITEMS = [
  "Framework switcher — Next.js ↔ Vite per recipe",
  "Live interactive demo per pattern",
  "Save & bookmark recipes",
  "Fully typed — TypeScript strict mode",
  "Fully searchable — ⌘K",
];

export function WhySection() {
  return (
    <section
      className="px-6 py-24 bg-white dark:bg-slate-950"
      id="why"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-16 md:grid-cols-2">
          {/* Left column */}
          <div>
            <h2 className="mb-6 text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Beyond simple code snippets.
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Most pattern libraries stop at a Gist. We provide the full
              context.
              <br />
              <br />
              React Principles is a collection of{" "}
              <strong>isolated patterns</strong> combined with{" "}
              <strong>real-world implementations</strong>. We show you how a
              pattern behaves in a Next.js 16 Server Component environment
              versus a Vite-based Client-side application.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {FEATURES.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>

          {/* Right column — Lab card */}
          <div className="relative">
            <div className="absolute inset-0 transform scale-75 rounded-full bg-primary/5 -z-10 blur-3xl" />
            <div className="p-8 border rounded-2xl shadow-2xl bg-background-light dark:bg-slate-900 border-slate-200 dark:border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-lg shadow-xs bg-white dark:bg-slate-800">
                  <span className="material-symbols-outlined text-primary">
                    auto_awesome
                  </span>
                </div>
                <h4 className="text-xl italic font-black tracking-tight uppercase text-slate-900 dark:text-white">
                  What's Inside
                </h4>
              </div>
              <ul className="space-y-4">
                {LAB_ITEMS.map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-slate-700 dark:text-slate-300"
                  >
                    <span className="text-xl material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
