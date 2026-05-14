"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimatedMount } from "@/shared/hooks/useAnimatedMount";
import { cn } from "@/shared/utils/cn";

export interface SearchItem {
  title: string;
  href: string;
  description?: string;
  group: "Docs" | "Cookbook";
  section?: string;
  icon?: string;
}

interface SearchDialogProps {
  open: boolean;
  items: SearchItem[];
  onClose: () => void;
  onNavigate: (href: string) => void;
  savedSlugs?: string[];
  initialQuery?: string;
}

export function SearchDialog({
  open,
  items,
  onClose,
  onNavigate,
  savedSlugs = [],
  initialQuery = "",
}: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mounted, visible } = useAnimatedMount(open, 150);

  const results = query.trim()
    ? items.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase()),
    )
    : items.slice(0, 8);

  const docsResults = results.filter((r) => r.group === "Docs");
  const cookbookResults = results.filter((r) => r.group === "Cookbook");

  // Focus input and reset state on open
  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [initialQuery, open]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        const item = results[activeIndex];
        if (item) {
          onNavigate(item.href);
          onClose();
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, results, activeIndex, onNavigate, onClose]);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-start justify-center pt-[15vh] transition-opacity duration-150",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          "relative z-10 mx-4 w-full max-w-xl rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] shadow-2xl transition-all duration-150",
          visible ? "scale-100 opacity-100" : "scale-95 opacity-0",
        )}
      >
        {/* Input */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-[#1f2937] px-4 py-3.5">
          <span className="material-symbols-outlined text-[20px] text-slate-400">
            search
          </span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search docs, components, patterns..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-200"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <kbd className="hidden rounded-sm border border-slate-200 dark:border-[#1f2937] px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline-flex">
              ESC
            </kbd>
          )}
        </div>

        {/* Results */}
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-slate-400">
              <span className="material-symbols-outlined mb-2 text-[40px]">
                search_off
              </span>
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            </div>
          ) : (
            <>
              {docsResults.length > 0 && (
                <ResultGroup
                  title="Docs"
                  items={docsResults}
                  allResults={results}
                  query={query}
                  activeIndex={activeIndex}
                  savedSlugs={savedSlugs}
                  onSelect={(href) => {
                    onNavigate(href);
                    onClose();
                  }}
                  onHover={setActiveIndex}
                />
              )}
              {cookbookResults.length > 0 && (
                <ResultGroup
                  title="Cookbook"
                  items={cookbookResults}
                  allResults={results}
                  query={query}
                  activeIndex={activeIndex}
                  savedSlugs={savedSlugs}
                  onSelect={(href) => {
                    onNavigate(href);
                    onClose();
                  }}
                  onHover={setActiveIndex}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-[#1f2937] px-4 py-2.5 text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded-sm border border-slate-200 dark:border-[#2d3748] px-1 py-0.5 font-mono">
                ↑
              </kbd>
              <kbd className="rounded-sm border border-slate-200 dark:border-[#2d3748] px-1 py-0.5 font-mono">
                ↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded-sm border border-slate-200 dark:border-[#2d3748] px-1 py-0.5 font-mono">
                ↵
              </kbd>
              select
            </span>
          </div>
          <span>
            {results.length} result{results.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}

// --- helpers ---

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="rounded-xs bg-primary/20 px-0.5 font-semibold text-primary not-italic">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

interface ResultGroupProps {
  title: string;
  items: SearchItem[];
  allResults: SearchItem[];
  query: string;
  activeIndex: number;
  savedSlugs: string[];
  onSelect: (href: string) => void;
  onHover: (index: number) => void;
}

function ResultGroup({
  title,
  items,
  allResults,
  query,
  activeIndex,
  savedSlugs,
  onSelect,
  onHover,
}: ResultGroupProps) {
  return (
    <div className="mb-1">
      <p className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
        {title}
      </p>
      {items.map((item) => {
        const globalIdx = allResults.indexOf(item);
        const isActive = globalIdx === activeIndex;
        const cookbookMatch = item.href.match(/\/(nextjs|vitejs)\/cookbook\/(.+)/);
        const slug = cookbookMatch ? cookbookMatch[2] : null;
        const isSaved = slug ? savedSlugs.includes(slug) : false;
        return (
          <button
            key={item.href}
            onMouseEnter={() => onHover(globalIdx)}
            onClick={() => onSelect(item.href)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
              isActive
                ? "bg-primary/10 dark:bg-primary/20"
                : "hover:bg-slate-50 dark:hover:bg-[#0d1117]",
            )}
          >
            <span
              className={cn(
                "material-symbols-outlined shrink-0 text-[18px]",
                isActive ? "text-primary" : "text-slate-400",
              )}
            >
              {item.icon ?? (title === "Docs" ? "article" : "menu_book")}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  "flex items-center gap-1.5 truncate text-sm font-medium",
                  isActive ? "text-primary" : "text-slate-900 dark:text-white",
                )}
              >
                {highlight(item.title, query)}
                {isSaved && (
                  <span
                    className="material-symbols-outlined shrink-0 text-[13px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    bookmark
                  </span>
                )}
              </p>
              {item.description && (
                <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                  {highlight(item.description, query)}
                </p>
              )}
              {item.section && !item.description && (
                <p className="mt-0.5 truncate text-xs text-slate-400 dark:text-slate-500">
                  {item.section}
                </p>
              )}
            </div>
            {isActive && (
              <span className="material-symbols-outlined shrink-0 text-[16px] text-primary">
                arrow_forward
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
