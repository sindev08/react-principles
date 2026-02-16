import { useState } from "react";
import { Link } from "react-router-dom";
import { DocsHeader, DocsSidebar, MobileNav } from "@/components/docs";
import {
  RECIPES,
  CATEGORIES,
  CARDS_PER_PAGE,
  type CategoryType,
  type Recipe,
} from "@react-principles/shared/cookbook";

export function CookbookPage() {
  const [activeCategory, setActiveCategory] = useState<CategoryType>("All Patterns");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered =
    activeCategory === "All Patterns"
      ? RECIPES
      : RECIPES.filter((r) => r.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE,
  );

  const handleCategoryChange = (category: CategoryType) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 antialiased min-h-screen">
      <DocsHeader />
      <div className="mx-auto flex max-w-[1440px] px-6 lg:px-10">
        <DocsSidebar />
        <main className="flex-1 min-w-0 px-0 py-8 lg:px-12 lg:py-10">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
            <span className="hover:text-primary cursor-pointer transition-colors">
              Guide
            </span>
            <span className="material-symbols-outlined text-[14px]">
              chevron_right
            </span>
            <span className="font-medium text-slate-900 dark:text-white">
              Cookbook
            </span>
          </nav>

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-6 mb-10 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Developer Cookbook
              </h1>
              <p className="text-lg leading-relaxed text-slate-500 dark:text-slate-400">
                Accelerate your workflow with production-ready patterns,
                reference architectures, and reusable boilerplate code.
              </p>
            </div>
            <button className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90">
              <span className="material-symbols-outlined text-[20px]">add</span>
              Submit Recipe
            </button>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center gap-3 pb-6 mb-8 border-b border-slate-200 dark:border-[#1f2937]">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={
                  activeCategory === cat
                    ? "px-4 py-2 text-sm font-semibold text-white rounded-full bg-primary shadow-sm"
                    : "px-4 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 rounded-full border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] hover:border-primary hover:text-primary transition-all"
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Recipe Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center justify-between py-6 mt-12 border-t border-slate-200 dark:border-[#1f2937] sm:flex-row">
              <p className="mb-4 text-sm text-slate-500 sm:mb-0">
                Showing {(currentPage - 1) * CARDS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * CARDS_PER_PAGE, filtered.length)} of{" "}
                {filtered.length} patterns
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 dark:border-[#1f2937] p-2 text-slate-500 transition-all hover:bg-slate-50 dark:hover:bg-[#161b22] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage
                          ? "flex h-10 w-10 items-center justify-center rounded-lg bg-primary font-bold text-white"
                          : "flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-[#161b22]"
                      }
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 dark:border-[#1f2937] p-2 text-slate-500 transition-all hover:bg-slate-50 dark:hover:bg-[#161b22] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 dark:border-[#1f2937] bg-white dark:bg-[#161b22] shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
      <div
        className="relative flex h-48 items-center justify-center"
        style={{ backgroundImage: recipe.gradient }}
      >
        <span className="material-symbols-outlined text-[64px] text-white opacity-30 transition-transform duration-300 group-hover:scale-110">
          {recipe.icon}
        </span>
        <div className="absolute left-4 top-4 flex gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          {recipe.title}
        </h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
          {recipe.description}
        </p>
        <Link
          to={`/cookbook/${recipe.slug}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/5 dark:bg-primary/10 py-2.5 font-semibold text-primary transition-all group-hover:bg-primary group-hover:text-white"
        >
          View Recipe
          <span className="material-symbols-outlined text-[18px]">
            arrow_forward
          </span>
        </Link>
      </div>
    </div>
  );
}
