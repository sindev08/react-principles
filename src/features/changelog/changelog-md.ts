import { CHANGELOG_ENTRIES, type ChangeType } from "./data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://reactprinciples.dev";

const CHANGE_LABEL: Record<ChangeType, string> = {
  added: "Added",
  changed: "Changed",
  fixed: "Fixed",
};

const HEADER = `# React Principles — Changelog

> What shipped in each release, newest first. A durable, public record of new AI capabilities, components, and changes across the cookbook, UI Kit, and CLI.

Web version: ${SITE_URL}/changelog

---
`;

/**
 * Renders the changelog entries as a single markdown document, mirroring the
 * llms.txt approach so AI tools and crawlers can read the release history.
 */
export function generateChangelogMarkdown(): string {
  const entries = CHANGELOG_ENTRIES.map((entry) => {
    const heading = entry.version
      ? `## ${entry.date} — ${entry.title} (v${entry.version})`
      : `## ${entry.date} — ${entry.title}`;

    const items = entry.items
      .map((item) => {
        const link = item.href ? ` ([details](${item.href}))` : "";
        return `- **${CHANGE_LABEL[item.type]}** — ${item.text}${link}`;
      })
      .join("\n");

    return `${heading}\n\n${entry.summary}\n\n${items}`;
  }).join("\n\n---\n\n");

  return `${HEADER}\n${entries}\n`;
}
