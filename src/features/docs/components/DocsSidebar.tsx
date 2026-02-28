"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";
import { DOCS_NAV, COOKBOOK_ITEMS } from "./docs-nav";

type Framework = "nextjs" | "vitejs";

interface IndicatorPos {
  top: number;
  height: number;
  visible: boolean;
}

function cookbookHref(framework: Framework, slug: string) {
  return slug ? `/${framework}/cookbook/${slug}` : `/${framework}/cookbook`;
}

export function DocsSidebar() {
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [pos, setPos] = useState<IndicatorPos>({ top: 0, height: 0, visible: false });

  // Derive active framework from URL; default to nextjs
  const urlFramework: Framework = pathname.startsWith("/vitejs/") ? "vitejs" : "nextjs";
  const [cookbookFramework, setCookbookFramework] = useState<Framework>(urlFramework);

  // Keep switcher in sync when navigating between frameworks via other means
  useEffect(() => {
    if (pathname.startsWith("/nextjs/")) setCookbookFramework("nextjs");
    else if (pathname.startsWith("/vitejs/")) setCookbookFramework("vitejs");
  }, [pathname]);

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

  return (
    <aside className="sidebar-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-[#1f2937] py-8 pr-6 lg:block">
      <div ref={navRef} className="relative flex flex-col gap-8">
        {/* Sliding active indicator */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 rounded-lg bg-primary/10 dark:bg-primary/20 transition-all duration-200 ease-out"
          style={{ top: pos.top, height: pos.height, opacity: pos.visible ? 1 : 0 }}
        />

        {/* Docs nav groups (Getting Started, Components) */}
        {DOCS_NAV.map((group) => (
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
                  <li
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[item.href] = el;
                    }}
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

        {/* Cookbook section with inline framework switcher */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              Cookbook
            </h4>
            {/* Framework toggle */}
            <div className="flex items-center gap-0.5 rounded-md border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] p-0.5">
              <button
                onClick={() => setCookbookFramework("nextjs")}
                className={cn(
                  "rounded-sm px-2 py-0.5 text-[10px] font-bold transition-all",
                  cookbookFramework === "nextjs"
                    ? "bg-white dark:bg-[#0d1117] text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                )}
              >
                Next.js
              </button>
              <button
                onClick={() => setCookbookFramework("vitejs")}
                className={cn(
                  "rounded-sm px-2 py-0.5 text-[10px] font-bold transition-all",
                  cookbookFramework === "vitejs"
                    ? "bg-white dark:bg-[#0d1117] text-primary shadow-xs"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300",
                )}
              >
                Vite
              </button>
            </div>
          </div>

          <ul className="flex flex-col gap-1.5">
            {COOKBOOK_ITEMS.map((item) => {
              const href = cookbookHref(cookbookFramework, item.slug);
              const isActive = pathname === href;

              return (
                <li
                  key={item.slug}
                  ref={(el) => {
                    itemRefs.current[href] = el;
                  }}
                >
                  <Link
                    href={href}
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
      </div>
    </aside>
  );
}
