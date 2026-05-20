import { RECIPES, type Recipe } from "@/features/cookbook/data/cookbook-data";
import { RECIPE_DETAILS } from "@/features/cookbook/data";
import type { RecipeDetail, RuleItem } from "@/features/cookbook/data/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

// ─── Headers / Footers ────────────────────────────────────────────────────────

const COMPACT_HEADER = `# React Principles — Cookbook

> Production-grade React patterns and principles. A curated curriculum for modern React development covering folder structure, TypeScript, components, state, forms, services, and more.

This is the **compact** version of the cookbook — principle statements and rules only, no code examples. For full content including code examples and framework-specific implementations, see:

- Full version: ${SITE_URL}/llms-full.txt
- Interactive cookbook: ${SITE_URL}/cookbook

Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, TanStack Query v5, Zustand v5, React Hook Form + Zod.

---
`;

const FULL_HEADER = `# React Principles — Cookbook (Full)

> Production-grade React patterns and principles. A curated curriculum for modern React development covering folder structure, TypeScript, components, state, forms, services, and more.

This is the **full** version of the cookbook — every published recipe with principle, rules, pattern code, and framework-specific implementations (Next.js and Vite). For a lighter version without code, see ${SITE_URL}/llms.txt.

Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, TanStack Query v5, Zustand v5, React Hook Form + Zod.

Use this file as:
- RAG context for a custom AI assistant
- Long-form context to drop into Claude / Cursor / Copilot for principle-aware help
- Reference for fine-tuning or evaluation

---
`;

const FOOTER = `---

## More

- Compact cookbook (no code): ${SITE_URL}/llms.txt
- Full cookbook (with code): ${SITE_URL}/llms-full.txt
- Interactive web version: ${SITE_URL}/cookbook
- UI Kit components: ${SITE_URL}/docs
- AI skills (Claude/Cursor/Copilot): https://github.com/sindev08/react-principles-skills
`;

// ─── Public API ───────────────────────────────────────────────────────────────

export function generateCompactLlmsTxt(): string {
  return buildLlmsTxt({ mode: "compact" });
}

export function generateFullLlmsTxt(): string {
  return buildLlmsTxt({ mode: "full" });
}

// ─── Internals ────────────────────────────────────────────────────────────────

interface BuildOptions {
  mode: "compact" | "full";
}

function buildLlmsTxt(opts: BuildOptions): string {
  const publishedRecipes = RECIPES.filter((r) => r.status === "published").sort(
    (a, b) => a.order - b.order,
  );

  const grouped = groupByCategory(publishedRecipes);

  const sections: string[] = [opts.mode === "full" ? FULL_HEADER : COMPACT_HEADER];

  for (const [category, recipes] of grouped) {
    sections.push(`\n## ${category}\n`);
    for (const recipe of recipes) {
      const detail = RECIPE_DETAILS[recipe.slug];
      if (!detail) continue;
      sections.push(formatRecipe(detail, opts.mode));
    }
  }

  sections.push(FOOTER);

  return sections.join("\n");
}

function groupByCategory(recipes: Recipe[]): Map<string, Recipe[]> {
  const map = new Map<string, Recipe[]>();
  for (const r of recipes) {
    const cat = r.category ?? "Other";
    const existing = map.get(cat) ?? [];
    existing.push(r);
    map.set(cat, existing);
  }
  return map;
}

function formatRecipe(recipe: RecipeDetail, mode: BuildOptions["mode"]): string {
  const lines: string[] = [];

  lines.push(`### ${recipe.title}\n`);
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

// Exported for testing
export type { RecipeDetail, RuleItem };
