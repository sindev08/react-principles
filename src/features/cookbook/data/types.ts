export interface RuleItem {
  title: string;
  description: string;
}

export interface ImplTab {
  description: string;
  filename: string;
  code: string;
}

export type DemoKey = "react-query" | "zustand" | "forms" | "table";

export interface StarterLink {
  /** Label shown on the link (e.g., "View in starter template") */
  label: string;
  /** Full GitHub URL to the specific file or folder */
  href: string;
}

export interface RecipeDetail {
  slug: string;
  title: string;
  breadcrumbCategory: string;
  description: string;
  lastUpdated: string;
  contributor: { name: string; role: string };

  /** The opening principle and tip. Omit if the recipe is purely reference-based. */
  principle?: { text: string; tip?: string };

  /**
   * Key points, rules, or guidelines for this recipe.
   * Use `rulesLabel` to customize the heading — defaults to "Rules".
   * For opinionated recipes: "Rules". For convention-based: "Guidelines". Etc.
   */
  rules?: RuleItem[];
  rulesLabel?: string;

  /** The canonical code pattern for this recipe. */
  pattern?: { filename: string; code: string };

  /** Framework-specific implementation examples. */
  implementation?: { nextjs?: ImplTab; vite?: ImplTab };

  /** Renders a live interactive demo at the bottom of the page. */
  demoKey?: DemoKey;

  /** Link to the relevant file/folder in the starter template repo. */
  starterLink?: StarterLink;
}
