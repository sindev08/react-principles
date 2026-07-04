import { describe, it, expect } from "vitest";
import {
  listPublishedRecipes,
  scoreRecipe,
  searchRecipes,
} from "./recipe-search";
import type { RecipeDetail } from "@/features/cookbook/data/types";

const FIXTURE: RecipeDetail = {
  slug: "form-validation",
  title: "Form Validation with Zod",
  breadcrumbCategory: "Patterns",
  description: "Schema-first form validation with React Hook Form and Zod.",
  lastUpdated: "2026-07-03",
  contributor: { name: "Test Author", role: "Maintainer" },
  principle: { text: "The Zod schema is the single source of truth." },
  rules: [
    {
      title: "Schema before form",
      description: "Define the Zod schema first.",
    },
  ],
};

describe("scoreRecipe", () => {
  it("weights title matches highest", () => {
    const titleHit = scoreRecipe(FIXTURE, ["validation"]);
    const principleOnlyHit = scoreRecipe(FIXTURE, ["truth"]);

    expect(titleHit).toBeGreaterThan(principleOnlyHit);
    expect(principleOnlyHit).toBe(1);
  });

  it("accumulates scores across fields and terms", () => {
    // "zod" hits title, slug is missed, description, principle, and rules
    const single = scoreRecipe(FIXTURE, ["zod"]);
    const double = scoreRecipe(FIXTURE, ["zod", "schema"]);

    expect(single).toBeGreaterThan(0);
    expect(double).toBeGreaterThan(single);
  });

  it("returns 0 when nothing matches", () => {
    expect(scoreRecipe(FIXTURE, ["kubernetes"])).toBe(0);
  });
});

describe("listPublishedRecipes", () => {
  it("returns only recipes with detail content, each with a description", () => {
    const recipes = listPublishedRecipes();

    expect(recipes.length).toBeGreaterThan(0);
    for (const recipe of recipes) {
      expect(recipe.slug).toBeTruthy();
      expect(recipe.title).toBeTruthy();
      expect(recipe.category).toBeTruthy();
      expect(recipe.description).toBeTruthy();
    }
  });
});

describe("searchRecipes", () => {
  it("ranks the form validation recipe first for a form query", () => {
    const results = searchRecipes("form validation zod");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.slug).toBe("form-validation");
  });

  it("respects the limit", () => {
    expect(searchRecipes("react", 2).length).toBeLessThanOrEqual(2);
  });

  it("returns empty for queries with no usable terms", () => {
    expect(searchRecipes("")).toEqual([]);
    expect(searchRecipes("a !")).toEqual([]);
  });

  it("returns empty when nothing matches", () => {
    expect(searchRecipes("blockchain kubernetes")).toEqual([]);
  });
});
