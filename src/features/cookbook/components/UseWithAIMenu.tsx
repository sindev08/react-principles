"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "@/ui/DropdownMenu";
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

interface UseWithAIMenuProps {
  detail: RecipeDetail;
}

export function UseWithAIMenu({ detail }: UseWithAIMenuProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const scaffoldSkill = RECIPE_SKILLS[detail.slug];
  const markdownHref = `/cookbook/${detail.slug}/llms.txt`;

  const aiPrompt = `Read ${SITE_URL}${markdownHref} and follow this React Principles recipe ("${detail.title}") when helping me with my React code.`;
  const chatgptHref = `https://chatgpt.com/?q=${encodeURIComponent(aiPrompt)}`;
  const claudeHref = `https://claude.ai/new?q=${encodeURIComponent(aiPrompt)}`;

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openExternal = (href: string) => {
    window.open(href, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <DropdownMenu.Trigger className="border-0 bg-primary px-4 py-2 text-sm font-bold text-white hover:bg-primary hover:opacity-90 dark:bg-primary dark:hover:bg-primary">
        <span className="material-symbols-outlined text-[18px]">
          {copied ? "check" : "auto_awesome"}
        </span>
        {copied ? "Copied!" : "Use with AI"}
        <span className="material-symbols-outlined text-[18px]">expand_more</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="min-w-72">
        <MenuItem
          icon="content_copy"
          label="Copy for AI"
          description="Recipe as markdown for any assistant"
          onSelect={() => copyToClipboard(formatRecipeMarkdown(detail))}
        />
        <MenuItem
          icon="open_in_new"
          label="Open in Claude"
          onSelect={() => openExternal(claudeHref)}
        />
        <MenuItem
          icon="open_in_new"
          label="Open in ChatGPT"
          onSelect={() => openExternal(chatgptHref)}
        />
        <MenuItem
          icon="description"
          label="View as Markdown"
          onSelect={() => openExternal(markdownHref)}
        />
        <DropdownMenu.Separator />
        <MenuItem
          icon="terminal"
          label="Install AI skills"
          description={
            scaffoldSkill
              ? `${SKILLS_INSTALL_CMD} — then invoke /${scaffoldSkill}`
              : SKILLS_INSTALL_CMD
          }
          onSelect={() => copyToClipboard(SKILLS_INSTALL_CMD)}
        />
        <MenuItem
          icon="arrow_forward"
          label="All AI integrations"
          onSelect={() => router.push("/ai")}
        />
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

function MenuItem({
  icon,
  label,
  description,
  onSelect,
}: {
  icon: string;
  label: string;
  description?: string;
  onSelect: () => void;
}) {
  return (
    <DropdownMenu.Item onSelect={onSelect} className="items-start gap-3">
      <span className="material-symbols-outlined mt-0.5 text-[18px] text-slate-400">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="font-medium">{label}</span>
        {description && (
          <span className="truncate font-mono text-xs text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </span>
    </DropdownMenu.Item>
  );
}
