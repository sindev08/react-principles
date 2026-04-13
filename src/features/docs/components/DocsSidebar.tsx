"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { STORYBOOK_BASE_URL } from "@/features/docs/lib/storybook";
import { DOCS_NAV } from "./docs-nav";
import { RECIPES } from "@/features/cookbook/data/cookbook-data";

const IS_DEV = process.env.NODE_ENV === "development";

const SORTED_RECIPES = [...RECIPES].sort((a, b) => a.order - b.order);

type Framework = "nextjs" | "vitejs";

interface IndicatorPos {
  top: number;
  height: number;
  visible: boolean;
}

function cookbookHref(framework: Framework, slug: string) {
  return `/${framework}/cookbook/${slug}`;
}

export function DocsSidebar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [pos, setPos] = useState<IndicatorPos>({ top: 0, height: 0, visible: false });

  // Derive active framework from URL; default to nextjs
  const cookbookFramework: Framework = pathname.startsWith("/vitejs/") ? "vitejs" : "nextjs";

  useEffect(() => {
    const el = itemRefs.current[pathname];
    const nav = navRef.current;
    if (!el || !nav) {
      setPos((p) => ({ ...p, visible: false }));
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    setPos({ top: elRect.top - navRect.top, height: elRect.height, visible: true });
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [pathname]);

  const isDocsActive = pathname.startsWith("/docs");

  return (
    <aside className="sidebar-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-[#1f2937] py-8 pr-6 lg:block">
      <div ref={navRef} className="relative flex min-h-full flex-col gap-8">
        {/* Sliding active indicator */}
        <div
          aria-hidden
          className="absolute inset-x-0 transition-all duration-200 ease-out rounded-lg pointer-events-none bg-primary/10 dark:bg-primary/20"
          style={{ top: pos.top, height: pos.height, opacity: pos.visible ? 1 : 0 }}
        />

        {isDocsActive ? (
          /* Docs nav: Getting Started + Components */
          <>
            {DOCS_NAV.map((group) => (
              <div key={group.title}>
                <h4 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
                  {group.title}
                </h4>
                <ul className="flex flex-col gap-1.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;

                    if (item.soon) {
                      return (
                        <li key={item.label}>
                          <span className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-not-allowed text-slate-300 dark:text-slate-600">
                            {item.label}
                            <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#1f2937] text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded-sm">
                              Soon
                            </span>
                          </span>
                        </li>
                      );
                    }

                    return (
                      <li
                        key={item.label}
                        ref={(el) => { itemRefs.current[item.href] = el; }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "relative z-10 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                            isActive
                              ? "text-primary font-semibold"
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
            ))}

            <div className="mt-auto pt-2">
              <div className="mb-4 h-px bg-slate-200 dark:bg-[#1f2937]" />
              <Link
                href={STORYBOOK_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-10 flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <span>Storybook</span>
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                  open_in_new
                </span>
              </Link>
            </div>
          </>
        ) : (
          /* Cookbook nav */
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400 dark:text-slate-500">
              Cookbook
            </h4>
            <ul className="flex flex-col gap-1.5">
              {/* All Recipes link */}
              <li ref={(el) => { itemRefs.current[`/${cookbookFramework}/cookbook`] = el; }}>
                <Link
                  href={`/${cookbookFramework}/cookbook`}
                  className={cn(
                    "relative z-10 flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    pathname === `/${cookbookFramework}/cookbook`
                      ? "text-primary font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white",
                  )}
                >
                  All Recipes
                </Link>
              </li>

              {SORTED_RECIPES.map((recipe) => {
                const isComingSoon = recipe.status === "coming-soon";

                // In production, hide coming-soon items entirely
                if (isComingSoon && !IS_DEV) return null;

                const href = cookbookHref(cookbookFramework, recipe.slug);
                const isActive = pathname === href;

                return (
                  <li
                    key={recipe.slug}
                    ref={(el) => { itemRefs.current[href] = el; }}
                  >
                    <Link
                      href={href}
                      className={cn(
                        "relative z-10 flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "text-primary font-semibold"
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
    </aside>
  );
}
