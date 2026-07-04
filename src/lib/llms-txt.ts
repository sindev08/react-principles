import { RECIPES, type Recipe } from "@/features/cookbook/data/cookbook-data";
import { RECIPE_DETAILS } from "@/features/cookbook/data";
import type { RecipeDetail, RuleItem } from "@/features/cookbook/data/types";
import { formatRecipeSection } from "@/lib/recipe-md";

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
      sections.push(formatRecipeSection(detail, opts.mode));
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

// Exported for testing
export type { RecipeDetail, RuleItem };
