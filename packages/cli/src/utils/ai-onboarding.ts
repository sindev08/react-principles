import { execSync } from "child_process";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import pc from "picocolors";

const LLMS_URL = "https://www.reactprinciples.dev/llms.txt";
const MCP_ENDPOINT = "https://www.reactprinciples.dev/api/mcp";
const SKILLS_CMD = "npx skills add sindev08/react-principles-skills";

const BEGIN_MARKER = "<!-- BEGIN react-principles -->";
const END_MARKER = "<!-- END react-principles -->";

/** Short offline fallback if the live corpus can't be fetched. */
const FALLBACK_PRINCIPLES = `# React Principles

Production-grade React patterns. Full corpus: ${LLMS_URL}

- Feature-sliced folders: \`src/features/<name>/\` owns its components, hooks, stores, data; shared code in \`src/shared/\`, UI primitives in \`src/ui/\`; import via the \`@/\` alias.
- TypeScript: no \`any\`, no \`!\`, use \`import type\`, prefer optional chaining.
- Components: props extend native HTMLAttributes; variants as \`Record<>\` constants (not cva); merge classes with \`cn()\`.
- State taxonomy: local \`useState\`, shared client state in Zustand, server state in React Query — never API data in Zustand.
- Forms: Zod schema is the single source of truth; \`zodResolver\`; error messages in the schema, not JSX.
- Services: calls go through \`createApiClient\`; the chain is service → hook → component.`;

async function fetchPrinciples(): Promise<string> {
  try {
    const res = await fetch(LLMS_URL);
    if (!res.ok) return FALLBACK_PRINCIPLES;
    return (await res.text()).trim();
  } catch {
    return FALLBACK_PRINCIPLES;
  }
}

function buildBlock(principles: string): string {
  return [
    BEGIN_MARKER,
    "<!-- Managed by react-principles. Re-run `npx react-principles init` to refresh. -->",
    "",
    principles,
    "",
    END_MARKER,
  ].join("\n");
}

/**
 * Writes or refreshes the delimited React Principles block in AGENTS.md.
 * Never clobbers surrounding content — replaces only the marked block, or
 * appends it if the file exists without one.
 */
export async function writeAgentsFile(
  cwd: string,
): Promise<"created" | "updated"> {
  const principles = await fetchPrinciples();
  const block = buildBlock(principles);
  const path = join(cwd, "AGENTS.md");

  if (!existsSync(path)) {
    writeFileSync(path, `${block}\n`, "utf8");
    return "created";
  }

  const current = readFileSync(path, "utf8");
  const begin = current.indexOf(BEGIN_MARKER);
  const end = current.indexOf(END_MARKER);

  if (begin !== -1 && end !== -1 && end > begin) {
    const next =
      current.slice(0, begin) + block + current.slice(end + END_MARKER.length);
    writeFileSync(path, next, "utf8");
    return "updated";
  }

  const separator = current.endsWith("\n") ? "\n" : "\n\n";
  writeFileSync(path, `${current}${separator}${block}\n`, "utf8");
  return "updated";
}

interface McpConfig {
  mcpServers?: Record<string, { url?: string; command?: string }>;
  [key: string]: unknown;
}

/**
 * Merges the reactprinciples remote server into .mcp.json, preserving any
 * existing servers. Returns null if the file exists but isn't valid JSON,
 * so we never overwrite a config we can't safely parse.
 */
export function writeMcpConfig(cwd: string): "created" | "updated" | null {
  const path = join(cwd, ".mcp.json");
  let config: McpConfig = {};

  if (existsSync(path)) {
    try {
      config = JSON.parse(readFileSync(path, "utf8")) as McpConfig;
    } catch {
      return null;
    }
  }

  const existed = existsSync(path);
  config.mcpServers = {
    ...config.mcpServers,
    reactprinciples: { url: MCP_ENDPOINT },
  };

  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  return existed ? "updated" : "created";
}

export function runSkillsInstall(cwd: string): boolean {
  try {
    execSync(SKILLS_CMD, { cwd, stdio: "inherit" });
    return true;
  } catch {
    return false;
  }
}

export { SKILLS_CMD, MCP_ENDPOINT };

export function logSkillsHint(): void {
  console.log(
    pc.gray("  Install the React Principles AI skills later with:\n  ") +
      pc.cyan(SKILLS_CMD),
  );
}
