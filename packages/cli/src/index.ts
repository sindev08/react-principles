#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import { init } from "./commands/init";
import { add } from "./commands/add";
import { getAll } from "./registry";

const program = new Command();

program
  .name("react-principles")
  .description("Add react-principles UI components to your project")
  .version("0.0.1");

program
  .command("init")
  .description("Initialize components.json config and install the cn() utility")
  .option("-t, --template <framework>", "Framework: next | vite | remix | other")
  .action(async (opts: { template?: string }) => {
    await init(process.cwd(), opts.template);
  });

program
  .command("add <components...>")
  .description("Add one or more components to your project")
  .action(async (components: string[]) => {
    await add(components, process.cwd());
  });

program
  .command("list")
  .description("List all available components")
  .action(() => {
    const entries = getAll().filter((e) => e.target === "components");
    console.log(pc.bold("\nAvailable components:\n"));
    for (const e of entries) {
      console.log(`  ${pc.cyan(e.name.padEnd(20))} ${pc.gray(e.description)}`);
    }
    console.log();
  });

program.parse();
