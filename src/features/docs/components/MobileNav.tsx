"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/shared/stores/useAppStore";
import { cn } from "@/shared/utils/cn";
import { DOCS_NAV } from "./docs-nav";
import { RECIPES } from "@/features/cookbook/data/cookbook-data";

const IS_DEV = process.env.NODE_ENV === "development";

const SORTED_RECIPES = [...RECIPES].sort((a, b) => a.order - b.order);

type Framework = "nextjs" | "vitejs";

function cookbookHref(framework: Framework, slug: string) {
  return `/${framework}/cookbook/${slug}`;
}

export function MobileNav() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const pathname = usePathname();

  const isDocsActive = pathname.startsWith("/docs");
  const cookbookFramework: Framework = pathname.startsWith("/vitejs/") ? "vitejs" : "nextjs";

  return (
    <>
      {/* FAB */}
      <div className="fixed bottom-6 right-6 lg:hidden z-50">
        <button
          onClick={toggleSidebar}
          className="flex items-center justify-center text-white rounded-full shadow-xl bg-primary shadow-primary/40 h-14 w-14"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined">
            {sidebarOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0b0e14] border-r border-slate-200 dark:border-[#1f2937] p-6 overflow-y-auto transition-transform duration-300 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-sm tracking-tight">
              <span className="font-medium text-slate-600 dark:text-slate-300">React</span>
              {" "}
              <span className="font-black text-primary">Principles</span>
            </span>
          </div>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-8">
          {/* Top-level section links */}
          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Navigate
            </h4>
            <ul className="flex flex-col gap-1.5">
              {[
                { href: "/", label: "Home" },
                { href: "/docs/introduction", label: "Docs" },
                { href: "/nextjs/cookbook", label: "Cookbook" },
                { href: "/create", label: "Create" },
              ].map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={toggleSidebar}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {isDocsActive ? (
            DOCS_NAV.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;

                    if (item.soon) {
                      return (
                        <li key={item.label}>
                          <span className="flex cursor-not-allowed items-center justify-between px-3 py-2 text-sm font-medium rounded-lg text-slate-300 dark:text-slate-600">
                            {item.label}
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#1f2937] text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded-sm">
                              Soon
                            </span>
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={toggleSidebar}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                              : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                          )}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          ) : (
            <div>
              <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Cookbook
              </h4>
              <ul className="flex flex-col gap-1.5">
                <li>
                  <Link
                    href={`/${cookbookFramework}/cookbook`}
                    onClick={toggleSidebar}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                      pathname === `/${cookbookFramework}/cookbook`
                        ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                    )}
                  >
                    All Recipes
                  </Link>
                </li>

                {SORTED_RECIPES.map((recipe) => {
                  const isComingSoon = recipe.status === "coming-soon";

                  if (isComingSoon && !IS_DEV) return null;

                  const href = cookbookHref(cookbookFramework, recipe.slug);
                  const isActive = pathname === href;

                  return (
                    <li key={recipe.slug}>
                      <Link
                        href={href}
                        onClick={toggleSidebar}
                        className={cn(
                          "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary font-semibold dark:bg-primary/20"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                        )}
                      >
                        {recipe.title}
                        {isComingSoon && IS_DEV && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded-sm">
                            Dev
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
