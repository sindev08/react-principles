import { RECIPES } from "@/features/cookbook/data/cookbook-data";
import { getRecipeDetail } from "@/features/cookbook/data";
import { formatRecipeMarkdown } from "@/lib/recipe-md";

export const dynamic = "force-static";

export function generateStaticParams() {
  return RECIPES.filter((r) => r.status === "published").map((r) => ({
    slug: r.slug,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const detail = getRecipeDetail(slug);

  if (!detail) {
    return new Response("Recipe not found", { status: 404 });
  }

  return new Response(formatRecipeMarkdown(detail), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
