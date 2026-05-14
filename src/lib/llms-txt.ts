import { RECIPES, type Recipe } from "@/features/cookbook/data/cookbook-data";
import { RECIPE_DETAILS } from "@/features/cookbook/data";
import type { RecipeDetail, RuleItem } from "@/features/cookbook/data/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

const HEADER = `# React Principles — Cookbook

> Production-grade React patterns and principles. A curated curriculum for modern React development covering folder structure, TypeScript, components, state, forms, services, and more.

This is the **compact** version of the cookbook — principle statements and rules only, no code examples. For full content including code examples and framework-specific implementations, see:

- Full version: ${SITE_URL}/llms-full.txt
- Interactive cookbook: ${SITE_URL}/cookbook

Stack: Next.js 16, React 19, TypeScript 5, Tailwind CSS v4, TanStack Query v5, Zustand v5, React Hook Form + Zod.

---
`;

const FOOTER = `---

## More

- Full cookbook (with code examples): ${SITE_URL}/llms-full.txt
- Interactive web version: ${SITE_URL}/cookbook
- UI Kit components: ${SITE_URL}/docs
- AI skills (Claude/Cursor/Copilot): https://github.com/sindev08/react-principles-skills
`;

export function generateCompactLlmsTxt(): string {
  const publishedRecipes = RECIPES.filter((r) => r.status === "published").sort(
    (a, b) => a.order - b.order,
  );

  const grouped = groupByCategory(publishedRecipes);

  const sections: string[] = [HEADER];

  for (const [category, recipes] of grouped) {
    sections.push(`\n## ${category}\n`);
    for (const recipe of recipes) {
      const detail = RECIPE_DETAILS[recipe.slug];
      if (!detail) continue;
      sections.push(formatRecipe(detail));
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

function formatRecipe(recipe: RecipeDetail): string {
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

  lines.push(`Read more: ${SITE_URL}/cookbook/${recipe.slug}\n`);

  return lines.join("\n");
}

// Exported for testing or future full-version use
export type { RecipeDetail, RuleItem };
