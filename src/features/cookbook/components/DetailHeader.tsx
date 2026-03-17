"use client";

import { useState } from "react";
import Link from "next/link";
import { useSavedStore } from "@/features/cookbook/stores/useSavedStore";
import type { RecipeDetail } from "@/features/cookbook/data/detail-data";
import type { Framework } from "./CookbookListPage";

interface DetailHeaderProps {
  detail: RecipeDetail;
  framework: Framework;
}

export function DetailHeader({ detail, framework }: DetailHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { isSaved, toggleSaved } = useSavedStore();
  const saved = isSaved(detail.slug);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
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
    </>
  );
}
