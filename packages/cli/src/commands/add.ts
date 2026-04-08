import pc from "picocolors";
import { readConfig, resolveOutputPath, writeFile } from "../utils/fs";
import { getAll, getEntry, getTemplate, resolve } from "../registry";
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

  const unknown = targets.filter((n) => !getEntry(n));
  if (unknown.length > 0) {
    console.log(pc.red(`Unknown component(s): ${unknown.join(", ")}`));
    console.log(pc.gray("Run `npx react-principles list` to see available components."));
    process.exit(1);
  }

  // Resolve all entries including transitive deps, dedup
  const seen = new Set<string>();
  const toInstall = targets.flatMap((n) => resolve(n)).filter((e) => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });

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

  if (written.length > 0) {
    console.log(pc.bold(pc.green("\nDone!\n")));
  }
}
