import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";

export interface Config {
  framework: "next" | "vite" | "remix" | "other";
  rsc: boolean;
  tsx: boolean;
  componentsDir: string;
  hooksDir: string;
  libDir: string;
  aliases: {
    components: string;
    hooks: string;
    lib: string;
  };
}

const CONFIG_FILE = "components.json";

const DEFAULT_CONFIG: Config = {
  framework: "next",
  rsc: true,
  tsx: true,
  componentsDir: "src/components/ui",
  hooksDir: "src/hooks",
  libDir: "src/lib",
  aliases: {
    components: "@/components/ui",
    hooks: "@/hooks",
    lib: "@/lib",
  },
};

export function readConfig(cwd: string): Config | null {
  const path = join(cwd, CONFIG_FILE);
  if (!existsSync(path)) return null;
  try {
    return JSON.parse(readFileSync(path, "utf8")) as Config;
  } catch {
    return null;
  }
}

export function writeConfig(config: Config, cwd: string): void {
  writeFileSync(join(cwd, CONFIG_FILE), JSON.stringify(config, null, 2) + "\n", "utf8");
}

export function getDefaultConfig(): Config {
  return structuredClone(DEFAULT_CONFIG);
}

/** Reads tsconfig.json and extracts path aliases mapped to @/* patterns. */
export function detectTsconfigAliases(cwd: string): Partial<Config["aliases"]> {
  const candidates = ["tsconfig.json", "tsconfig.app.json", "jsconfig.json"];

  for (const file of candidates) {
    const tsConfigPath = join(cwd, file);
    if (!existsSync(tsConfigPath)) continue;

    try {
      // Strip comments before parsing (tsconfig allows comments)
      const raw = readFileSync(tsConfigPath, "utf8")
        .replace(/\/\/.*$/gm, "")
        .replace(/\/\*[\s\S]*?\*\//g, "");

      const tsConfig = JSON.parse(raw) as {
        compilerOptions?: { paths?: Record<string, string[]> };
      };

      const paths = tsConfig.compilerOptions?.paths ?? {};
      const aliases: Partial<Config["aliases"]> = {};

      for (const [alias] of Object.entries(paths)) {
        const clean = alias.replace(/\/\*$/, "");
        // Map common aliases to our config keys
        if (clean === "@") {
          aliases.components = `${clean}/components/ui`;
          aliases.hooks = `${clean}/hooks`;
          aliases.lib = `${clean}/lib`;
        }
      }

      return aliases;
    } catch {
      // ignore parse errors
    }
  }

  return {};
}

/** Reads package.json and detects the framework. */
export function detectFramework(cwd: string): Config["framework"] {
  const pkgPath = join(cwd, "package.json");
  if (!existsSync(pkgPath)) return "other";

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, "utf8")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const deps = {
      ...pkg.dependencies,
      ...pkg.devDependencies,
    };

    if (deps["next"]) return "next";
    if (deps["remix"] || deps["@remix-run/react"]) return "remix";
    if (deps["vite"] || deps["@vitejs/plugin-react"]) return "vite";
    return "other";
  } catch {
    return "other";
  }
}

export function resolveOutputPath(
  outputFile: string,
  target: "components" | "hooks" | "lib",
  config: Config,
  cwd: string
): string {
  const base =
    target === "components"
      ? config.componentsDir
      : target === "hooks"
        ? config.hooksDir
        : config.libDir;

  return join(cwd, base, outputFile);
}

export function writeFile(content: string, outputPath: string): boolean {
  const dir = dirname(outputPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  if (existsSync(outputPath)) return false;

  writeFileSync(outputPath, content, "utf8");
  return true;
}
