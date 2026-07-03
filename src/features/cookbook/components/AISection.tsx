"use client";

import { useState } from "react";
import Link from "next/link";
import type { RecipeDetail } from "@/features/cookbook/data/types";
import { formatRecipeMarkdown } from "@/lib/recipe-md";

const SKILLS_INSTALL_CMD = "npx skills add sindev08/react-principles-skills";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

/** Recipes that have a dedicated scaffolding skill in react-principles-skills. */
const RECIPE_SKILLS: Record<string, string> = {
  "folder-structure": "reactprinciples-folder-structure",
  "component-anatomy": "reactprinciples-component",
  "component-composition": "reactprinciples-component",
  "custom-hooks": "reactprinciples-hook",
  "client-state": "reactprinciples-store",
  "server-state": "reactprinciples-query",
  "api-integration": "reactprinciples-query",
  "form-validation": "reactprinciples-form",
};

interface AISectionProps {
  detail: RecipeDetail;
}

export function AISection({ detail }: AISectionProps) {
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [copiedMd, setCopiedMd] = useState(false);

  const scaffoldSkill = RECIPE_SKILLS[detail.slug];
  const markdownHref = `/cookbook/${detail.slug}/llms.txt`;

  const aiPrompt = `Read ${SITE_URL}${markdownHref} and follow this React Principles recipe ("${detail.title}") when helping me with my React code.`;
  const chatgptHref = `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt)}`;
  const claudeHref = `https://claude.ai/new?q=${encodeURIComponent(aiPrompt)}`;

  const handleCopyCmd = () => {
    void navigator.clipboard.writeText(SKILLS_INSTALL_CMD);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  const handleCopyMarkdown = () => {
    void navigator.clipboard.writeText(formatRecipeMarkdown(detail));
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  return (
    <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
      <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        Make your AI assistant follow this recipe. Install the React
        Principles skills once — they work with Claude Code, Cursor, and any
        tool supporting Agent Skills.
      </p>

      <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-900 dark:bg-black px-4 py-3">
        <code className="overflow-x-auto font-mono text-sm text-slate-100">
          {SKILLS_INSTALL_CMD}
        </code>
        <button
          onClick={handleCopyCmd}
          className="flex shrink-0 items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copiedCmd ? "check" : "content_copy"}
          </span>
          {copiedCmd ? "Copied!" : "Copy"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
        <span>Then invoke:</span>
        <code className="rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
          /reactprinciples-review
        </code>
        {scaffoldSkill && (
          <>
            <span>or</span>
            <code className="rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-xs font-semibold text-primary">
              /{scaffoldSkill}
            </code>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-200 dark:border-[#1f2937] pt-5">
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/20"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copiedMd ? "check" : "smart_toy"}
          </span>
          {copiedMd ? "Copied!" : "Copy for AI"}
        </button>
        <SecondaryAction href={claudeHref} icon="open_in_new" label="Open in Claude" />
        <SecondaryAction href={chatgptHref} icon="open_in_new" label="Open in ChatGPT" />
        <SecondaryAction href={markdownHref} icon="description" label="View as Markdown" />
        <Link
          href="/ai"
          className="flex items-center justify-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-primary sm:ml-auto"
        >
          All AI integrations
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
}

function SecondaryAction({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-[#1f2937] px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-200 dark:hover:bg-[#2d3748]"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </a>
  );
}
