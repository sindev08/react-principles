import pc from "picocolors";
import { readConfig, resolveOutputPath, writeFile } from "../utils/fs";
import { getAll, getTemplate, resolve } from "../registry";
import { installPackages } from "../utils/pm";

export async function add(names: string[], cwd: string): Promise<void> {
  const config = readConfig(cwd);

  if (!config) {
    console.log(pc.red("No components.json found. Run `npx react-principles init` first."));
    process.exit(1);
  }

  // Handle "add --all" shorthand
  const targets = names.length === 1 && names[0] === "--all"
    ? getAll().filter((e) => e.target === "components").map((e) => e.name)
    : names;

  // Validate + resolve in one pass to avoid double lookup
  const unknown: string[] = [];
  const seen = new Set<string>();
  const toInstall = targets.flatMap((n) => {
    const entries = resolve(n);
    if (entries.length === 0) { unknown.push(n); return []; }
    return entries.filter((e) => {
      if (seen.has(e.name)) return false;
      seen.add(e.name);
      return true;
    });
  });

  if (unknown.length > 0) {
    const available = getAll()
      .filter((e) => e.target === "components")
      .map((e) => e.name)
      .sort()
      .join(", ");
    console.log(pc.red(`Unknown: ${unknown.join(", ")}`));
    console.log(pc.gray(`Available: ${available}`));
    process.exit(1);
  }

  const allNpmDeps = new Set<string>();
  const written: string[] = [];
  const skipped: string[] = [];

  for (const entry of toInstall) {
    const outputPath = resolveOutputPath(entry.outputFile, entry.target, config, cwd);
    const content = getTemplate(entry.templateKey);

    if (!content) {
      console.log(pc.yellow(`⚠ No template found for ${entry.name}, skipping.`));
      continue;
    }

    const didWrite = writeFile(content, outputPath);
    const label = [config.componentsDir, config.hooksDir, config.libDir]
      .find((d) => outputPath.includes(d))
      ?.concat("/", entry.outputFile) ?? entry.outputFile;

    if (didWrite) {
      written.push(label);
    } else {
      skipped.push(label);
    }

    for (const dep of entry.npmDeps) allNpmDeps.add(dep);
  }

  // Print results
  for (const f of written) console.log(pc.green("✓") + ` Created ${f}`);
  for (const f of skipped) console.log(pc.gray("–") + ` Skipped ${f} (already exists)`);

  if (allNpmDeps.size > 0) {
    console.log(pc.cyan("\nInstalling dependencies..."));
    installPackages([...allNpmDeps], cwd);
  }

  if (written.length === 0 && allNpmDeps.size === 0) {
    console.log(pc.gray("\nNo changes — all components already exist.\n"));
    return;
  }

  if (written.length > 0) {
    console.log(pc.bold(pc.green("\nDone!\n")));
  }
}
