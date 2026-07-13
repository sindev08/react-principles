import registryData from "./ui-registry.json";
import { UI_TEMPLATES } from "./ui-templates.generated";

export interface RegistryEntry {
  name: string;
  description: string;
  /** Key in UI_TEMPLATES holding the component source. */
  templateKey: string;
  /** Output filename in the user's project. */
  outputFile: string;
  /** Other registry entries that must be installed first. */
  internalDeps: string[];
  /** npm packages the component needs. */
  npmDeps: string[];
  target: "components" | "hooks" | "lib";
}

export const REGISTRY = registryData as RegistryEntry[];

const BY_NAME = new Map(REGISTRY.map((e) => [e.name, e]));

export interface ComponentSummary {
  name: string;
  description: string;
  target: RegistryEntry["target"];
  internalDeps: string[];
  npmDeps: string[];
}

export interface ComponentDetail extends ComponentSummary {
  outputFile: string;
  /** Full component source, transformed to match what the CLI installs. */
  source: string;
  /** `npx react-principles add <name>` — the canonical install path. */
  installCommand: string;
  /** All npm packages needed, including those of transitive internal deps. */
  resolvedNpmDeps: string[];
}

function toSummary(entry: RegistryEntry): ComponentSummary {
  return {
    name: entry.name,
    description: entry.description,
    target: entry.target,
    internalDeps: entry.internalDeps,
    npmDeps: entry.npmDeps,
  };
}

export function listComponents(): ComponentSummary[] {
  return REGISTRY.map(toSummary);
}

/** All npm deps of an entry plus its transitive internal deps. */
function resolveNpmDeps(entry: RegistryEntry): string[] {
  const seen = new Set<string>();
  const deps = new Set<string>();

  function walk(e: RegistryEntry) {
    if (seen.has(e.name)) return;
    seen.add(e.name);
    for (const npm of e.npmDeps) deps.add(npm);
    for (const dep of e.internalDeps) {
      const d = BY_NAME.get(dep);
      if (d) walk(d);
    }
  }

  walk(entry);
  return [...deps];
}

export function getComponent(name: string): ComponentDetail | null {
  const entry = BY_NAME.get(name);
  if (!entry) return null;

  return {
    ...toSummary(entry),
    outputFile: entry.outputFile,
    source: UI_TEMPLATES[entry.templateKey] ?? "",
    installCommand: `npx react-principles add ${entry.name}`,
    resolvedNpmDeps: resolveNpmDeps(entry),
  };
}

/**
 * Ranked keyword search over component name + description. Name matches
 * outweigh description matches (mirrors the recipe search weighting).
 */
export function searchComponents(query: string, limit = 8): ComponentSummary[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1);

  if (terms.length === 0) return [];

  return REGISTRY.map((entry) => {
    const name = entry.name.toLowerCase();
    const description = entry.description.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (name.includes(term)) score += 5;
      if (description.includes(term)) score += 2;
    }
    return { entry, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => toSummary(r.entry));
}
