import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";
import { UserList } from "@/components/examples/UserList";
import { UserForm } from "@/components/examples/UserForm";
import { UserTable } from "@/components/examples/UserTable";
import { useAppStore, useFilterStore, useSavedStore } from "@react-principles/shared/stores";
import { getRecipeDetail } from "@react-principles/shared/cookbook";
import type { RecipeDetail, DemoKey } from "@react-principles/shared/cookbook";

const BASE_TOC = [
  { label: "1. Principle", href: "#principle" },
  { label: "2. Rules", href: "#rules" },
  { label: "3. Pattern", href: "#pattern" },
  { label: "4. Implementation", href: "#implementation" },
];

const DEMO_TOC_ITEM = { label: "5. Live Demo", href: "#demo" };

export function CookbookDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const detail = getRecipeDetail(slug ?? "");

  if (!detail) {
    return (
      <DocsPageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">
            search_off
          </span>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Recipe Not Found
          </h1>
          <p className="text-slate-500">
            This recipe does not exist or is not yet available.
          </p>
          <Link
            to="/cookbook"
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            ← Back to Cookbook
          </Link>
        </div>
      </DocsPageLayout>
    );
  }

  const tocItems = detail.demoKey
    ? [...BASE_TOC, DEMO_TOC_ITEM]
    : BASE_TOC;

  return (
    <DocsPageLayout tocItems={tocItems}>
      <DetailContent detail={detail} />
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
            <span className="rounded bg-slate-100 dark:bg-[#1f2937] px-2 py-0.5 text-xs font-mono text-slate-700 dark:text-slate-300">
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
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <select
            value={role ?? ""}
            onChange={(e) =>
              setRole((e.target.value || null) as "admin" | "editor" | "viewer" | null)
            }
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
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

function DetailContent({ detail }: { detail: RecipeDetail }) {
  const [implTab, setImplTab] = useState<"nextjs" | "vite">("nextjs");
  const [copied, setCopied] = useState(false);
  const { isSaved, toggleSaved } = useSavedStore();
  const saved = isSaved(detail.slug);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const activeImpl =
    implTab === "nextjs" ? detail.implementation.nextjs : detail.implementation.vite;

  return (
    <div className="max-w-3xl">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500">
        <Link to="/cookbook" className="hover:text-primary transition-colors">
          Cookbook
        </Link>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="hover:text-primary transition-colors cursor-pointer">
          {detail.breadcrumbCategory}
        </span>
        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
        <span className="text-slate-900 dark:text-white">{detail.title}</span>
      </nav>

      {/* Page Header */}
      <div className="pb-10 mb-12 border-b border-slate-200 dark:border-[#1f2937]">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl">
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
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
            <span className="text-sm font-bold">01</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Principle</h2>
        </div>
        <div className="p-6 bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] rounded-xl shadow-sm">
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
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
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
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
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
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
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
              Requires React 18+ and the latest stable versions of all dependencies shown.
            </p>
          </div>
        </div>
        <div className="mb-6 border-b border-slate-200 dark:border-[#1f2937]">
          <div className="flex gap-8">
            {(["nextjs", "vite"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setImplTab(tab)}
                className={
                  implTab === tab
                    ? "pb-3 text-sm font-bold border-b-2 border-primary text-primary"
                    : "pb-3 text-sm font-medium border-b-2 border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }
              >
                {tab === "nextjs" ? "Next.js (App Router)" : "Vite (Client Side)"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {activeImpl.description}
          </p>
          <CodeBlock filename={activeImpl.filename} copyText={activeImpl.code}>
            {activeImpl.code}
          </CodeBlock>
        </div>
      </section>

      {/* 05 Live Demo */}
      {detail.demoKey && (
        <section className="mb-16" id="demo">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Live Demo
            </h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-sm">
            <LiveDemo demoKey={detail.demoKey} />
          </div>
        </section>
      )}
    </div>
  );
}

function CookbookFooter() {
  return (
    <footer className="mt-24 py-12 border-t border-slate-200 dark:border-[#1f2937]">
      <div className="flex flex-col justify-between gap-8 md:flex-row">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
            </div>
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              React Patterns
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Helping developers build robust React applications since 2025.
          </p>
        </div>
        <div className="flex gap-12">
          <div>
            <h6 className="mb-3 text-xs font-bold uppercase text-slate-900 dark:text-white">
              Resources
            </h6>
            <ul className="space-y-2 text-sm text-slate-500">
              {["GitHub", "Discord", "NPM Package"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h6 className="mb-3 text-xs font-bold uppercase text-slate-900 dark:text-white">
              Legal
            </h6>
            <ul className="space-y-2 text-sm text-slate-500">
              {["Privacy", "License"].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="pt-8 mt-12 text-xs text-center border-t border-slate-100 dark:border-[#1f2937] text-slate-400">
        © 2025 React Patterns Cookbook. Built with ❤️ for the community.
      </div>
    </footer>
  );
}
