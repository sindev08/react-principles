/**
 * Style System - CSS Custom Properties for Arc, Edge, Soleil
 * Each style is a complete set of CSS custom properties
 */

export type StylePreset = "arc" | "edge" | "soleil";

export interface StyleProperties {
  // Colors
  "--color-primary": string;
  "--color-secondary": string;
  "--color-accent": string;

  // Typography scale
  "--font-size-xs": string;
  "--font-size-sm": string;
  "--font-size-base": string;
  "--font-size-lg": string;
  "--font-size-xl": string;
  "--font-size-2xl": string;
  "--font-size-3xl": string;
  "--font-size-4xl": string;

  // Spacing scale
  "--spacing-xs": string;
  "--spacing-sm": string;
  "--spacing-md": string;
  "--spacing-lg": string;
  "--spacing-xl": string;
  "--spacing-2xl": string;
  "--spacing-3xl": string;

  // Border radius
  "--radius-sm": string;
  "--radius-md": string;
  "--radius-lg": string;
  "--radius-full": string;

  // Shadows
  "--shadow-sm": string;
  "--shadow-md": string;
  "--shadow-lg": string;
  "--shadow-xl": string;

  // Border width
  "--border-width": string;

  // Font weights
  "--font-weight-normal": string;
  "--font-weight-medium": string;
  "--font-weight-semibold": string;
  "--font-weight-bold": string;

  // Line heights
  "--line-height-tight": string;
  "--line-height-normal": string;
  "--line-height-relaxed": string;
}

/**
 * Arc - Rounded, friendly, generous spacing
 * Suited for consumer apps and SaaS onboarding
 */
export const arcStyle: StyleProperties = {
  // Colors - blue primary, purple secondary, emerald accent
  "--color-primary": "#3b82f6",
  "--color-secondary": "#8b5cf6",
  "--color-accent": "#10b981",

  // Typography - slightly larger, more readable
  "--font-size-xs": "0.75rem",
  "--font-size-sm": "0.875rem",
  "--font-size-base": "1rem",
  "--font-size-lg": "1.125rem",
  "--font-size-xl": "1.25rem",
  "--font-size-2xl": "1.5rem",
  "--font-size-3xl": "1.875rem",
  "--font-size-4xl": "2.25rem",

  // Spacing - generous
  "--spacing-xs": "0.5rem",
  "--spacing-sm": "0.75rem",
  "--spacing-md": "1rem",
  "--spacing-lg": "1.5rem",
  "--spacing-xl": "2rem",
  "--spacing-2xl": "3rem",
  "--spacing-3xl": "4rem",

  // Border radius - rounded
  "--radius-sm": "0.375rem",
  "--radius-md": "0.5rem",
  "--radius-lg": "0.75rem",
  "--radius-full": "9999px",

  // Shadows - soft, friendly
  "--shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  "--shadow-md": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  "--shadow-lg": "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  "--shadow-xl": "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",

  // Border width - subtle
  "--border-width": "1px",

  // Font weights
  "--font-weight-normal": "400",
  "--font-weight-medium": "500",
  "--font-weight-semibold": "600",
  "--font-weight-bold": "700",

  // Line heights - relaxed
  "--line-height-tight": "1.25",
  "--line-height-normal": "1.5",
  "--line-height-relaxed": "1.75",
};

/**
 * Edge - Sharp, high-contrast, minimal decoration
 * Suited for dashboards and developer tools
 */
