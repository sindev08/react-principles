export interface Recipe {
  id: number;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string[];
  category: string | null;
}

export const CATEGORIES = [
  "All Patterns",
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
    title: "Data Visualization",
    description:
      "Complex data sets represented through interactive charts, heatmaps, and geographic data visualizations.",
    icon: "bar_chart",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
    tags: ["Advanced", "D3.js"],
    category: "Data Viz",
  },
  {
    id: 5,
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
    title: "Component Library",
    description:
      "A curated set of highly reusable UI components including modals, dropdowns, and complex form elements.",
    icon: "view_quilt",
    gradient: "linear-gradient(135deg, #94a3b8 0%, #475569 100%)",
    tags: ["UI Kit", "Figma"],
    category: null,
  },
  {
    id: 7,
    title: "Analytics Dashboard",
    description:
      "Real-time analytics with customizable widgets, KPI cards, and drill-down reports for business intelligence.",
    icon: "analytics",
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    tags: ["Advanced", "React Query"],
    category: "Dashboards",
  },
  {
    id: 8,
    title: "Product Landing Page",
    description:
      "Mobile-first product showcase with hero animations, testimonials, and CTA sections optimized for conversion.",
    icon: "web",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    tags: ["Standard", "Tailwind"],
    category: "Landing Pages",
  },
  {
    id: 9,
    title: "OAuth Flow",
    description:
      "Social login with Google, GitHub, and Apple. Complete OAuth 2.0 flow with refresh token handling.",
    icon: "login",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    tags: ["Standard", "OAuth"],
    category: "Auth Flows",
  },
  {
    id: 10,
    title: "Chart Dashboard",
    description:
      "Interactive dashboards with line charts, bar graphs, pie charts, and responsive grid layouts.",
    icon: "pie_chart",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    tags: ["Pro", "Recharts"],
    category: "Data Viz",
  },
  {
    id: 11,
    title: "REST API Client",
    description:
      "A structured API client with interceptors, retry logic, caching, and type-safe endpoint definitions.",
    icon: "http",
    gradient: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
    tags: ["Advanced", "Axios"],
    category: "API Integration",
  },
  {
    id: 12,
    title: "Design System",
    description:
      "Token-based design system with theming support, accessibility-first components, and Storybook integration.",
    icon: "palette",
    gradient: "linear-gradient(135deg, #64748b 0%, #334155 100%)",
    tags: ["Pro", "TypeScript"],
    category: null,
  },
];
