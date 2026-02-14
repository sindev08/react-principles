import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";
import { getRecipeDetail } from "./cookbook-detail-data";
import type { RecipeDetail } from "./cookbook-detail-data";

const TOC_ITEMS = [
  { label: "1. Principle", href: "#principle" },
  { label: "2. Rules", href: "#rules" },
  { label: "3. Pattern", href: "#pattern" },
  { label: "4. Implementation", href: "#implementation" },
];

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

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <DetailContent detail={detail} />
      {detail.demoHref && <LiveDemoBanner href={detail.demoHref} />}
      <CookbookFooter />
    </DocsPageLayout>
  );
}

function DetailContent({ detail }: { detail: RecipeDetail }) {
  const [implTab, setImplTab] = useState<"nextjs" | "vite">("nextjs");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

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
            onClick={() => setSaved((s) => !s)}
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

        {/* Version note */}
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

        {/* Tabs */}
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

        {/* Tab content */}
        <div className="space-y-6">
          <p className="leading-relaxed text-slate-600 dark:text-slate-400">
            {activeImpl.description}
          </p>
          <CodeBlock filename={activeImpl.filename} copyText={activeImpl.code}>
            {activeImpl.code}
          </CodeBlock>
        </div>
      </section>
    </div>
  );
}

function LiveDemoBanner({ href }: { href: string }) {
  return (
    <div className="my-12 flex flex-col items-start justify-between gap-6 rounded-xl border border-primary/20 bg-primary/5 dark:bg-primary/10 p-8 sm:flex-row sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <span className="material-symbols-outlined">play_circle</span>
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">
            See it in action
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Explore the interactive demo to see this pattern running live with real data.
          </p>
        </div>
      </div>
      <Link
        to={href}
        className="flex shrink-0 items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-primary/20 transition-all hover:bg-primary/90"
      >
        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
        View Live Demo
      </Link>
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
            Helping developers build robust React applications since 2024.
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
        © 2024 React Patterns Cookbook. Built with ❤️ for the community.
      </div>
    </footer>
  );
}
