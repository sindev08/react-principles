import { useState, type PropsWithChildren, type ReactNode } from "react";

export const SAMPLE_OPTIONS = [
  { label: "Design System", value: "design-system", description: "Reusable UI building blocks" },
  { label: "Cookbook", value: "cookbook", description: "Production-ready React patterns" },
  { label: "CLI", value: "cli", description: "Copy-paste component installer" },
  { label: "Playground", value: "playground", description: "Interactive configuration", disabled: true },
];

export const SEARCH_ITEMS = [
  {
    title: "Button",
    href: "/docs/button",
    group: "Docs" as const,
    section: "Components",
    description: "Primary, outline, and ghost actions",
  },
  {
    title: "Form Validation with Zod",
    href: "/nextjs/cookbook/form-validation",
    group: "Cookbook" as const,
    icon: "fact_check",
    description: "Schema-first forms with React Hook Form",
  },
  {
    title: "Tabs",
    href: "/docs/tabs",
    group: "Docs" as const,
    section: "Components",
    description: "Underline and pill variants",
  },
];

export function StorySurface({
  children,
  padded = true,
  className = "",
}: PropsWithChildren<{ padded?: boolean; className?: string }>) {
  return (
    <div
      className={[
        "min-w-[280px] rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xs dark:border-[#1f2937] dark:bg-[#0b0e14] dark:text-slate-100",
        padded ? "p-6" : "",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

export function StatefulWrapper({
  initial = false,
  children,
}: {
  initial?: boolean;
  children: (state: boolean, setState: (next: boolean) => void) => ReactNode;
}) {
  const [open, setOpen] = useState(initial);
  return <>{children(open, setOpen)}</>;
}
