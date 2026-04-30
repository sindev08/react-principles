import { z } from "zod";

/**
 * Preset configuration schema for the Configurator wizard
 * This defines the complete state that gets encoded/decoded
 */

// Style presets
export type StylePreset = "arc" | "edge" | "soleil";

// Radius options
export type RadiusOption = "none" | "sm" | "md" | "lg" | "full";

// Framework options
export type FrameworkOption = "nextjs" | "vite";

// Color configuration
export interface PresetColors {
  base: string; // Base color (hex)
  brand: string; // Brand/primary color (hex)
  accent: string; // Accent color (hex)
  chart: string; // Chart color (hex)
}

// Font configuration
export interface PresetFonts {
  header: string; // Google Font name for headers
  body: string; // Google Font name for body text
}

// Stack configuration
export interface PresetStack {
  framework: FrameworkOption;
  stateManagement: boolean; // Zustand
  dataFetching: boolean; // TanStack Query
  forms: boolean; // React Hook Form + Zod
  monorepo: boolean;
  rtl: boolean;
}

/**
 * Complete preset configuration
 * Used throughout the Configurator wizard
 */
export interface PresetConfig {
  style: StylePreset;
  colors: PresetColors;
  fonts: PresetFonts;
  iconSet: string; // Iconify collection name
  radius: RadiusOption;
  components: string[]; // Selected component names
  stack: PresetStack;
  version: number; // Schema version for migration
}

// Zod schema for validation
export const presetColorsSchema = z.object({
  base: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  brand: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  accent: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  chart: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

export const presetFontsSchema = z.object({
  header: z.string().min(1, "Header font is required"),
  body: z.string().min(1, "Body font is required"),
});

export const presetStackSchema = z.object({
  framework: z.enum(["nextjs", "vite"]),
  stateManagement: z.boolean(),
  dataFetching: z.boolean(),
  forms: z.boolean(),
  monorepo: z.boolean(),
  rtl: z.boolean(),
});

export const presetConfigSchema = z.object({
  style: z.enum(["arc", "edge", "soleil"]),
  colors: presetColorsSchema,
  fonts: presetFontsSchema,
  iconSet: z.string().min(1, "Icon set is required"),
  radius: z.enum(["none", "sm", "md", "lg", "full"]),
  components: z.array(z.string()),
  stack: presetStackSchema,
  version: z.number().int().positive(),
});

export type ValidatedPresetConfig = z.infer<typeof presetConfigSchema>;
