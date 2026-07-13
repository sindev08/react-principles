import { after } from "next/server";
import { createMcpHandler } from "mcp-handler";
// The MCP SDK validates tool inputs with zod v3 — use the v3 compat entry
import { z } from "zod/v3";
import { getRecipeDetail } from "@/features/cookbook/data";
import { formatRecipeMarkdown } from "@/lib/recipe-md";
import { listPublishedRecipes, searchRecipes } from "@/lib/recipe-search";
import { trackEvent, type EventProps } from "@/lib/analytics";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

/** Record a tool call after the response, without blocking it. */
function trackToolCall(tool: string, props?: EventProps) {
  after(() => trackEvent("mcp.tool_call", { tool, ...props }));
}

function text(value: string) {
  return { content: [{ type: "text" as const, text: value }] };
}

function formatSummaries(
  recipes: ReturnType<typeof listPublishedRecipes>,
): string {
  return recipes
    .map(
      (r) =>
        `- \`${r.slug}\` — **${r.title}** (${r.category}): ${r.description}`,
    )
    .join("\n");
}

const handler = createMcpHandler(
  (server) => {
    server.registerTool(
      "list_recipes",
      {
        title: "List Recipes",
        description:
          "List all published React Principles cookbook recipes with slug, title, category, and description. Use get_recipe with a slug for full content.",
        inputSchema: {},
      },
      async () => {
        trackToolCall("list_recipes");
        return text(
          `# React Principles — Recipes\n\n${formatSummaries(listPublishedRecipes())}\n\nWeb version: ${SITE_URL}/cookbook`,
        );
      },
    );

    server.registerTool(
      "get_recipe",
      {
        title: "Get Recipe",
        description:
          "Get a React Principles cookbook recipe as markdown: principle, rules, pattern code, and framework implementations (Next.js/Vite).",
        inputSchema: {
          slug: z
            .string()
            .describe("Recipe slug, e.g. 'form-validation'. See list_recipes."),
        },
      },
      async ({ slug }) => {
        const detail = getRecipeDetail(slug);
        trackToolCall("get_recipe", { slug, found: detail !== null });
        if (!detail) {
          return text(
            `Recipe "${slug}" not found. Available recipes:\n\n${formatSummaries(listPublishedRecipes())}`,
          );
        }
        return text(formatRecipeMarkdown(detail));
      },
    );

    server.registerTool(
      "search_recipes",
      {
        title: "Search Recipes",
        description:
          "Search React Principles cookbook recipes by keyword (matches title, rules, description, and principle). Returns ranked matches with slugs for get_recipe.",
        inputSchema: {
          query: z.string().min(1).describe("Keywords, e.g. 'form validation'"),
          limit: z
            .number()
            .int()
            .min(1)
            .max(20)
            .optional()
            .describe("Max results (default 5)"),
        },
      },
      async ({ query, limit }) => {
        const results = searchRecipes(query, limit ?? 5);
        trackToolCall("search_recipes", { results: results.length });
        if (results.length === 0) {
          return text(
            `No recipes matched "${query}". Try broader keywords or list_recipes.`,
          );
        }
        return text(
          `Recipes matching "${query}":\n\n${formatSummaries(results)}\n\nUse get_recipe with a slug for full content.`,
        );
      },
    );
  },
  {
    serverInfo: {
      name: "react-principles",
      version: "1.0.0",
    },
  },
  {
    basePath: "/api",
    maxDuration: 60,
  },
);

export { handler as GET, handler as POST };
