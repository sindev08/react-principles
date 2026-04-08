import cliPkg from "../../../packages/cli/package.json";
import rootPkg from "../../../package.json";

/** Extract major version number from a semver range like "^19.2.4" → "19" */
function major(range: string): string {
  const match = range.replace(/^[\^~>=<\s]+/, "").match(/^(\d+)/);
  return match?.[1] ?? range;
}

/** CLI package version published to npm */
export const CLI_VERSION = cliPkg.version;

/** Root project version */
export const PROJECT_VERSION = rootPkg.version;

/** Dependency versions read from root package.json (raw semver ranges) */
export const DEP_VERSIONS = {
  react: rootPkg.devDependencies.react,
  reactDom: rootPkg.devDependencies["react-dom"],
  typescript: rootPkg.devDependencies.typescript,
  tailwindcss: rootPkg.devDependencies.tailwindcss,
} as const;

/** Major version numbers for display in docs */
export const MAJOR_VERSIONS = {
  react: major(DEP_VERSIONS.react),
  typescript: major(DEP_VERSIONS.typescript),
  tailwindcss: major(DEP_VERSIONS.tailwindcss),
} as const;
