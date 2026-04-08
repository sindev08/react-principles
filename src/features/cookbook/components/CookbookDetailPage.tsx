"use client";

import { useState } from "react";
import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { UserList } from "@/features/examples/components/UserList";
import { UserForm } from "@/features/examples/components/UserForm";
import { UserTable } from "@/features/examples/components/UserTable";
import { useAppStore } from "@/shared/stores/useAppStore";
import { useFilterStore } from "@/shared/stores/useFilterStore";
import { useSavedStore } from "@/features/cookbook/stores/useSavedStore";
import type { RecipeDetail, DemoKey, StarterLink } from "@/features/cookbook/data/detail-data";
import type { Framework } from "@/features/cookbook/components/CookbookListPage";

const BASE_TOC = [
  { label: "1. Principle", href: "#principle" },
  { label: "2. Rules", href: "#rules" },
  { label: "3. Pattern", href: "#pattern" },
  { label: "4. Implementation", href: "#implementation" },
];

const DEMO_TOC_ITEM = { label: "5. Live Demo", href: "#demo" };

interface CookbookDetailPageProps {
  detail: RecipeDetail;
  framework: Framework;
}

export function CookbookDetailPage({ detail, framework }: CookbookDetailPageProps) {
  const tocItems = detail.demoKey ? [...BASE_TOC, DEMO_TOC_ITEM] : BASE_TOC;

  return (
    <DocsPageLayout tocItems={tocItems}>
      <DetailContent detail={detail} framework={framework} />
      <CookbookFooter />
    </DocsPageLayout>
  );
}

