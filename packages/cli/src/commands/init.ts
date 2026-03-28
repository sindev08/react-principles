import { existsSync } from "fs";
import { join } from "path";
import prompts from "prompts";
import pc from "picocolors";
import {
  type Config,
  detectFramework,
  detectTsconfigAliases,
  getDefaultConfig,
  readConfig,
  resolveOutputPath,
  writeConfig,
  writeFile,
} from "../utils/fs";
import { getEntry, getTemplate } from "../registry";
import { installPackages } from "../utils/pm";
import { setupGlobalsCss } from "../utils/css";

const FRAMEWORK_LABELS: Record<Config["framework"], string> = {
  next: "Next.js",
  vite: "Vite",
  remix: "Remix",
  other: "Other",
};

export async function init(cwd: string, frameworkFlag?: string): Promise<void> {
  const existing = readConfig(cwd);
  if (existing) {
    console.log(pc.yellow("components.json already exists. Remove it to re-run init."));
    return;
  }

  console.log(pc.bold("\nInitializing react-principles components...\n"));

  // Auto-detect
  const detectedFramework = (frameworkFlag as Config["framework"]) ?? detectFramework(cwd);
  const detectedAliases = detectTsconfigAliases(cwd);
  const defaults = getDefaultConfig();

  // Merge detected aliases into defaults
  if (detectedAliases.components) defaults.aliases.components = detectedAliases.components;
  if (detectedAliases.hooks) defaults.aliases.hooks = detectedAliases.hooks;
  if (detectedAliases.lib) defaults.aliases.lib = detectedAliases.lib;

  const answers = await prompts(
    [
      {
        type: "select",
        name: "framework",
        message: "Which framework are you using?",
        choices: [
          { title: "Next.js", value: "next" },
          { title: "Vite", value: "vite" },
          { title: "Remix", value: "remix" },
          { title: "Other", value: "other" },
        ],
        initial: ["next", "vite", "remix", "other"].indexOf(detectedFramework),
        hint: detectedFramework !== "other"
          ? `detected: ${FRAMEWORK_LABELS[detectedFramework]}`
          : undefined,
      },
      {
        type: "text",
        name: "componentsDir",
        message: "Where should components be installed?",
        initial: defaults.componentsDir,
      },
      {
        type: "text",
        name: "hooksDir",
        message: "Where should hooks be installed?",
        initial: defaults.hooksDir,
      },
      {
        type: "text",
        name: "libDir",
        message: "Where should utilities be installed?",
        initial: defaults.libDir,
      },
    ],
    {
      onCancel: () => {
        console.log(pc.red("\nSetup cancelled."));
        process.exit(0);
      },
    }
  );

  const framework = answers.framework as Config["framework"];
  const rsc = framework === "next";

  const config: Config = {
    framework,
    rsc,
    tsx: true,
    componentsDir: answers.componentsDir as string,
    hooksDir: answers.hooksDir as string,
    libDir: answers.libDir as string,
    aliases: {
      components: `@/${(answers.componentsDir as string).replace(/^src\//, "")}`,
      hooks: `@/${(answers.hooksDir as string).replace(/^src\//, "")}`,
      lib: `@/${(answers.libDir as string).replace(/^src\//, "")}`,
    },
  };

  writeConfig(config, cwd);
  console.log(pc.green("\n✓") + " Created components.json");

  // Install cn utility
  const utilsEntry = getEntry("utils");
  if (utilsEntry) {
    const outputPath = resolveOutputPath(utilsEntry.outputFile, utilsEntry.target, config, cwd);
    const written = writeFile(getTemplate(utilsEntry.templateKey), outputPath);
    const rel = join(config.libDir, utilsEntry.outputFile);
    console.log(
      written
        ? pc.green("✓") + ` Created ${rel}`
        : pc.gray("–") + ` Skipped ${rel} (already exists)`
    );

    const hasDeps = utilsEntry.npmDeps.some((d) => !existsSync(join(cwd, "node_modules", d)));
    if (hasDeps) {
      console.log(pc.cyan("\nInstalling dependencies..."));
      installPackages([...utilsEntry.npmDeps, "tailwind-animate"], cwd);
    }
  }

  // Auto-setup globals.css
  const cssResult = setupGlobalsCss(cwd, framework);
  if (cssResult) console.log(pc.green("✓") + ` Updated ${cssResult}`);

  console.log(
    pc.bold(pc.green("\nDone!")) +
    ` Framework: ${FRAMEWORK_LABELS[framework]} | RSC: ${rsc ? "yes" : "no"}\n` +
    `Run ${pc.cyan("npx react-principles-cli add <component>")} to add components.\n`
  );
}
