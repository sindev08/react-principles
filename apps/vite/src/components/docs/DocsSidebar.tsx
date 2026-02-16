import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@react-principles/shared/utils";
import { DOCS_NAV } from "./docs-nav";

interface IndicatorPos {
  top: number;
  height: number;
  visible: boolean;
}

export function DocsSidebar() {
  const { pathname } = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const [pos, setPos] = useState<IndicatorPos>({ top: 0, height: 0, visible: false });

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
                  <li
                    key={item.label}
                    ref={(el) => {
                      itemRefs.current[item.href] = el;
                    }}
                  >
                    <Link
                      to={item.href}
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
      </div>
    </aside>
  );
}
