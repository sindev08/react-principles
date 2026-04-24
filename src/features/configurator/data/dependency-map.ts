/**
 * Dependency Map - Component and Stack to npm packages mapping
 * Used by CLI to install required packages
 */

export interface PackageEntry {
  name: string;
  version?: string; // If not specified, uses latest
  dev?: boolean; // Whether to install as devDependency
}

/**
 * Component → npm packages mapping
 */
export const COMPONENT_DEPENDENCIES: Record<string, PackageEntry[]> = {
  // Data Display
  DataTable: [
    { name: "@tanstack/react-table", version: "^8.20.0" },
    { name: "@tanstack/table-core", version: "^8.20.0" },
  ],
  Chart: [
    { name: "recharts", version: "^2.15.0" },
  ],

  // Forms
  DatePicker: [
    { name: "react-day-picker", version: "^9.1.4" },
    { name: "date-fns", version: "^4.1.0" },
  ],
  Calendar: [
    { name: "react-day-picker", version: "^9.1.4" },
    { name: "date-fns", version: "^4.1.0" },
  ],

  // Feedback
  Alert: [], // No external dependencies
  Badge: [], // No external dependencies
  Progress: [], // No external dependencies
  Skeleton: [], // No external dependencies
  Spinner: [], // No external dependencies
  Toast: [
    { name: "sonner", version: "^2.0.0" },
  ],

  // Input
  Input: [], // No external dependencies
  Textarea: [], // No external dependencies
  Select: [
    { name: "@radix-ui/react-select", version: "^2.1.6" },
  ],
  Checkbox: [
    { name: "@radix-ui/react-checkbox", version: "^1.1.4" },
  ],
  Radio: [
    { name: "@radix-ui/react-radio-group", version: "^1.2.3" },
  ],
  Switch: [
    { name: "@radix-ui/react-switch", version: "^1.1.3" },
  ],
  Slider: [
    { name: "@radix-ui/react-slider", version: "^1.2.3" },
  ],

  // Navigation
  Tabs: [
    { name: "@radix-ui/react-tabs", version: "^1.1.3" },
  ],
  Breadcrumbs: [], // No external dependencies
  Pagination: [], // No external dependencies

  // Overlays
  Dialog: [
    { name: "@radix-ui/react-dialog", version: "^1.1.6" },
  ],
  Popover: [
    { name: "@radix-ui/react-popover", version: "^1.1.6" },
  ],
  Tooltip: [
    { name: "@radix-ui/react-tooltip", version: "^1.1.8" },
  ],
  Drawer: [
    { name: "@radix-ui/react-dialog", version: "^1.1.6" },
  ],

  // Layout
  Card: [], // No external dependencies
  Separator: [
    { name: "@radix-ui/react-separator", version: "^1.1.2" },
  ],
  Collapsible: [
    { name: "@radix-ui/react-collapsible", version: "^1.1.3" },
  ],

  // Other
  Avatar: [], // No external dependencies
  Button: [], // No external dependencies
  Dropdown: [
    { name: "@radix-ui/react-dropdown-menu", version: "^2.1.6" },
  ],
  Carousel: [
    { name: "embla-carousel-react", version: "^8.5.0" },
  ],
};

/**
 * Stack feature → npm packages mapping
 */
export const STACK_DEPENDENCIES: Record<
  string,
  PackageEntry[]
> = {
  stateManagement: [
    { name: "zustand", version: "^5.0.0" },
  ],
  dataFetching: [
    { name: "@tanstack/react-query", version: "^5.59.0" },
  ],
  forms: [
    { name: "react-hook-form", version: "^7.53.0" },
    { name: "zod", version: "^4.3.6" },
    { name: "@hookform/resolvers", version: "^3.9.1" },
  ],
  testing: [
    { name: "vitest", version: "^2.1.8", dev: true },
    { name: "@testing-library/react", version: "^16.1.0", dev: true },
    { name: "@testing-library/jest-dom", version: "^6.6.3", dev: true },
    { name: "@testing-library/user-event", version: "^14.5.2", dev: true },
  ],
};

/**
 * Get all dependencies for selected components
 * Automatically deduplicates packages
 */
export function getComponentDependencies(
  components: string[]
): PackageEntry[] {
  const dependencies = new Map<string, PackageEntry>();

  components.forEach((component) => {
    const deps = COMPONENT_DEPENDENCIES[component] || [];
    deps.forEach((dep) => {
      const key = `${dep.name}@${dep.version || "latest"}`;
      if (!dependencies.has(key)) {
        dependencies.set(key, dep);
      }
    });
  });

  return Array.from(dependencies.values());
}

/**
 * Get all dependencies for selected stack features
 * Automatically deduplicates packages
 */
export function getStackDependencies(
  features: string[]
): PackageEntry[] {
  const dependencies = new Map<string, PackageEntry>();

  features.forEach((feature) => {
    const deps = STACK_DEPENDENCIES[feature] || [];
    deps.forEach((dep) => {
      const key = `${dep.name}@${dep.version || "latest"}`;
      if (!dependencies.has(key)) {
        dependencies.set(key, dep);
      }
    });
  });

  return Array.from(dependencies.values());
}

/**
 * Get all dependencies for complete preset
 * Merges component and stack dependencies with deduplication
 */
export function getAllDependencies(preset: {
  components: string[];
  stack: {
    stateManagement: boolean;
    dataFetching: boolean;
    forms: boolean;
  };
}): PackageEntry[] {
  const allDeps = new Map<string, PackageEntry>();

  // Add component dependencies
  const componentDeps = getComponentDependencies(preset.components);
  componentDeps.forEach((dep) => {
    const key = `${dep.name}@${dep.version || "latest"}`;
    allDeps.set(key, dep);
  });

  // Add stack dependencies
  const stackFeatures: string[] = [];
  if (preset.stack.stateManagement) stackFeatures.push("stateManagement");
  if (preset.stack.dataFetching) stackFeatures.push("dataFetching");
  if (preset.stack.forms) stackFeatures.push("forms");

  const stackDeps = getStackDependencies(stackFeatures);
  stackDeps.forEach((dep) => {
    const key = `${dep.name}@${dep.version || "latest"}`;
    allDeps.set(key, dep);
  });

  return Array.from(allDeps.values());
}

/**
 * Convert package entries to install command string
 */
export function packagesToInstallString(
  packages: PackageEntry[],
  packageManager: "npm" | "pnpm" | "yarn" = "pnpm"
): string {
  if (packages.length === 0) return "";

  const regularDeps = packages.filter((p) => !p.dev);
  const devDeps = packages.filter((p) => p.dev);

  const formatPackage = (p: PackageEntry): string => {
    return p.version ? `${p.name}@${p.version}` : p.name;
  };

  const parts: string[] = [];

  if (regularDeps.length > 0) {
    const cmd = packageManager === "yarn" ? "add" : "install";
    parts.push(
      `${packageManager} ${cmd} ${regularDeps.map(formatPackage).join(" ")}`
    );
  }

  if (devDeps.length > 0) {
    const cmd = packageManager === "yarn" ? "add -D" : "install -D";
    parts.push(
      `${packageManager} ${cmd} ${devDeps.map(formatPackage).join(" ")}`
    );
  }

  return parts.join("\n");
}
