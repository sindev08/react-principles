import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import type { Config } from "./fs";

const GLOBALS_CANDIDATES = [
  "src/app/globals.css",
  "src/index.css",
  "src/styles/globals.css",
  "src/styles/index.css",
  "app/globals.css",
];

const TAILWIND_IMPORT = '@import "tailwindcss";';

/**
 * Ensures globals.css has @import "tailwindcss".
 * Returns the relative path of the file updated, or null if nothing changed.
 */
export function setupGlobalsCss(cwd: string, framework: Config["framework"]): string | null {
  if (framework === "vite") return null; // Vite uses index.css differently

  for (const candidate of GLOBALS_CANDIDATES) {
    const fullPath = join(cwd, candidate);
    if (!existsSync(fullPath)) continue;

    const content = readFileSync(fullPath, "utf8");

    if (content.includes("@import") && content.includes("tailwindcss")) return null;

    const updated = `${TAILWIND_IMPORT}\n${content}`.trimEnd() + "\n";
    writeFileSync(fullPath, updated, "utf8");
    return candidate;
  }

  return null;
}
