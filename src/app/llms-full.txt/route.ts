import { generateFullLlmsTxt } from "@/lib/llms-txt";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateFullLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
