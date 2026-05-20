import { execSync } from "child_process";
import type { CliPreset } from "./preset";
import { detectPackageManager } from "./pm";

interface PackageEntry {
  name: string;
  version?: string;
  dev?: boolean;
}

const COMPONENT_DEPS: Record<string, PackageEntry[]> = {
  DataTable:   [{ name: "@tanstack/react-table", version: "^8.20.0" }],
  Chart:       [{ name: "recharts", version: "^2.15.0" }],
  DatePicker:  [{ name: "react-day-picker", version: "^9.1.4" }, { name: "date-fns", version: "^4.1.0" }],
  Calendar:    [{ name: "react-day-picker", version: "^9.1.4" }, { name: "date-fns", version: "^4.1.0" }],
  Toast:       [{ name: "sonner", version: "^2.0.0" }],
  Select:      [{ name: "@radix-ui/react-select", version: "^2.1.6" }],
  Checkbox:    [{ name: "@radix-ui/react-checkbox", version: "^1.1.4" }],
  RadioGroup:   [{ name: "@radix-ui/react-radio-group", version: "^1.2.3" }],
  Switch:      [{ name: "@radix-ui/react-switch", version: "^1.1.3" }],
  Slider:      [{ name: "@radix-ui/react-slider", version: "^1.2.3" }],
  Tabs:        [{ name: "@radix-ui/react-tabs", version: "^1.1.3" }],
  Dialog:      [{ name: "@radix-ui/react-dialog", version: "^1.1.6" }],
  Popover:     [{ name: "@radix-ui/react-popover", version: "^1.1.6" }],
  Tooltip:     [{ name: "@radix-ui/react-tooltip", version: "^1.1.8" }],
  Drawer:      [{ name: "@radix-ui/react-dialog", version: "^1.1.6" }],
  Separator:   [{ name: "@radix-ui/react-separator", version: "^1.1.2" }],
  Collapsible: [{ name: "@radix-ui/react-collapsible", version: "^1.1.3" }],
  DropdownMenu: [{ name: "@radix-ui/react-dropdown-menu", version: "^2.1.6" }],
  Carousel:    [{ name: "embla-carousel-react", version: "^8.5.0" }],
};

const STACK_DEPS: Record<string, PackageEntry[]> = {
  stateManagement: [{ name: "zustand", version: "^5.0.0" }],
  dataFetching:    [{ name: "@tanstack/react-query", version: "^5.59.0" }],
  forms:           [
    { name: "react-hook-form", version: "^7.53.0" },
    { name: "zod", version: "^4.3.6" },
    { name: "@hookform/resolvers", version: "^3.9.1" },
  ],
};

export interface ResolvedDeps {
  deps: string[];
  devDeps: string[];
}

export function resolvePresetDependencies(preset: CliPreset): ResolvedDeps {
  const seen = new Map<string, PackageEntry>();

  const add = (entry: PackageEntry) => {
    const key = entry.name;
    if (!seen.has(key)) seen.set(key, entry);
  };

  // Component deps
  for (const comp of preset.components) {
    for (const dep of COMPONENT_DEPS[comp] ?? []) {
      add(dep);
    }
  }

  // Stack deps
  if (preset.stack.stateManagement) STACK_DEPS["stateManagement"]?.forEach(add);
  if (preset.stack.dataFetching) STACK_DEPS["dataFetching"]?.forEach(add);
  if (preset.stack.forms) STACK_DEPS["forms"]?.forEach(add);

  const all = Array.from(seen.values());
  const fmt = (p: PackageEntry) => p.version ? `${p.name}@${p.version}` : p.name;

  return {
    deps: all.filter((p) => !p.dev).map(fmt),
    devDeps: all.filter((p) => p.dev).map(fmt),
  };
}

export function installPresetDependencies(
  resolved: ResolvedDeps,
  cwd: string,
  options: { dryRun?: boolean } = {},
): void {
  const pm = detectPackageManager(cwd);
  const addCmd = pm === "yarn" ? "yarn add" : `${pm} install`;
  const addDevCmd = pm === "yarn" ? "yarn add -D" : `${pm} install -D`;

  if (resolved.deps.length > 0) {
    const cmd = `${addCmd} ${resolved.deps.join(" ")}`;
    if (options.dryRun) {
      console.log(`  ${cmd}`);
    } else {
      execSync(cmd, { cwd, stdio: "inherit" });
    }
  }

  if (resolved.devDeps.length > 0) {
    const cmd = `${addDevCmd} ${resolved.devDeps.join(" ")}`;
    if (options.dryRun) {
      console.log(`  ${cmd}`);
    } else {
      execSync(cmd, { cwd, stdio: "inherit" });
    }
  }
}
