import { execSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";

export type PackageManager = "pnpm" | "yarn" | "npm";

export function detectPackageManager(cwd: string): PackageManager {
  if (existsSync(join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(cwd, "yarn.lock"))) return "yarn";
  return "npm";
}

export function installPackages(deps: string[], cwd: string): void {
  if (deps.length === 0) return;

  const pm = detectPackageManager(cwd);
  const cmd = pm === "yarn" ? "yarn add" : `${pm} install`;
  const list = deps.join(" ");

  try {
    execSync(`${cmd} ${list}`, { cwd, stdio: "inherit" });
  } catch {
    throw new Error(`Failed to install packages with ${pm}. Run manually: ${cmd} ${list}`);
  }
}
