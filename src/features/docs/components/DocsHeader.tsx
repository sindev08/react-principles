"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ThemeToggle } from "@/features/landing/components/ThemeToggle";
import { SearchDialog, type SearchItem } from "@/ui/SearchDialog";
import { useSearchStore } from "@/shared/stores/useSearchStore";
import { useSavedStore } from "@/features/cookbook/stores/useSavedStore";
import { RECIPES } from "@/features/cookbook/data/cookbook-data";
import { DOCS_NAV } from "./docs-nav";

function GithubIcon() {
  return (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function navLinkClass(isActive: boolean) {
  return isActive
    ? "text-xs font-bold text-primary"
    : "text-xs font-medium text-slate-500 dark:text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white";
}

const SEARCH_INDEX: SearchItem[] = [
  ...DOCS_NAV.flatMap((group) =>
    group.items
      .filter((item) => !item.soon)
      .map((item) => ({
        title: item.label,
        href: item.href,
        group: "Docs" as const,
        section: group.title,
      })),
  ),
  ...RECIPES.map((recipe) => ({
    title: recipe.title,
    href: `/nextjs/cookbook/${recipe.slug}`,
    description: recipe.description,
    group: "Cookbook" as const,
    icon: recipe.icon,
  })),
];

export function DocsHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, setOpen, toggle } = useSearchStore();
  const { savedSlugs } = useSavedStore();
  const isDocsActive = pathname.startsWith("/docs");
  const isCookbookActive = pathname.startsWith("/nextjs/cookbook") || pathname.startsWith("/vitejs/cookbook");

  // ⌘K / Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-[#1f2937] bg-white/80 dark:bg-[#0b0e14]/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-14 max-w-[1440px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <h2 className="text-base font-extrabold leading-tight tracking-tight text-primary">
                react-principles
              </h2>
            </Link>
            <nav className="hidden items-center gap-6 md:flex">
              <Link href="/" className={navLinkClass(!isDocsActive && !isCookbookActive)}>
                Home
              </Link>
              <Link href="/docs/introduction" className={navLinkClass(isDocsActive)}>
                Docs
              </Link>
              <Link href="/nextjs/cookbook" className={navLinkClass(isCookbookActive)}>
                Cookbook
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={toggle}
              className="hidden items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] px-3 py-1.5 text-sm text-slate-400 transition-colors hover:border-primary/50 hover:text-slate-600 dark:hover:text-slate-300 sm:flex"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span className="text-xs">Search...</span>
              <kbd className="ml-2 rounded-sm border border-slate-200 dark:border-[#1f2937] px-1.5 py-0.5 text-[10px] font-medium">
                ⌘K
              </kbd>
            </button>
            <button
              onClick={toggle}
              className="flex items-center justify-center rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 sm:hidden"
              aria-label="Search"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
            <ThemeToggle />
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-1.5 text-[11px] font-bold text-white transition-colors hover:bg-primary/90"
            >
              <GithubIcon />
              GitHub
            </a>
          </div>
        </div>
      </header>

      <SearchDialog
        open={open}
        items={SEARCH_INDEX}
        onClose={() => setOpen(false)}
        onNavigate={(href) => router.push(href)}
        savedSlugs={savedSlugs}
      />
    </>
  );
}