export const edgeStyle: StyleProperties = {
  // Colors - dark primary, blue secondary, indigo accent
  "--color-primary": "#0f172a",
  "--color-secondary": "#3b82f6",
  "--color-accent": "#6366f1",

  // Typography - precise, technical
  "--font-size-xs": "0.75rem",
  "--font-size-sm": "0.8125rem",
  "--font-size-base": "0.875rem",
  "--font-size-lg": "1rem",
  "--font-size-xl": "1.125rem",
  "--font-size-2xl": "1.25rem",
  "--font-size-3xl": "1.5rem",
  "--font-size-4xl": "1.875rem",

  // Spacing - tight, efficient
  "--spacing-xs": "0.25rem",
  "--spacing-sm": "0.5rem",
  "--spacing-md": "0.75rem",
  "--spacing-lg": "1rem",
  "--spacing-xl": "1.5rem",
  "--spacing-2xl": "2rem",
  "--spacing-3xl": "2.5rem",

  // Border radius - sharp
  "--radius-sm": "0rem",
  "--radius-md": "0rem",
  "--radius-lg": "0rem",
  "--radius-full": "9999px",

  // Shadows - minimal
  "--shadow-sm": "0 1px 2px 0 rgb(0 0 0 / 0.1)",
  "--shadow-md": "0 2px 4px 0 rgb(0 0 0 / 0.1)",
  "--shadow-lg": "0 4px 6px -1px rgb(0 0 0 / 0.15)",
  "--shadow-xl": "0 8px 10px -1px rgb(0 0 0 / 0.15)",

  // Border width - crisp
  "--border-width": "1px",

  // Font weights - bold hierarchy
  "--font-weight-normal": "400",
  "--font-weight-medium": "500",
  "--font-weight-semibold": "600",
  "--font-weight-bold": "700",

  // Line heights - tight
  "--line-height-tight": "1.1",
  "--line-height-normal": "1.4",
  "--line-height-relaxed": "1.6",
};

/**
 * Soleil - Warm, editorial, expressive
 * Suited for portfolios and premium landing pages
 */
export const soleilStyle: StyleProperties = {
  // Colors - warm orange primary, pink secondary, purple accent
  "--color-primary": "#f59e0b",
  "--color-secondary": "#ec4899",
  "--color-accent": "#8b5cf6",

  // Typography - elegant, variable
  "--font-size-xs": "0.75rem",
  "--font-size-sm": "0.875rem",
  "--font-size-base": "1rem",
  "--font-size-lg": "1.125rem",
  "--font-size-xl": "1.25rem",
  "--font-size-2xl": "1.5rem",
  "--font-size-3xl": "1.875rem",
  "--font-size-4xl": "2.5rem",

  // Spacing - expressive
  "--spacing-xs": "0.5rem",
  "--spacing-sm": "0.75rem",
  "--spacing-md": "1.25rem",
  "--spacing-lg": "1.75rem",
  "--spacing-xl": "2.5rem",
  "--spacing-2xl": "3.5rem",
  "--spacing-3xl": "5rem",

  // Border radius - subtle rounded
  "--radius-sm": "0.25rem",
  "--radius-md": "0.375rem",
  "--radius-lg": "0.5rem",
  "--radius-full": "9999px",

  // Shadows - warm, diffuse
  "--shadow-sm": "0 1px 3px 0 rgb(0 0 0 / 0.08)",
  "--shadow-md": "0 4px 8px -2px rgb(0 0 0 / 0.08)",
  "--shadow-lg": "0 12px 16px -4px rgb(0 0 0 / 0.08)",
  "--shadow-xl": "0 20px 24px -4px rgb(0 0 0 / 0.08)",

  // Border width - hairline
  "--border-width": "1px",

  // Font weights - editorial
  "--font-weight-normal": "350",
  "--font-weight-medium": "450",
  "--font-weight-semibold": "550",
  "--font-weight-bold": "650",

  // Line heights - editorial
  "--line-height-tight": "1.2",
  "--line-height-normal": "1.6",
  "--line-height-relaxed": "1.8",
};

/**
 * Get style properties by preset name
 */
export function getStyleProperties(preset: StylePreset): StyleProperties {
  switch (preset) {
    case "arc":
      return arcStyle;
    case "edge":
      return edgeStyle;
    case "soleil":
      return soleilStyle;
    default:
      return arcStyle;
  }
}

/**
 * Apply style properties to a DOM element (usually :root or a container)
 */
export function applyStyleProperties(
  properties: StyleProperties,
  target: HTMLElement = document.documentElement
): void {
  Object.entries(properties).forEach(([key, value]) => {
    target.style.setProperty(key, value);
  });
}

/**
 * Convert style properties to CSS string for style tag injection
 */
export function stylePropertiesToCSS(
  properties: StyleProperties,
  selector: string = ":root"
): string {
  const cssEntries = Object.entries(properties)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n");

  return `${selector} {\n${cssEntries}\n}`;
}
