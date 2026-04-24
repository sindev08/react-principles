/**
 * Google Fonts Integration
 * Fetch font list, load fonts, apply to preview
 */

export interface GoogleFont {
  family: string;
  category: "sans-serif" | "serif" | "display" | "handwriting" | "monospace";
  variants: string[];
  subsets: string[];
}

export interface GoogleFontsResponse {
  items: GoogleFont[];
}

/**
 * Google Fonts API base URL
 */
const GOOGLE_FONTS_API_URL = "https://www.googleapis.com/webfonts/v1/webfonts";
const GOOGLE_FONTS_BASE_URL = "https://fonts.googleapis.com/css2";

/**
 * Fetch available fonts from Google Fonts API
 * Requires API key for production use
 */
export async function fetchGoogleFonts(
  apiKey?: string
): Promise<GoogleFont[]> {
  try {
    const url = new URL(GOOGLE_FONTS_API_URL);
    url.searchParams.set("key", apiKey || "demo");
    url.searchParams.set("sort", "popularity");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`Google Fonts API error: ${response.status}`);
    }

    const data: GoogleFontsResponse = await response.json();
    return data.items;
  } catch (error) {
    console.error("Failed to fetch Google Fonts:", error);
    // Return curated fallback list on error
    return getCuratedFonts();
  }
}

/**
 * Curated font list as fallback
 */
export function getCuratedFonts(): GoogleFont[] {
  return [
    {
      family: "Inter",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      subsets: ["latin"],
    },
    {
      family: "Roboto",
      category: "sans-serif",
      variants: ["100", "300", "400", "500", "700", "900"],
      subsets: ["latin"],
    },
    {
      family: "Open Sans",
      category: "sans-serif",
      variants: ["300", "400", "500", "600", "700", "800"],
      subsets: ["latin"],
    },
    {
      family: "Lato",
      category: "sans-serif",
      variants: ["100", "300", "400", "700", "900"],
      subsets: ["latin"],
    },
    {
      family: "Montserrat",
      category: "sans-serif",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
      subsets: ["latin"],
    },
    {
      family: "Source Sans 3",
      category: "sans-serif",
      variants: ["200", "300", "400", "500", "600", "700", "800", "900"],
      subsets: ["latin"],
    },
    {
      family: "Merriweather",
      category: "serif",
      variants: ["300", "400", "700", "900"],
      subsets: ["latin"],
    },
    {
      family: "Playfair Display",
      category: "serif",
      variants: ["400", "500", "600", "700", "800", "900"],
      subsets: ["latin"],
    },
    {
      family: "Lora",
      category: "serif",
      variants: ["400", "500", "600", "700"],
      subsets: ["latin"],
    },
    {
      family: "Noto Serif",
      category: "serif",
      variants: ["400", "700"],
      subsets: ["latin"],
    },
    {
      family: "Space Grotesk",
      category: "sans-serif",
      variants: ["300", "400", "500", "600", "700"],
      subsets: ["latin"],
    },
    {
      family: "JetBrains Mono",
      category: "monospace",
      variants: ["100", "200", "300", "400", "500", "600", "700", "800"],
      subsets: ["latin"],
    },
    {
      family: "Fira Code",
      category: "monospace",
      variants: ["300", "400", "500", "600", "700"],
      subsets: ["latin"],
    },
    {
      family: "Dancing Script",
      category: "handwriting",
      variants: ["400", "500", "600", "700"],
      subsets: ["latin"],
    },
    {
      family: "Pacifico",
      category: "handwriting",
      variants: ["400"],
      subsets: ["latin"],
    },
  ];
}

/**
 * Popular fonts for quick picks
 */
export function getPopularFonts(): GoogleFont[] {
  const allFonts = getCuratedFonts();
  return [
    allFonts.find((f) => f.family === "Inter")!,
    allFonts.find((f) => f.family === "Roboto")!,
    allFonts.find((f) => f.family === "Open Sans")!,
    allFonts.find((f) => f.family === "Montserrat")!,
    allFonts.find((f) => f.family === "Merriweather")!,
    allFonts.find((f) => f.family === "Playfair Display")!,
    allFonts.find((f) => f.family === "JetBrains Mono")!,
  ].filter(Boolean) as GoogleFont[];
}

/**
 * Generate Google Fonts URL for given fonts
 */
export function generateGoogleFontsURL(
  headerFont: string,
  bodyFont: string
): string {
  const params = new URLSearchParams();
  params.set("display", "swap");

  const fontsToLoad = new Set<string>();

  // Add header font with weights
  fontsToLoad.add(`${headerFont}:wght@300;400;500;600;700;800;900`);

  // Add body font if different
  if (bodyFont !== headerFont) {
    fontsToLoad.add(`${bodyFont}:wght@300;400;500;600;700;800;900`);
  }

  return `${GOOGLE_FONTS_BASE_URL}?${params.toString()}&family=${Array.from(fontsToLoad).join("&family=")}`;
}

/**
 * Load fonts via <link> tag injection
 */
export function loadGoogleFonts(
  headerFont: string,
  bodyFont: string
): HTMLLinkElement | null {
  // Remove existing Google Fonts links
  const existingLinks = document.querySelectorAll(
    'link[href^="https://fonts.googleapis.com"]'
  );
  existingLinks.forEach((link) => link.remove());

  // Create new link
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = generateGoogleFontsURL(headerFont, bodyFont);
  document.head.appendChild(link);

  return link;
}

/**
 * Apply font to CSS custom properties
 */
export function applyFontToCSS(
  headerFont: string,
  bodyFont: string,
  target: HTMLElement | CSSStyleDeclaration = document.documentElement.style
): void {
  const style = target instanceof CSSStyleDeclaration ? target : target.style;

  style.setProperty("--font-header", headerFont);
  style.setProperty("--font-body", bodyFont);
}

/**
 * Sanitize font family name for CSS
 */
export function sanitizeFontFamily(fontFamily: string): string {
  // Wrap spaces in quotes, keep commas for stacks
  if (fontFamily.includes(" ")) {
    return `"${fontFamily}"`;
  }
  return fontFamily;
}
