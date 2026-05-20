import { generateCompactLlmsTxt } from "@/lib/llms-txt";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateCompactLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
