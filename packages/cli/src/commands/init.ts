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
import {
  writeAgentsFile,
  writeMcpConfig,
  runSkillsInstall,
  logSkillsHint,
  MCP_ENDPOINT,
} from "../utils/ai-onboarding";

export interface InitOptions {
  template?: string;
  /** Run AI onboarding without prompting. */
  ai?: boolean;
  /** Skip AI onboarding entirely. */
  skipAi?: boolean;
}

const FRAMEWORK_LABELS: Record<Config["framework"], string> = {
  next: "Next.js",
  vite: "Vite",
  remix: "Remix",
  other: "Other",
};

export async function init(cwd: string, options: InitOptions = {}): Promise<void> {
  const frameworkFlag = options.template;
  const existing = readConfig(cwd);
  if (existing) {
    console.log(
      pc.yellow("components.json already exists — skipping component setup."),
    );
    await setupAiOnboarding(cwd, options);
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

  interface InitAnswers {
    framework: Config["framework"];
    componentsDir: string;
    hooksDir: string;
    libDir: string;
  }

  const nonInteractive = !process.stdin.isTTY && options.ai;

  const answers = nonInteractive
    ? ({
        framework: detectedFramework,
        componentsDir: defaults.componentsDir,
        hooksDir: defaults.hooksDir,
        libDir: defaults.libDir,
      } satisfies InitAnswers)
    : ((await prompts(
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
        },
      )) as InitAnswers);

  const framework = answers.framework;
  const rsc = framework === "next";

  const config: Config = {
    framework,
    rsc,
    tsx: true,
    componentsDir: answers.componentsDir,
    hooksDir: answers.hooksDir,
    libDir: answers.libDir,
    aliases: {
      components: `@/${answers.componentsDir.replace(/^src\//, "")}`,
      hooks: `@/${answers.hooksDir.replace(/^src\//, "")}`,
      lib: `@/${answers.libDir.replace(/^src\//, "")}`,
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
    `Run ${pc.cyan("npx react-principles add <component>")} to add components.\n`
  );

  await setupAiOnboarding(cwd, options);
}

/**
 * Wires the project into the React Principles AI ecosystem: an AGENTS.md
 * principles block, a merged .mcp.json server entry, and an optional skills
 * install. Idempotent — safe to re-run. Prompts in interactive mode; honors
 * `--ai` (run without prompting) and `--skip-ai` (skip entirely).
 */
async function setupAiOnboarding(cwd: string, options: InitOptions): Promise<void> {
  if (options.skipAi) return;

  const interactive = Boolean(process.stdin.isTTY) && !options.ai;

  if (interactive) {
    const { proceed } = (await prompts(
      {
        type: "confirm",
        name: "proceed",
        message:
          "Make your AI tools React Principles-aware? (AGENTS.md + MCP server)",
        initial: true,
      },
      { onCancel: () => ({ proceed: false }) },
    )) as { proceed?: boolean };
    if (!proceed) return;
  } else if (!options.ai) {
    // Non-interactive without an explicit --ai flag: skip silently but hint.
    console.log(
      pc.gray("Tip: run with --ai to set up AI tools (AGENTS.md + MCP server)"),
    );
    return;
  }

  console.log(pc.bold("\nSetting up AI integration...\n"));

  const agents = await writeAgentsFile(cwd);
  console.log(
    pc.green("✓") +
      ` ${agents === "created" ? "Created" : "Updated"} AGENTS.md (principles context)`,
  );

  const mcp = writeMcpConfig(cwd);
  if (mcp === null) {
    console.log(
      pc.yellow("–") +
        " Skipped .mcp.json (existing file isn't valid JSON — add manually: " +
        MCP_ENDPOINT +
        ")",
    );
  } else {
    console.log(
      pc.green("✓") +
        ` ${mcp === "created" ? "Created" : "Updated"} .mcp.json (reactprinciples server)`,
    );
  }

  await offerSkills(cwd, options);
}

async function offerSkills(cwd: string, options: InitOptions): Promise<void> {
  if (!process.stdin.isTTY || options.ai) {
    logSkillsHint();
    return;
  }

  const { install } = (await prompts(
    {
      type: "confirm",
      name: "install",
      message: "Install the React Principles AI skills now?",
      initial: false,
    },
    { onCancel: () => ({ install: false }) },
  )) as { install?: boolean };

  if (install) {
    const ok = runSkillsInstall(cwd);
    if (!ok) logSkillsHint();
  } else {
    logSkillsHint();
  }
}
