import type { MetadataRoute } from "next";
import { RECIPES } from "@/features/cookbook/data/cookbook-data";
import { getRecipeDetail } from "@/features/cookbook/data";
import { DOCS_NAV } from "@/features/docs/components/docs-nav";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static top-level pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/nextjs/cookbook`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
  ];

  // Docs pages (only published — skip "soon" items)
  const docsPages: MetadataRoute.Sitemap = DOCS_NAV.flatMap((group) =>
    group.items
      .filter((item) => !item.soon)
      .map((item) => ({
        url: `${BASE_URL}${item.href}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      })),
  );

  // Cookbook recipe pages — only those with full detail content
  // Use nextjs as canonical; vitejs is excluded (duplicate content)
  const recipePages: MetadataRoute.Sitemap = RECIPES.filter((recipe) =>
    getRecipeDetail(recipe.slug) !== null,
  ).map((recipe) => ({
    url: `${BASE_URL}/nextjs/cookbook/${recipe.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...docsPages, ...recipePages];
}
