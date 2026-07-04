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

interface UseWithAISectionProps {
  detail: RecipeDetail;
}

export function UseWithAISection({ detail }: UseWithAISectionProps) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);

  const scaffoldSkill = RECIPE_SKILLS[detail.slug];
  const markdownHref = `/cookbook/${detail.slug}/llms.txt`;

  const aiPrompt = `Read ${SITE_URL}${markdownHref} and follow this React Principles recipe ("${detail.title}") when helping me with my React code.`;
  const chatgptHref = `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt)}`;
  const claudeHref = `https://claude.ai/new?q=${encodeURIComponent(aiPrompt)}`;

  const handleCopyMarkdown = () => {
    void navigator.clipboard.writeText(formatRecipeMarkdown(detail));
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyCmd = () => {
    void navigator.clipboard.writeText(SKILLS_INSTALL_CMD);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="mt-8 rounded-xl border border-primary/20 bg-primary/5 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-primary">
            auto_awesome
          </span>
          <p className="text-sm font-bold text-slate-900 dark:text-white">
            Use with AI
          </p>
        </div>
        <Link
          href="/ai"
          className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          All AI integrations
          <span className="material-symbols-outlined text-[14px]">
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={handleCopyMarkdown}
          className="flex items-center gap-2 rounded-lg bg-primary px-3.5 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90"
        >
          <span className="material-symbols-outlined text-[18px]">
            {copiedMd ? "check" : "smart_toy"}
          </span>
          {copiedMd ? "Copied!" : "Copy for AI"}
        </button>
        <ActionLink href={claudeHref} label="Open in Claude" icon="open_in_new" />
        <ActionLink href={chatgptHref} label="Open in ChatGPT" icon="open_in_new" />
        <ActionLink href={markdownHref} label="View as Markdown" icon="description" />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
        <span>Install skills:</span>
        <code className="rounded-sm bg-white px-2 py-1 font-mono text-slate-700 dark:bg-[#0d1117] dark:text-slate-300">
          {SKILLS_INSTALL_CMD}
        </code>
        <button
          onClick={handleCopyCmd}
          className="flex items-center gap-1 font-medium text-primary transition-colors hover:underline"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copiedCmd ? "check" : "content_copy"}
          </span>
          {copiedCmd ? "Copied!" : "Copy"}
        </button>
        {scaffoldSkill && (
          <span>
            — then invoke{" "}
            <code className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-mono font-semibold text-primary">
              /{scaffoldSkill}
            </code>
          </span>
        )}
      </div>
    </div>
  );
}

function ActionLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 transition-colors hover:border-primary/40 hover:text-primary dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-300 dark:hover:border-primary/40 dark:hover:text-primary"
    >
      <span className="material-symbols-outlined text-[18px]">{icon}</span>
      {label}
    </a>
  );
}
