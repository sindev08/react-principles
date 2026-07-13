import { generateChangelogMarkdown } from "@/features/changelog";

export const dynamic = "force-static";

export function GET() {
  return new Response(generateChangelogMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
}
