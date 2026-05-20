"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/shared/stores/useAppStore";
import { cn } from "@/shared/utils/cn";

const SIDEBAR_LINKS = [
  { href: "/state", label: "State", icon: "toggle_on" },
  { href: "/react-query", label: "React Query", icon: "cloud_sync" },
  { href: "/forms", label: "Forms", icon: "edit_note" },
  { href: "/table", label: "Table", icon: "table" },
  { href: "/users", label: "Users", icon: "group" },
] as const;

export function ExamplesSidebar() {
  const pathname = usePathname();
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 z-30 h-[calc(100vh-3.5rem)] w-56 border-r border-slate-200 bg-white transition-transform duration-200 dark:border-[#1f2937] dark:bg-[#0b0e14]",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <nav className="flex flex-col gap-1 p-3">
        {SIDEBAR_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
              )}
            >
              <span className="material-symbols-outlined text-lg">
                {link.icon}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
