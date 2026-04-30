import type { PresetConfig } from "./config-schema";

/**
 * Default preset configuration
 * Used as safe fallback when decoding fails
 */
export const DEFAULT_PRESET: PresetConfig = {
  style: "arc",
  colors: {
    // Tailwind CSS default colors
    base: "#0f172a", // slate-900
    brand: "#3b82f6", // blue-500
    accent: "#8b5cf6", // violet-500
    chart: "#10b981", // emerald-500
  },
  fonts: {
    header: "Inter",
    body: "Inter",
  },
  iconSet: "material-symbols",
  radius: "md",
  components: [], // User selects components
  stack: {
    framework: "nextjs",
    stateManagement: true, // Zustand
    dataFetching: true, // TanStack Query
    forms: true, // React Hook Form + Zod
    monorepo: false,
    rtl: false,
  },
  version: 1,
};

/**
 * Schema version constant
 * Increment this when breaking changes are made to PresetConfig
 */
export const PRESET_SCHEMA_VERSION = 1;
