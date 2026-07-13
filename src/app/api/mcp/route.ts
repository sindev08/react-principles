import { after } from "next/server";
import { createMcpHandler } from "mcp-handler";
// The MCP SDK validates tool inputs with zod v3 — use the v3 compat entry
import { z } from "zod/v3";
import { getRecipeDetail } from "@/features/cookbook/data";
import { formatRecipeMarkdown } from "@/lib/recipe-md";
import { listPublishedRecipes, searchRecipes } from "@/lib/recipe-search";
import {
  listComponents,
  searchComponents,
  getComponent,
  type ComponentSummary,
} from "@/lib/ui-registry";
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

function formatComponents(components: ComponentSummary[]): string {
  return components
    .map((c) => {
      const deps = [...c.internalDeps, ...c.npmDeps];
      const suffix = deps.length ? ` (deps: ${deps.join(", ")})` : "";
      return `- \`${c.name}\` [${c.target}] — ${c.description}${suffix}`;
    })
    .join("\n");
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

    server.registerTool(
      "list_components",
      {
        title: "List Components",
        description:
          "List all React Principles UI Kit components (Tailwind v4, accessible, copy-paste). Each entry has a name, target dir, description, and dependencies. Use get_component for the full source.",
        inputSchema: {},
      },
      async () => {
        trackToolCall("list_components");
        return text(
          `# React Principles — UI Kit Components\n\n${formatComponents(listComponents())}\n\nInstall any with: npx react-principles add <name> — or use get_component for the source.`,
        );
      },
    );

    server.registerTool(
      "search_components",
      {
        title: "Search Components",
        description:
          "Search React Principles UI Kit components by keyword (matches name and description). Returns ranked matches with names for get_component.",
        inputSchema: {
          query: z.string().min(1).describe("Keywords, e.g. 'dialog' or 'date picker'"),
          limit: z
            .number()
            .int()
            .min(1)
            .max(30)
            .optional()
            .describe("Max results (default 8)"),
        },
      },
      async ({ query, limit }) => {
        const results = searchComponents(query, limit ?? 8);
        trackToolCall("search_components", { results: results.length });
        if (results.length === 0) {
          return text(
            `No components matched "${query}". Try list_components to see everything.`,
          );
        }
        return text(
          `Components matching "${query}":\n\n${formatComponents(results)}\n\nUse get_component with a name for the source.`,
        );
      },
    );

    server.registerTool(
      "get_component",
      {
        title: "Get Component",
        description:
          "Get a React Principles UI Kit component: full source (owned after install, matches the CLI output), the install command, and its dependencies. Run the install command to let the CLI handle deps and placement, or add the source directly with the listed dependencies.",
        inputSchema: {
          name: z
            .string()
            .describe("Component name, e.g. 'dialog'. See list_components."),
        },
      },
      async ({ name }) => {
        const component = getComponent(name);
        trackToolCall("get_component", { name, found: component !== null });
        if (!component) {
          return text(
            `Component "${name}" not found. Available components:\n\n${formatComponents(listComponents())}`,
          );
        }

        const deps = component.resolvedNpmDeps.length
          ? component.resolvedNpmDeps.join(", ")
          : "none";
        const lang = component.outputFile.endsWith(".tsx") ? "tsx" : "ts";

        return text(
          [
            `# ${component.name}`,
            "",
            component.description,
            "",
            `**Install:** \`${component.installCommand}\` (handles dependencies and file placement)`,
            `**Target:** ${component.target}/${component.outputFile}`,
            `**npm dependencies:** ${deps}`,
            component.internalDeps.length
              ? `**Internal dependencies:** ${component.internalDeps.join(", ")}`
              : "",
            "",
            "To add manually, install the npm dependencies above and create the file below:",
            "",
            `\`\`\`${lang}`,
            component.source,
            "```",
          ]
            .filter((line) => line !== "")
            .join("\n"),
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
