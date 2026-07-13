import { TEMPLATES } from "./templates";
import registryData from "./registry-data.json";

export interface RegistryEntry {
  name: string;
  description: string;
  /** Key in TEMPLATES */
  templateKey: string;
  /** Output filename in user's project */
  outputFile: string;
  /** Other registry entries that must be installed first */
  internalDeps: string[];
  /** npm packages to install */
  npmDeps: string[];
  /** Where the file goes: "components" | "hooks" | "lib" */
  target: "components" | "hooks" | "lib";
}

export const REGISTRY: RegistryEntry[] = registryData as unknown as RegistryEntry[];

const BY_NAME = new Map(REGISTRY.map((e) => [e.name, e]));

export function getEntry(name: string): RegistryEntry | undefined {
  return BY_NAME.get(name);
}

export function getAll(): RegistryEntry[] {
  return REGISTRY;
}

/** Returns entry + all transitive internalDeps, deps first. */
export function resolve(name: string): RegistryEntry[] {
  const entry = BY_NAME.get(name);
  if (!entry) return [];

  const visited = new Set<string>();
  const result: RegistryEntry[] = [];

  function walk(e: RegistryEntry) {
    if (visited.has(e.name)) return;
    visited.add(e.name);
    for (const dep of e.internalDeps) {
      const d = BY_NAME.get(dep);
      if (d) walk(d);
    }
    result.push(e);
  }

  walk(entry);
  return result;
}

export function getTemplate(key: string): string {
  return TEMPLATES[key] ?? "";
}
