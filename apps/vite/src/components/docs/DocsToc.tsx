import { useState, useEffect, useCallback } from "react";

interface TocItem {
  label: string;
  href: string; // e.g. "#featured"
}

interface DocsTocProps {
  items: TocItem[];
}

const HEADER_OFFSET = 80; // sticky header height + buffer

export function DocsToc({ items }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>("");

  const ids = items.map((item) => item.href.replace("#", "")).filter(Boolean);

  const updateActive = useCallback(() => {
    let current = "";

    for (const id of ids) {
      const el = document.getElementById(id);
      if (!el) continue;
      // Element's top position relative to viewport
      const top = el.getBoundingClientRect().top;
      // If the element has scrolled past the header, it's a candidate
      if (top <= HEADER_OFFSET) {
        current = id;
      }
    }

    setActiveId(current);
  }, [ids.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    updateActive(); // set on mount
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, [updateActive]);

  return (
    <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 py-12 pl-6 xl:block">
      <h4 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-slate-300">
        On This Page
      </h4>
      <ul className="flex flex-col gap-3">
        {items.map((item) => {
          const id = item.href.replace("#", "");
          const isActive = id === activeId;
          return (
            <li key={item.href}>
              <a
                href={item.href}
                className={
                  isActive
                    ? "text-sm font-medium text-primary"
                    : "text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                }
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 border-t border-slate-200 dark:border-[#1f2937] pt-8">
        <p className="text-xs text-slate-400">Help us improve this page.</p>
        <a
          href="#"
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          <span className="material-symbols-outlined text-[14px]">edit</span>
          Edit this page on GitHub
        </a>
      </div>
    </aside>
  );
}
