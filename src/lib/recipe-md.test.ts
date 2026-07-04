import { describe, it, expect } from "vitest";
import { formatRecipeSection, formatRecipeMarkdown } from "./recipe-md";
import { generateCompactLlmsTxt, generateFullLlmsTxt } from "./llms-txt";
import type { RecipeDetail } from "@/features/cookbook/data/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

const FIXTURE: RecipeDetail = {
  slug: "test-recipe",
  title: "Test Recipe",
  breadcrumbCategory: "Foundations",
  description: "A recipe used for testing the markdown formatters.",
  lastUpdated: "2026-07-03",
  contributor: { name: "Test Author", role: "Maintainer" },
  principle: { text: "Keep it simple.", tip: "Really simple." },
  rules: [{ title: "Rule one", description: "Do the thing." }],
  rulesLabel: "Guidelines",
  pattern: { filename: "example.ts", code: "export const x = 1;" },
  implementation: {
    nextjs: {
      description: "Next.js implementation.",
      filename: "app/page.tsx",
      code: "export default function Page() {\n  return null;\n}",
    },
  },
};

describe("formatRecipeSection", () => {
  it("renders title, description, principle, and rules in compact mode", () => {
    const md = formatRecipeSection(FIXTURE, "compact");

    expect(md).toContain("### Test Recipe");
    expect(md).toContain("> A recipe used for testing the markdown formatters.");
    expect(md).toContain("**Principle:** Keep it simple.");
    expect(md).toContain("**Tip:** Really simple.");
    expect(md).toContain("**Guidelines:**");
    expect(md).toContain("- **Rule one** — Do the thing.");
    expect(md).toContain(`Read more: ${SITE_URL}/cookbook/test-recipe`);
  });

  it("omits code in compact mode", () => {
    const md = formatRecipeSection(FIXTURE, "compact");

    expect(md).not.toContain("```");
    expect(md).not.toContain("export const x = 1;");
  });

  it("includes pattern and implementation code in full mode", () => {
    const md = formatRecipeSection(FIXTURE, "full");

    expect(md).toContain("**Pattern** — `example.ts`");
    expect(md).toContain("```ts\nexport const x = 1;\n```");
    expect(md).toContain("**Implementation — Next.js**");
    expect(md).toContain("```tsx\nexport default function Page()");
  });

  it("respects the heading level parameter", () => {
    expect(formatRecipeSection(FIXTURE, "compact", 1)).toContain("# Test Recipe");
    expect(formatRecipeSection(FIXTURE, "compact", 2)).toContain("## Test Recipe");
  });
});

describe("formatRecipeMarkdown", () => {
  it("renders a standalone document with a top-level heading and source links", () => {
    const md = formatRecipeMarkdown(FIXTURE);

    expect(md.startsWith("# Test Recipe")).toBe(true);
    expect(md).toContain("```ts\nexport const x = 1;\n```");
    expect(md).toContain(`Source: ${SITE_URL}/nextjs/cookbook/test-recipe`);
    expect(md).toContain(`All recipes (compact): ${SITE_URL}/llms.txt`);
    expect(md).toContain(`All recipes (full): ${SITE_URL}/llms-full.txt`);
  });
});

describe("llms.txt generators", () => {
  it("compact version lists published recipes without code fences", () => {
    const txt = generateCompactLlmsTxt();

    expect(txt).toContain("# React Principles — Cookbook");
    expect(txt).toContain("### ");
    expect(txt).not.toContain("```");
  });

  it("full version includes code fences", () => {
    const txt = generateFullLlmsTxt();

    expect(txt).toContain("# React Principles — Cookbook (Full)");
    expect(txt).toContain("```");
  });
});
