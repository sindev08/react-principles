export interface Recipe {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  tags: string[];
  category: string | null;
  contentType: "recipe" | "reference" | "concept";
  status: "published" | "coming-soon";
  order: number;
}

export const CATEGORIES = [
  "All Patterns",
  "Foundations",
  "Patterns",
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export const CARDS_PER_PAGE = 6;

export const RECIPES: Recipe[] = [
  // ─── PHASE 2: FOUNDATIONS ─────────────────────────────────────

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
    contentType: "reference",
    status: "coming-soon",
    order: 1,
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
    contentType: "reference",
    status: "coming-soon",
    order: 2,
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
    contentType: "reference",
    status: "coming-soon",
    order: 3,
  },
  {
    id: 14,
    slug: "useeffect-render-cycle",
    title: "useEffect & Render Cycle",
    description:
      "When effects run, why the dependency array exists, and how to clean up after yourself. The mental model React developers get wrong most often.",
    icon: "cycle",
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    contentType: "recipe",
    status: "coming-soon",
    order: 4,
  },
  {
    id: 15,
    slug: "component-composition",
    title: "Component Composition",
    description:
      "How components combine and communicate — children props, slot patterns, and why composition beats deep prop drilling.",
    icon: "widgets",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    contentType: "recipe",
    status: "coming-soon",
    order: 5,
  },
  {
    id: 16,
    slug: "custom-hooks",
    title: "Custom Hooks",
    description:
      "The boundary between logic and rendering. When to extract a hook, what the rules are, and how to avoid the most common mistake.",
    icon: "hook",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    contentType: "recipe",
    status: "coming-soon",
    order: 6,
  },
  {
    id: 23,
    slug: "component-splitting",
    title: "Component Splitting",
    description:
      "How to break a 400-line component into focused pieces — using composition and custom hooks together to split UI and logic the right way.",
    icon: "vertical_split",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    contentType: "recipe",
    status: "coming-soon",
    order: 7,
  },
  {
    id: 17,
    slug: "services-layer",
    title: "Services Layer",
    description:
      "How to organize all backend communication in one place — so when an API changes, you fix it in one file, not twenty.",
    icon: "hub",
    gradient: "linear-gradient(135deg, #f43f5e 0%, #be123c 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    contentType: "recipe",
    status: "coming-soon",
    order: 8,
  },
  {
    id: 18,
    slug: "state-taxonomy",
    title: "State Taxonomy",
    description:
      "Three categories of state — local, shared, and server — and exactly which tool handles each one. The question you must ask before reaching for any state library.",
    icon: "account_tree",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
    tags: ["Foundations"],
    category: "Foundations",
    contentType: "concept",
    status: "coming-soon",
    order: 9,
  },

  // ─── PHASE 3: PATTERNS ───────────────────────────────────────

  {
    id: 19,
    slug: "why-react-query",
    title: "Kenapa React Query?",
    description:
      "useEffect + fetch manual means loading state manual, no cache, and race conditions. React Query solves all three — here is why it is the right tool.",
    icon: "help",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
    tags: ["Patterns"],
    category: "Patterns",
    contentType: "concept",
    status: "coming-soon",
    order: 10,
  },
  {
    id: 7,
    slug: "server-state",
    title: "Server State with React Query",
    description:
      "Fetch, cache, and synchronize server data with TanStack Query v5. Covers pagination, search, and background refetching.",
    icon: "cloud_sync",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)",
    tags: ["Patterns", "React Query"],
    category: "Patterns",
    contentType: "recipe",
    status: "coming-soon",
    order: 11,
  },
  {
    id: 20,
    slug: "why-zustand",
    title: "Kenapa Zustand?",
    description:
      "Context re-renders all consumers. Redux is too verbose. Zustand gives you global state with zero boilerplate — here is why.",
    icon: "help",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    tags: ["Patterns"],
    category: "Patterns",
    contentType: "concept",
    status: "coming-soon",
    order: 12,
  },
  {
    id: 8,
    slug: "client-state",
    title: "Client State with Zustand",
    description:
      "Global UI state with multiple Zustand stores — app store, filter store, selectors, and computed state.",
    icon: "storage",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    tags: ["Patterns", "Zustand"],
    category: "Patterns",
    contentType: "recipe",
    status: "coming-soon",
    order: 13,
  },
  {
    id: 21,
    slug: "why-zod-rhf",
    title: "Kenapa Zod + React Hook Form?",
    description:
      "Manual validation means 20 lines of if/else per form and hardcoded error messages. Schema-first validation eliminates both.",
    icon: "help",
    gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    tags: ["Patterns"],
    category: "Patterns",
    contentType: "concept",
    status: "coming-soon",
    order: 14,
  },
  {
    id: 9,
    slug: "form-validation",
    title: "Form Validation with Zod",
    description:
      "Schema-first validation with React Hook Form and Zod. Type-safe, declarative error messages, zero boilerplate.",
    icon: "fact_check",
    gradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    tags: ["Patterns", "Zod"],
    category: "Patterns",
    contentType: "recipe",
    status: "coming-soon",
    order: 15,
  },
  {
    id: 22,
    slug: "why-tanstack-table",
    title: "Kenapa TanStack Table?",
    description:
      "Custom tables mean manual sort, filter, and pagination — 400 lines of boilerplate. TanStack Table is headless and handles it all.",
    icon: "help",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)",
    tags: ["Patterns"],
    category: "Patterns",
    contentType: "concept",
    status: "coming-soon",
    order: 16,
  },
  {
    id: 10,
    slug: "data-tables",
    title: "Data Tables with TanStack",
    description:
      "Headless, sortable, filterable, and paginated tables using TanStack Table v8 with full styling control.",
    icon: "table_chart",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    tags: ["Patterns", "TanStack"],
    category: "Patterns",
    contentType: "recipe",
    status: "coming-soon",
    order: 17,
  },
];

export function getRecipeBySlug(slug: string): Recipe | undefined {
  return RECIPES.find((r) => r.slug === slug);
}
