import type { RecipeDetail } from "../types";

export const folderStructure: RecipeDetail = {
  slug: "folder-structure",
  title: "Folder Structure",
  breadcrumbCategory: "Foundations",
  description: "A feature-based folder structure so you always know where a file goes — and why it belongs there.",
  lastUpdated: "Apr 13, 2026",
  principle: {
    text: "A good folder structure answers one question instantly: 'where does this file go?' Feature-based organization groups everything related to a feature together — its components, hooks, and data — so you spend time building, not searching. When a feature grows or gets deleted, everything moves together. This works best for apps with multiple distinct features and more than one developer — think e-commerce with products, cart, checkout, and auth all living side by side. For a small app with 2–3 pages, this structure is like organizing a studio apartment with a full filing cabinet system. Useful later, overkill now.",
    tip: "One rule to decide where a file goes: if only one feature uses it, put it in that feature. If two or more features need it, move it to shared/. If it's infrastructure (API client, query config), put it in lib/.",
  },
  rulesLabel: "Conventions",
  rules: [
    {
      title: "Feature-based grouping",
      description: "Everything related to a feature lives in src/features/[name]/ — its components, hooks, and stores together. The stores/ directory is only needed when the feature has shared UI state that multiple components within that feature need — like a multi-step form or a selected item. If all data comes from an API, skip the store.",
    },
    {
      title: "Co-location",
      description: "Files live next to the code they describe — a component's types go in the same file, a feature's types go in that feature folder. A shared/ types folder is fine only for types used by two or more features. The decision is based on scope, not file type.",
    },
    {
      title: "No cross-feature imports",
      description: "By convention, features avoid importing directly from each other. Code needed by multiple features moves to src/shared/. Cross-feature imports are acceptable when composing product surfaces — for example, a layout feature pulling in a ThemeToggle from another feature — but should not be the default.",
    },
    {
      title: "Public API via index.ts",
      description: "By convention, each feature exposes its public API through an index.ts barrel file. Other parts of the codebase import from the feature, not from its internals. This keeps refactoring contained — if a file moves inside the feature, nothing outside breaks. If you want to enforce this automatically, ESLint's no-restricted-imports rule can prevent direct internal imports.",
    },
  ],
  implementation: {
    nextjs: {
      description: "The four core directories apply to any React app: features/ for domain logic, shared/ for cross-feature code, lib/ for infrastructure, and ui/ for design system primitives. Next.js adds one more: app/ for file-based routing — keep it thin, no business logic here. See the starter template at github.com/sindev08/react-principles-nextjs.",
      filename: "src/ — react-principles-nextjs starter",
      code: `src/
├── app/                  # Next.js App Router — routing and layouts ONLY
│   ├── layout.tsx        # Root layout (fonts, providers, metadata)
│   ├── page.tsx          # Home page
│   ├── providers.tsx     # Client-side context providers (QueryClient, etc.)
│   ├── globals.css       # Global styles and Tailwind imports
│   └── users/
│       ├── page.tsx      # Users list page (composition: PageLayout + UserList)
│       └── [id]/
│           └── page.tsx  # Dynamic route — add routes here, never business logic
│
├── features/             # Feature modules (vertical slices)
│   └── users/            # Each feature owns its own components, hooks, stores
│       ├── components/   # UI specific to this feature
│       ├── hooks/        # Data fetching and logic hooks
│       ├── stores/       # Zustand stores scoped to this feature
│       └── index.ts      # Barrel export — public API of the feature
│
├── shared/               # Cross-feature shared code
│   ├── components/       # Reusable components (PageLayout, Navbar, Sidebar, etc.)
│   ├── hooks/            # Reusable hooks (useDebounce, useLocalStorage, etc.)
│   ├── stores/           # App-wide stores (theme, sidebar, etc.)
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Utility functions (cn, formatters, validators)
│
├── ui/                   # Design system primitives (Button, Card, Dialog, etc.)
│
├── lib/                  # Infrastructure code
│   ├── api-client.ts     # Fetch-based API client factory
│   ├── api.ts            # Pre-configured API instance (DummyJSON)
│   ├── endpoints.ts      # Centralized endpoint definitions
│   ├── query-client.ts   # TanStack Query client factory
│   ├── query-keys.ts     # Type-safe query key factory
│   └── services/         # Per-resource API functions (users, products, etc.)
│
└── test/
    └── setup.ts          # Vitest setup (Testing Library matchers)`,
    },
    vite: {
      description: "Same four core directories. Vite uses React Router instead of file-based routing, so add a routes/ directory for route definitions. Everything else is identical.",
      filename: "src/ — Vite structure",
      code: `src/
├── routes/               # React Router — routing only
│   ├── index.tsx         # Route definitions
│   └── layouts/
│       └── RootLayout.tsx
│
├── features/             # Feature modules (vertical slices)
│   └── users/
│       ├── components/   # UI specific to this feature
│       ├── hooks/        # Data fetching and logic hooks
│       ├── stores/       # Zustand stores scoped to this feature
│       └── index.ts      # Barrel export — public API of the feature
│
├── shared/               # Cross-feature shared code
│   ├── components/       # Reusable components (PageLayout, Navbar, Sidebar, etc.)
│   ├── hooks/            # Reusable hooks (useDebounce, useLocalStorage, etc.)
│   ├── stores/           # App-wide stores (theme, sidebar, etc.)
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Utility functions (cn, formatters, validators)
│
├── ui/                   # Design system primitives (Button, Card, Dialog, etc.)
│
├── lib/                  # Infrastructure code
│   ├── api-client.ts     # Fetch-based API client factory
│   ├── api.ts            # Pre-configured API instance
│   ├── endpoints.ts      # Centralized endpoint definitions
│   ├── query-client.ts   # TanStack Query client factory
│   └── query-keys.ts     # Type-safe query key factory
│
└── test/
    └── setup.ts          # Vitest setup (Testing Library matchers)`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View folder structure in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src",
  },
};
