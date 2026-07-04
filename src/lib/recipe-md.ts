import type { RecipeDetail } from "@/features/cookbook/data/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

export type RecipeMdMode = "compact" | "full";

/**
 * Formats a single recipe as a markdown section for llms.txt aggregation.
 * `headingLevel` controls the title heading depth (3 = "###").
 */
export function formatRecipeSection(
  recipe: RecipeDetail,
  mode: RecipeMdMode,
  headingLevel = 3,
): string {
  const lines: string[] = [];

  lines.push(`${"#".repeat(headingLevel)} ${recipe.title}\n`);
  lines.push(`> ${recipe.description}\n`);

  if (recipe.principle) {
    lines.push(`**Principle:** ${recipe.principle.text}\n`);
    if (recipe.principle.tip) {
      lines.push(`**Tip:** ${recipe.principle.tip}\n`);
    }
  }

  if (recipe.rules && recipe.rules.length > 0) {
    const label = recipe.rulesLabel ?? "Rules";
    lines.push(`**${label}:**`);
    for (const rule of recipe.rules) {
      lines.push(`- **${rule.title}** — ${rule.description}`);
    }
    lines.push("");
  }

  if (mode === "full") {
    appendCodeSections(lines, recipe);
  }

  lines.push(`Read more: ${SITE_URL}/cookbook/${recipe.slug}\n`);

  return lines.join("\n");
}

/**
 * Formats a single recipe as a standalone AI-readable markdown document.
 * Served at /cookbook/<slug>/llms.txt and used by the "Copy for AI" button.
 */
export function formatRecipeMarkdown(recipe: RecipeDetail): string {
  const body = formatRecipeSection(recipe, "full", 1);

  const footer = [
    "---",
    "",
    `Source: ${SITE_URL}/nextjs/cookbook/${recipe.slug}`,
    `All recipes (compact): ${SITE_URL}/llms.txt`,
    `All recipes (full): ${SITE_URL}/llms-full.txt`,
    "",
  ].join("\n");

  return `${body}\n${footer}`;
}

function appendCodeSections(lines: string[], recipe: RecipeDetail): void {
  if (recipe.pattern) {
    lines.push(`**Pattern** — \`${recipe.pattern.filename}\`\n`);
    lines.push(fenceCode(recipe.pattern.code, languageFor(recipe.pattern.filename)));
    lines.push("");
  }

  if (recipe.implementation?.nextjs) {
    const impl = recipe.implementation.nextjs;
    lines.push(`**Implementation — Next.js**\n`);
    lines.push(`${impl.description}\n`);
    lines.push(`File: \`${impl.filename}\`\n`);
    lines.push(fenceCode(impl.code, languageFor(impl.filename)));
    lines.push("");
  }

  if (recipe.implementation?.vite) {
    const impl = recipe.implementation.vite;
    lines.push(`**Implementation — Vite**\n`);
    lines.push(`${impl.description}\n`);
    lines.push(`File: \`${impl.filename}\`\n`);
    lines.push(fenceCode(impl.code, languageFor(impl.filename)));
    lines.push("");
  }
}

function fenceCode(code: string, language: string): string {
  return `\`\`\`${language}\n${code}\n\`\`\``;
}

function languageFor(filename: string): string {
  if (filename.endsWith(".tsx")) return "tsx";
  if (filename.endsWith(".ts")) return "ts";
  if (filename.endsWith(".js")) return "js";
  if (filename.endsWith(".jsx")) return "jsx";
  if (filename.endsWith(".css")) return "css";
  if (filename.endsWith(".json")) return "json";
  if (filename.endsWith(".md")) return "markdown";
  return "";
}
