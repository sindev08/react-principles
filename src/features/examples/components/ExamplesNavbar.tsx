"use client";

import Link from "next/link";
import { ThemeToggle } from "@/features/landing/components/ThemeToggle";
import { useAppStore } from "@/shared/stores/useAppStore";

const NAV_LINKS = [
  { href: "/state", label: "State" },
  { href: "/react-query", label: "React Query" },
  { href: "/forms", label: "Forms" },
  { href: "/table", label: "Table" },
  { href: "/users", label: "Users" },
] as const;

export function ExamplesNavbar() {
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-[#1f2937] dark:bg-[#0b0e14]/80">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className="flex items-center justify-center rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            <span className="material-symbols-outlined text-xl">menu</span>
          </button>
          <Link
            href="/state"
            className="text-sm font-bold tracking-tight text-slate-900 dark:text-white"
          >
            Examples
          </Link>
          <nav className="hidden items-center gap-4 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-medium text-slate-500 transition-colors hover:text-primary dark:text-slate-400"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
