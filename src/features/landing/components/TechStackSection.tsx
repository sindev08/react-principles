import { StackCard } from "@/features/cookbook/components/StackCard";

const STACK_ITEMS = [
  {
    icon: <span className="text-3xl material-symbols-outlined">deployed_code</span>,
    title: "Next.js 16",
    subtitle: "App Router",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">bolt</span>,
    title: "Vite",
    subtitle: "Build System",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">cloud_download</span>,
    title: "TanStack Query",
    subtitle: "Data Fetching",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">table_chart</span>,
    title: "TanStack Table",
    subtitle: "Headless Tables",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">database</span>,
    title: "Zustand",
    subtitle: "State Mgmt",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">edit_square</span>,
    title: "Hook Form",
    subtitle: "Form Logic",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">verified_user</span>,
    title: "Zod",
    subtitle: "Validation",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">palette</span>,
    title: "Tailwind CSS",
    subtitle: "Styling",
  },
  {
    icon: <span className="text-3xl material-symbols-outlined">widgets</span>,
    title: "react-principles",
    subtitle: "UI Library",
  },
];

export function TechStackSection() {
  return (
    <section
      className="px-6 py-24 bg-background-light dark:bg-slate-950"
      id="stack"
    >
      <div className="mx-auto text-center max-w-7xl">
        <h2 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          The Modern Tech Stack
        </h2>
        <p className="mb-16 text-slate-500">
          Curated from the best tools in the React ecosystem.
        </p>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STACK_ITEMS.map((item) => (
            <StackCard
              key={item.title}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
            />
          ))}
          <div className="flex items-center justify-center p-8 border cursor-pointer bg-primary/5 border-primary/10 dark:bg-primary/10 dark:border-primary/20 hover:bg-primary/10 dark:hover:bg-primary/20 group rounded-xl">
            <span className="font-bold text-primary">And more...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
