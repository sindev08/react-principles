import { RECIPES } from "@/features/cookbook/data/cookbook-data";
import { RECIPE_DETAILS } from "@/features/cookbook/data";
import type { RecipeDetail } from "@/features/cookbook/data/types";

export interface RecipeSummary {
  slug: string;
  title: string;
  category: string;
  description: string;
}

export interface RecipeSearchResult extends RecipeSummary {
  score: number;
}

/** Published recipes that have full detail content, in curriculum order. */
export function listPublishedRecipes(): RecipeSummary[] {
  return RECIPES.filter(
    (r) => r.status === "published" && RECIPE_DETAILS[r.slug] !== undefined,
  )
    .sort((a, b) => a.order - b.order)
    .map((r) => ({
      slug: r.slug,
      title: r.title,
      category: r.category ?? "Other",
      description: RECIPE_DETAILS[r.slug]?.description ?? "",
    }));
}

/**
 * Scores a recipe against lowercase query terms. Term hits are weighted by
 * where they appear: title and slug are the strongest signal, then rules,
 * then description and principle prose.
 */
export function scoreRecipe(detail: RecipeDetail, terms: string[]): number {
  const title = detail.title.toLowerCase();
  const slug = detail.slug.toLowerCase();
  const description = detail.description.toLowerCase();
  const principle = detail.principle?.text.toLowerCase() ?? "";
  const rules = (detail.rules ?? [])
    .map((r) => `${r.title} ${r.description}`)
    .join(" ")
    .toLowerCase();

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 5;
    if (slug.includes(term)) score += 4;
    if (rules.includes(term)) score += 2;
    if (description.includes(term)) score += 2;
    if (principle.includes(term)) score += 1;
  }
  return score;
}

/** Ranked full-text search over published recipes. */
export function searchRecipes(query: string, limit = 5): RecipeSearchResult[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);

  if (terms.length === 0) return [];

  return listPublishedRecipes()
    .map((summary) => {
      const detail = RECIPE_DETAILS[summary.slug];
      return {
        ...summary,
        score: detail ? scoreRecipe(detail, terms) : 0,
      };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
