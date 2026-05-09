import Link from "next/link";

import { cn } from "@/shared/utils/cn";

const FEATURED_RECIPES = [
  {
    slug: "state-taxonomy",
    title: "State Taxonomy",
    description:
      "Three categories of state — local, shared, and server — and exactly which tool handles each one.",
    icon: "account_tree",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    category: "Foundations",
    published: true,
  },
  {
    slug: "component-composition",
    title: "Component Composition",
    description:
      "How components combine and communicate — children props, slot patterns, and why composition beats deep prop drilling.",
    icon: "widgets",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    category: "Foundations",
    published: true,
  },
  {
    slug: "server-state",
    title: "Server State with React Query",
    description:
      "Fetch, cache, and synchronize server data with TanStack Query v5. Pagination, search, and background refetching.",
    icon: "cloud_sync",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    category: "Patterns",
    published: false,
  },
  {
    slug: "form-validation",
    title: "Form Validation with Zod",
    description:
      "Schema-first validation with React Hook Form and Zod. Type-safe, declarative error messages, zero boilerplate.",
    icon: "fact_check",
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    category: "Patterns",
    published: false,
  },
] as const;

const CATEGORY_COLORS: Record<string, string> = {
  Foundations:
    "bg-violet-50 text-violet-700 border-violet-100 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20",
  Patterns:
    "bg-sky-50 text-sky-700 border-sky-100 dark:bg-sky-500/10 dark:text-sky-400 dark:border-sky-500/20",
};

export function CookbookTeaserSection() {
  return (
    <section
      id="cookbook"
      className="relative overflow-hidden bg-white px-6 py-24 dark:bg-slate-900"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary dark:border-primary/20 dark:bg-primary/10">
              <span className="material-symbols-outlined text-base">menu_book</span>
              Cookbook
            </div>
            <h2 className="max-w-xl text-3xl font-black tracking-tight text-slate-900 dark:text-white md:text-4xl">
              Production patterns,<br />not just snippets.
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Each recipe covers the why, the constraints, the pattern, and a real implementation — side by side for Next.js and Vite.
            </p>
          </div>
          <Link
            href="/nextjs/cookbook"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
          >
            View all recipes
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* Recipe cards */}
        <div className="grid gap-6 sm:grid-cols-2">
          {FEATURED_RECIPES.map((recipe) => {
            const cardContent = (
              <div
                className={cn(
                  "group relative flex h-full flex-col rounded-3xl border bg-background-light p-6 shadow-sm transition-all duration-200",
                  "border-slate-200 dark:border-white/10 dark:bg-slate-950",
                  recipe.published && "hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-black/30",
                )}
              >
                {/* Icon */}
                <div
                  className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                  style={{ background: recipe.gradient }}
                >
                  <span className="material-symbols-outlined text-[22px] text-white">
                    {recipe.icon}
                  </span>
                </div>

                {/* Category + status */}
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                      CATEGORY_COLORS[recipe.category] ?? CATEGORY_COLORS["Foundations"],
                    )}
                  >
                    {recipe.category}
                  </span>
                  {!recipe.published && (
                    <span className="rounded-full border border-amber-100 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                      Coming soon
                    </span>
                  )}
                </div>

                {/* Title + description */}
                <h3 className="mb-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  {recipe.title}
                </h3>
                <p className="flex-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
                  {recipe.description}
                </p>

                {/* Footer */}
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-primary">
                  {recipe.published ? (
                    <>
                      Read recipe
                      <span className="material-symbols-outlined text-base transition-transform duration-150 group-hover:translate-x-0.5">
                        arrow_forward
                      </span>
                    </>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-600">
                      Recipe in progress
                    </span>
                  )}
                </div>
              </div>
            );

            return recipe.published ? (
              <Link key={recipe.slug} href={`/nextjs/cookbook/${recipe.slug}`}>
                {cardContent}
              </Link>
            ) : (
              <div key={recipe.slug}>{cardContent}</div>
            );
          })}
        </div>

        {/* Bottom stat bar */}
        <div className="mt-10 flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-4 dark:border-white/5 dark:bg-slate-950">
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            18 recipes across
          </span>
          {["Foundations", "Patterns", "Auth Flows", "Dashboards", "API Integration"].map(
            (cat) => (
              <span
                key={cat}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
              >
                {cat}
              </span>
            ),
          )}
          <Link
            href="/nextjs/cookbook"
            className="ml-auto text-sm font-semibold text-primary hover:underline"
          >
            Browse all →
          </Link>
        </div>
      </div>
    </section>
  );
}