function ZustandDemo() {
  const { theme, toggleTheme } = useAppStore();
  const { search, role, status, setSearch, setRole, setStatus, reset } =
    useFilterStore();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
          App Store
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Theme</span>
            <span className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-2 py-0.5 text-xs font-mono text-slate-700 dark:text-slate-300">
              {theme}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Toggle Theme
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">
          Filter Store
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          />
          <select
            value={role ?? ""}
            onChange={(e) =>
              setRole((e.target.value || null) as "admin" | "editor" | "viewer" | null)
            }
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={status ?? ""}
            onChange={(e) =>
              setStatus((e.target.value || null) as "active" | "inactive" | null)
            }
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={reset}
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function LiveDemo({ demoKey }: { demoKey: DemoKey }) {
  if (demoKey === "react-query") return <UserList />;
  if (demoKey === "zustand") return <ZustandDemo />;
  if (demoKey === "forms") return <UserForm />;
  if (demoKey === "table") return <UserTable />;
  return null;
}

function DetailContent({ detail, framework }: { detail: RecipeDetail; framework: Framework }) {
  const [copied, setCopied] = useState(false);
  const { isSaved, toggleSaved } = useSavedStore();
  const saved = isSaved(detail.slug);

  const activeImpl =
    framework === "nextjs" ? detail.implementation.nextjs : detail.implementation.vite;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      void navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center justify-between gap-2 text-sm font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <Link href={`/${framework}/cookbook`} className="hover:text-primary transition-colors">
            Cookbook
          </Link>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="hover:text-primary transition-colors cursor-pointer">
            {detail.breadcrumbCategory}
          </span>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">{detail.title}</span>
        </div>
        <span className="shrink-0 text-xs text-slate-400">Updated {detail.lastUpdated}</span>
      </nav>

      {/* Page Header */}
      <div className="pb-10 mb-12 border-b border-slate-200 dark:border-[#1f2937]">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl mb-4">
          {detail.title}
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {detail.description}
        </p>
        <div className="flex gap-3 mt-8">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg bg-slate-100 dark:bg-[#1f2937] text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2d3748] transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">
              {copied ? "check" : "link"}
            </span>
            {copied ? "Copied!" : "Copy Link"}
          </button>
          <button
            onClick={() => toggleSaved(detail.slug)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all ${
              saved
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {saved ? "bookmark_added" : "bookmark"}
            </span>
            {saved ? "Saved!" : "Save Pattern"}
          </button>
        </div>
      </div>

      {/* 01 Principle */}
      <section className="mb-16" id="principle">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <span className="text-sm font-bold">01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Principle</h2>
        </div>
        <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl shadow-xs">
          <p className="leading-relaxed text-slate-700 dark:text-slate-300">
            {detail.principle.text}
          </p>
          <div className="flex items-start gap-4 p-4 mt-6 border-l-4 rounded-lg bg-primary/5 border-primary">
            <span className="material-symbols-outlined text-primary">lightbulb</span>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {detail.principle.tip}
            </p>
          </div>
        </div>
      </section>

      {/* 02 Rules */}
      <section className="mb-16" id="rules">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <span className="text-sm font-bold">02</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Rules</h2>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {detail.rules.map((rule) => (
            <li
              key={rule.title}
              className="flex gap-3 p-5 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl"
            >
              <span className="material-symbols-outlined text-emerald-500">check_circle</span>
              <div>
                <span className="block font-bold text-slate-900 dark:text-white">
                  {rule.title}
                </span>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {rule.description}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 03 Pattern */}
      <section className="mb-16" id="pattern">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <span className="text-sm font-bold">03</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pattern</h2>
        </div>
        <CodeBlock filename={detail.pattern.filename} copyText={detail.pattern.code}>
          {detail.pattern.code}
        </CodeBlock>
      </section>

      {/* 04 Implementation */}
      <section className="mb-16" id="implementation">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
            <span className="text-sm font-bold">04</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Implementation
          </h2>
        </div>
        <div className="flex gap-4 p-4 mb-8 border border-amber-200 dark:border-amber-900/50 rounded-lg bg-amber-50 dark:bg-amber-900/20">
          <span className="material-symbols-outlined text-amber-600">info</span>
          <div>
            <p className="text-sm font-bold tracking-tight text-amber-900 dark:text-amber-300">
              Version Compatibility
            </p>
            <p className="text-xs text-amber-800 dark:text-amber-400">
              Requires React 19+ and the latest stable versions of all dependencies shown.
            </p>
          </div>
        </div>
        {framework === "vitejs" && (
          <ViteComingSoon />
        )}
        <div className="space-y-6">
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {activeImpl.description}
          </p>
          <CodeBlock filename={activeImpl.filename} copyText={activeImpl.code}>
            {activeImpl.code}
          </CodeBlock>
        </div>
        {framework === "nextjs" && detail.starterLink && (
          <StarterTemplateLink starterLink={detail.starterLink} />
        )}
      </section>

      {/* 05 Live Demo */}
      {detail.demoKey && (
        <section className="mb-16" id="demo">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Live Demo
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
            <LiveDemo demoKey={detail.demoKey} />
          </div>
        </section>
      )}
    </div>
  );
}

function ViteComingSoon() {
  return (
    <div className="flex gap-4 p-4 mb-8 border border-blue-200 dark:border-blue-900/50 rounded-lg bg-blue-50 dark:bg-blue-900/20">
      <span className="material-symbols-outlined text-blue-600">construction</span>
      <div>
        <p className="text-sm font-bold tracking-tight text-blue-900 dark:text-blue-300">
          Vite Starter Template — Coming Soon
        </p>
        <p className="text-xs text-blue-800 dark:text-blue-400">
          The Vite starter template is currently in development. In the meantime, the code patterns
          shown below apply to any Vite + React project. Check out the{" "}
          <a
            href="https://github.com/sindev08/react-principles-nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline hover:text-blue-600 dark:hover:text-blue-300"
          >
            Next.js starter
          </a>
          {" "}for a working reference.
        </p>
      </div>
    </div>
  );
}

function StarterTemplateLink({ starterLink }: { starterLink: StarterLink }) {
  return (
    <a
      href={starterLink.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-6 flex items-center gap-3 p-4 rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] transition-colors hover:border-primary/50 hover:bg-primary/5 group"
    >
      <span className="material-symbols-outlined text-primary">open_in_new</span>
      <div className="flex-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
          {starterLink.label}
        </p>
        <p className="text-xs text-slate-500">
          View the real implementation in react-principles-nextjs
        </p>
      </div>
      <span className="material-symbols-outlined text-slate-400 group-hover:text-primary transition-colors text-[18px]">
        arrow_forward
      </span>
    </a>
  );
}

function CookbookFooter() {
  return (
    <footer className="mt-24 py-12 border-t border-slate-200 dark:border-[#1f2937]">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded-sm bg-primary text-white">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              React Patterns
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Helping developers build robust React applications since 2026.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <h6 className="mb-3 text-xs font-bold uppercase text-slate-900 dark:text-white">
              Resources
            </h6>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="https://github.com/sindev08/react-principles" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
              </li>
              <li>
                <a href="https://www.npmjs.com/package/react-principles" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">NPM Package</a>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="mb-3 text-xs font-bold uppercase text-slate-900 dark:text-white">
              Legal
            </h6>
            <ul className="space-y-2 text-sm text-slate-500">
              <li>
                <a href="https://github.com/sindev08/react-principles/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">License (MIT)</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 mt-12 text-xs text-center border-t border-slate-100 dark:border-[#1f2937] text-slate-400">
        © 2026 React Patterns Cookbook. Built with ❤️ for the community.
      </div>
    </footer>
  );
}
