import type { ChangelogEntry } from "./types";

const REPO_URL = "https://github.com/sindev08/react-principles";
const SKILLS_REPO_URL = "https://github.com/sindev08/react-principles-skills";

/**
 * Public release history, newest first.
 *
 * Keep entries truthful — only list what is live in production. Internal-only
 * work (analytics, tooling) stays out of the public record.
 */
export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    date: "2026-07-13",
    title: "React Principles is now an AI-first ecosystem.",
    summary:
      "One command wires your project into the whole ecosystem — your AI follows the principles, looks up recipes, and pulls components on its own. Principles and building blocks now share a single connection.",
    items: [
      {
        type: "added",
        text: "Remote MCP server now serves the UI Kit too: list_components, search_components, and get_component (full source, matching the CLI). One connection gives your AI both the principles and the components.",
        href: `${REPO_URL}/pull/213`,
      },
      {
        type: "added",
        text: "npx react-principles init wires an existing project into the ecosystem — it generates AGENTS.md, .mcp.json, and skills so your AI is React Principles-aware from the next prompt.",
        href: `${REPO_URL}/pull/214`,
      },
      {
        type: "added",
        text: "npx react-principles create scaffolds starters that ship AI-ready from the first commit.",
        href: `${REPO_URL}/pull/215`,
      },
      {
        type: "changed",
        text: "Skills now fetch recipe content live, so updates reach installed skills automatically (existing users need a one-time re-install).",
        href: `${SKILLS_REPO_URL}/pull/6`,
      },
    ],
  },
];
