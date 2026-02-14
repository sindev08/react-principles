import { Link, useLocation } from "react-router-dom";
import { cn } from "@react-principles/shared/utils";
import { DOCS_NAV } from "./docs-nav";

export function DocsSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="sidebar-scroll sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 overflow-y-auto border-r border-slate-200 dark:border-[#1f2937] py-8 pr-6 lg:block">
      <div className="flex flex-col gap-8">
        {DOCS_NAV.map((group) => (
          <div key={group.title}>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              {group.title}
            </h4>
            <ul className="flex flex-col gap-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.label}>
                    <Link
                      to={item.href}
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
    </aside>
  );
}
