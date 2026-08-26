import { marked } from "marked";

const REPO_OWNER = "sindev08";
const REPO_NAME = "react-principles-skills";
const GITHUB_API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;
const REVALIDATE_SECONDS = 3600;

export type SkillCategory = "umbrella" | "review" | "scaffolding" | "internal";

export interface Skill {
  name: string;
  description: string;
  category: SkillCategory;
  allowedTools: string[];
  disableModelInvocation: boolean;
  rawMarkdown: string;
  bodyHtml: string;
}

export interface SkillsBundle {
  skills: Skill[];
  version: string | null;
  repoUrl: string;
  installCommand: string;
}

const CATEGORY_MAP: Record<string, SkillCategory> = {
  reactprinciples: "umbrella",
  "reactprinciples-review": "review",
  "reactprinciples-audit-recipe": "internal",
  "reactprinciples-component": "scaffolding",
  "reactprinciples-folder-structure": "scaffolding",
  "reactprinciples-form": "scaffolding",
  "reactprinciples-hook": "scaffolding",
  "reactprinciples-query": "scaffolding",
  "reactprinciples-recipe": "internal",
  "reactprinciples-store": "scaffolding",
};

interface FrontmatterResult {
  data: {
    name?: string;
    description?: string;
    "allowed-tools"?: string;
    "disable-model-invocation"?: string;
  };
  body: string;
}

function parseFrontmatter(raw: string): FrontmatterResult | null {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match?.[1] || match[2] === undefined) return null;
  const [, fm, body] = match;
  const data: Record<string, string> = {};
  for (const line of fm.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    data[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return { data, body };
}

interface GitHubContentItem {
  name: string;
  type: "file" | "dir";
}

async function ghFetch<T>(path: string): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (process.env.GITHUB_TOKEN_RP) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN_RP}`;
  }
  const res = await fetch(`${GITHUB_API_BASE}${path}`, {
    headers,
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

async function fetchRaw(url: string): Promise<string> {
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) {
    throw new Error(`Raw fetch ${url} failed: ${res.status}`);
  }
  return res.text();
}

async function fetchSkillFolders(): Promise<string[]> {
  const items = await ghFetch<GitHubContentItem[]>("/contents/skills");
  return items.filter((i) => i.type === "dir").map((i) => i.name);
}

async function fetchLatestVersion(): Promise<string | null> {
  try {
    const release = await ghFetch<{ tag_name: string }>("/releases/latest");
    return release.tag_name;
  } catch {
    return null;
  }
}

async function fetchSkill(folder: string): Promise<Skill | null> {
  const rawUrl = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/skills/${folder}/SKILL.md`;
  const raw = await fetchRaw(rawUrl);
  const parsed = parseFrontmatter(raw);
  if (!parsed) return null;
  const allowedTools = parsed.data["allowed-tools"]
    ?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];
  return {
    name: parsed.data.name ?? folder,
    description: parsed.data.description ?? "",
    category: CATEGORY_MAP[folder] ?? "internal",
    allowedTools,
    disableModelInvocation:
      parsed.data["disable-model-invocation"] === "true",
    rawMarkdown: raw,
    bodyHtml: await marked.parse(parsed.body),
  };
}

export async function getSkillsBundle(): Promise<SkillsBundle> {
  const folders = await fetchSkillFolders();
  const [skills, version] = await Promise.all([
    Promise.all(folders.map(fetchSkill)),
    fetchLatestVersion(),
  ]);
  return {
    skills: skills.filter((s): s is Skill => s !== null),
    version,
    repoUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
    installCommand: `npx skills add ${REPO_OWNER}/${REPO_NAME}`,
  };
}

export async function getSkill(name: string): Promise<{ skill: Skill; bundle: SkillsBundle } | null> {
  const bundle = await getSkillsBundle();
  const skill = bundle.skills.find((s) => s.name === name);
  if (!skill) return null;
  return { skill, bundle };
}

export function getSkillNames(skills: Skill[]): string[] {
  return skills.map((s) => s.name);
}
