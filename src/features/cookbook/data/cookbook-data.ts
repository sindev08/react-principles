export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string[];
  category: string | null;
}

export const CATEGORIES = [
  "All Patterns",
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
    id: 1,
    slug: "e-commerce-dashboard",
    title: "E-commerce Dashboard",
    description:
      "A full-featured admin panel with interactive charts, inventory management tables, and real-time order tracking.",
    icon: "dashboard",
    gradient: "linear-gradient(135deg, #1349ec 0%, #1e3a8a 100%)",
    tags: ["Advanced", "React"],
    category: "Dashboards",
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
  },
];
