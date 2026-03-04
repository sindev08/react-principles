export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string[];
  category: string | null;
  status: "published" | "coming-soon";
  order: number;
}

export const CATEGORIES = [
  "All Patterns",
  "Foundations",
  "Patterns",
  "Dashboards",
  "Auth Flows",
  "Landing Pages",
  "Data Viz",
  "API Integration",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export const CARDS_PER_PAGE = 6;

export const RECIPES: Recipe[] = [
  {
    id: 11,
    slug: "folder-structure",
    title: "Folder Structure",
    description:
      "A feature-based folder structure so you always know where a file goes — and why it belongs there.",
    icon: "folder_open",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    status: "coming-soon",
    order: 1,
  },
  {
    id: 12,
    slug: "typescript-for-react",
    title: "TypeScript for React",
    description:
      "How to type component props, event handlers, and hooks correctly. The contracts that prevent silent bugs.",
    icon: "code",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    status: "coming-soon",
    order: 2,
  },
  {
    id: 13,
    slug: "component-anatomy",
    title: "Component Anatomy",
    description:
      "The consistent internal structure every component follows — imports, types, constants, function, export.",
    icon: "account_tree",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    status: "coming-soon",
    order: 3,
  },
  {
    id: 7,
    slug: "server-state",
    title: "Server State with React Query",
    description:
      "Fetch, cache, and synchronize server data with TanStack Query v5. Covers pagination, search, and background refetching.",
    icon: "cloud_sync",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    tags: ["Standard", "React Query"],
    category: "Patterns",
    status: "coming-soon",
    order: 9,
  },
  {
    id: 8,
    slug: "client-state",
    title: "Client State with Zustand",
    description:
      "Global UI state with multiple Zustand stores — app store, filter store, selectors, and computed state.",
    icon: "storage",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    tags: ["Standard", "Zustand"],
    category: "Patterns",
    status: "coming-soon",
    order: 10,
  },
  {
    id: 9,
    slug: "form-validation",
    title: "Form Validation with Zod",
    description:
      "Schema-first validation with React Hook Form and Zod. Type-safe, declarative error messages, zero boilerplate.",
    icon: "fact_check",
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    tags: ["Standard", "Zod"],
    category: "Patterns",
    status: "coming-soon",
    order: 11,
  },
  {
    id: 10,
    slug: "data-tables",
    title: "Data Tables with TanStack",
    description:
      "Headless, sortable, filterable, and paginated tables using TanStack Table v8 with full styling control.",
    icon: "table_chart",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    tags: ["Advanced", "TanStack"],
    category: "Patterns",
    status: "coming-soon",
    order: 12,
  },
  {
    id: 3,
    slug: "authentication-flow",
    title: "Authentication Flow",
    description:
      "Secure login, signup, and password recovery patterns using JWT and multi-factor authentication examples.",
    icon: "lock",
    gradient: "linear-gradient(135deg, #10b981 0%, #0d9488 100%)",
    tags: ["Standard", "Next.js"],
    category: "Auth Flows",
    status: "coming-soon",
    order: 13,
  },
  {
    id: 6,
    slug: "oauth-flow",
    title: "OAuth Flow",
    description:
      "Social login with Google, GitHub, and Apple. Complete OAuth 2.0 flow with refresh token handling.",
    icon: "login",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    tags: ["Standard", "OAuth"],
    category: "Auth Flows",
    status: "coming-soon",
    order: 14,
  },
  {
    id: 5,
    slug: "api-integration",
    title: "API Integration",
    description:
      "Clean boilerplate for connecting frontend components to REST or GraphQL endpoints with robust error handling.",
    icon: "api",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    tags: ["Pro", "GraphQL"],
    category: "API Integration",
    status: "coming-soon",
    order: 15,
  },
  {
    id: 4,
    slug: "data-visualization",
    title: "Data Visualization",
    description:
      "Complex data sets represented through interactive charts, heatmaps, and geographic data visualizations.",
    icon: "bar_chart",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
    tags: ["Advanced", "Recharts"],
    category: "Data Viz",
    status: "coming-soon",
    order: 16,
  },
  {
    id: 1,
    slug: "e-commerce-dashboard",
    title: "E-commerce Dashboard",
    description:
      "A full-featured admin panel with interactive charts, inventory management tables, and real-time order tracking.",
    icon: "dashboard",
    gradient: "linear-gradient(135deg, #1349ec 0%, #1e3a8a 100%)",
    tags: ["Advanced", "React"],
    category: "Dashboards",
    status: "coming-soon",
    order: 17,
  },
  {
    id: 2,
    slug: "saas-landing-page",
    title: "SaaS Landing Page",
    description:
      "Optimized conversion funnels featuring responsive pricing tables, feature grids, and accessible form layouts.",
    icon: "rocket",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    tags: ["Beginner", "Tailwind"],
    category: "Landing Pages",
    status: "coming-soon",
    order: 18,
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}
