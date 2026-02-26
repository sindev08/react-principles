"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/shared/stores/useAppStore";
import { cn } from "@/shared/utils/cn";
import { DOCS_NAV } from "./docs-nav";

export function MobileNav() {
  const { sidebarOpen, toggleSidebar } = useAppStore();
  const pathname = usePathname();

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
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
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
            <span className="text-sm font-extrabold text-primary">
              react-principles
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
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-[#1f2937] text-slate-400 dark:text-slate-500 px-1.5 py-0.5 rounded">
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
          ))}
        </div>
      </div>
    </>
  );
}
