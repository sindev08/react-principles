/**
 * Iconify Integration
 * Icon set picker and live preview integration
 */

export interface IconifyCollection {
  name: string;
  prefix: string; // e.g., "material-symbols", "lucide", "phosphor"
  total: number;
  author?: string;
  license?: string;
  url?: string;
}

/**
 * Popular Iconify collections for quick picks
 */
export const POPULAR_ICON_SETS: IconifyCollection[] = [
  {
    name: "Material Symbols",
    prefix: "material-symbols",
    total: 2000,
    author: "Google",
    license: "Apache 2.0",
    url: "https://fonts.google.com/icons",
  },
  {
    name: "Lucide",
    prefix: "lucide",
    total: 1500,
    author: "Lucide Contributors",
    license: "ISC",
    url: "https://lucide.dev",
  },
  {
    name: "Phosphor",
    prefix: "ph",
    total: 7000,
    author: "Phosphor Icons",
    license: "MIT",
    url: "https://phosphoricons.com",
  },
  {
    name: "Heroicons",
    prefix: "heroicons",
    total: 500,
    author: "Tailwind Labs",
    license: "MIT",
    url: "https://heroicons.com",
  },
  {
    name: "Tabler Icons",
    prefix: "tabler",
    total: 5000,
    author: "Tabler",
    license: "MIT",
    url: "https://tabler-icons.io",
  },
  {
    name: "Font Awesome",
    prefix: "fa",
    total: 2000,
    author: "Font Awesome",
    license: "CC BY 4.0",
    url: "https://fontawesome.com",
  },
  {
    name: "Feather Icons",
    prefix: "feather",
    total: 300,
    author: "Feather Icons",
    license: "MIT",
    url: "https://feathericons.com",
  },
  {
    name: "Flowbite",
    prefix: "flowbite",
    total: 500,
    author: "Flowbite",
    license: "MIT",
    url: "https://flowbite.com/icons",
  },
];

/**
 * Get all available icon sets
 */
export function getAllIconSets(): IconifyCollection[] {
  return POPULAR_ICON_SETS;
}

/**
 * Get icon set by prefix
 */
export function getIconSetByPrefix(
  prefix: string
): IconifyCollection | undefined {
  return POPULAR_ICON_SETS.find((set) => set.prefix === prefix);
}

/**
 * Validate icon set prefix
 */
export function isValidIconSet(prefix: string): boolean {
  return POPULAR_ICON_SETS.some((set) => set.prefix === prefix);
}

/**
 * Get default icon set
 */
export function getDefaultIconSet(): string {
  return "material-symbols";
}

/**
 * Sample icons from each set for preview
 */
export const SAMPLE_ICONS: Record<string, string[]> = {
  "material-symbols": ["home", "settings", "search", "favorite", "add"],
  lucide: ["home", "settings", "search", "heart", "plus"],
  ph: ["house", "gear", "magnifying-glass", "heart", "plus"],
  heroicons: ["home", "cog-6-tooth", "magnifying-glass", "heart", "plus"],
  tabler: ["home", "settings", "search", "heart", "plus"],
  fa: ["home", "cog", "search", "heart", "plus"],
  feather: ["home", "settings", "search", "heart", "plus"],
  flowbite: ["home-outline", "cog-solid", "search-solid", "heart-solid", "plus-solid"],
};

/**
 * Get sample icons for an icon set
 */
export function getSampleIcons(prefix: string): string[] {
  return SAMPLE_ICONS[prefix] || SAMPLE_ICONS["material-symbols"] || [];
}
