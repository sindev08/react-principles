import type { RecipeDetail } from "../types";

export const folderStructure: RecipeDetail = {
  slug: "folder-structure",
  title: "Folder Structure",
  breadcrumbCategory: "Foundations",
  description: "A feature-based folder structure so you always know where a file goes — and why it belongs there.",
  lastUpdated: "2026-03-01",
  principle: {
    text: "A good folder structure answers one question instantly: 'where does this file go?' Feature-based organization groups everything related to a feature together — its components, hooks, and data — so you spend time building, not searching. When a feature grows or gets deleted, everything moves together. This works best for apps with multiple distinct features and more than one developer — think e-commerce with products, cart, checkout, and auth all living side by side. For a small app with 2–3 pages, this structure is like organizing a studio apartment with a full filing cabinet system. Useful later, overkill now.",
    tip: "One rule to decide where a file goes: if only one feature uses it, put it in that feature. If two or more features need it, move it to shared/. If it's infrastructure (API client, query config), put it in lib/.",
  },
  rulesLabel: "Conventions",
  rules: [
    {
      title: "Feature-based grouping",
      description: "Everything related to a feature lives in src/features/[name]/ — its components, hooks, and data together.",
    },
    {
      title: "Co-location",
      description: "Files live next to the code they describe — a component's types go in the same file, a feature's types go in that feature folder. A shared/ types folder is fine only for types used by two or more features. The decision is based on scope, not file type.",
    },
    {
      title: "No cross-feature imports",
      description: "Features never import directly from each other. Code needed by multiple features moves to src/shared/.",
    },
    {
      title: "Public API via index.ts",
      description: "Each feature exposes only what needs to be exposed via an index.ts file. Internals stay internal.",
    },
  ],
  pattern: {
    filename: "src/ — feature-based structure",
    code: `src/
├── app/              # Next.js routing only — no business logic here
├── features/         # One folder per domain feature
│   └── users/
│       ├── components/   # UI specific to this feature
│       ├── hooks/        # Data fetching and logic hooks
│       ├── stores/       # Zustand stores scoped to this feature
│       └── index.ts      # Public API — only export what others need
├── shared/           # Truly cross-cutting code
│   ├── components/   # Used by 2+ features (ErrorBoundary, LoadingState)
│   ├── hooks/        # Reusable hooks (useDebounce, useLocalStorage)
│   ├── stores/       # App-wide stores (theme, sidebar)
│   ├── types/        # Shared TypeScript types (API responses, common)
│   └── utils/        # Utility functions (cn, formatters, validators)
├── lib/              # External service clients (API, query client)
└── ui/               # Design system primitives (Button, Input, etc.)`,
  },
  implementation: {
    nextjs: {
      description: "Next.js adds the app/ directory for file-based routing. Route logic (pages) lives in app/, all business logic stays in features/. See the starter template at github.com/sindev08/react-principles-nextjs.",
      filename: "src/app/ — routing only",
      code: `src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, providers, metadata)
│   ├── page.tsx            # Home page — thin, imports from features/
│   ├── providers.tsx       # Client-side context providers
│   └── globals.css         # Global styles and Tailwind imports
├── features/
│   └── users/              # CRUD users feature
│       ├── components/     # UserCard, UserList
│       ├── hooks/          # useUsers, useUser, useCreateUser
│       ├── stores/         # (empty — server state handled by React Query)
│       └── index.ts        # Public API barrel export
├── shared/
│   ├── components/         # ErrorBoundary, LoadingState, EmptyState
│   ├── hooks/              # useDebounce, useLocalStorage
│   ├── types/              # API response types
│   └── utils/              # cn(), formatters
├── lib/                    # API client, query client, endpoints
└── ui/                     # Button, Card, Dialog, Input`,
    },
    vite: {
      description: "Vite projects use React Router for routing. The same src/ structure applies — routing config lives separately from feature code.",
      filename: "src/ — Vite structure",
      code: `src/
├── routes/             # React Router config — routing only
│   ├── index.tsx       # Route definitions
│   └── layouts/
├── features/           # Same feature-based structure
│   └── cookbook/
│       ├── components/
│       ├── hooks/
│       └── index.ts
├── shared/
├── lib/
└── ui/`,
    },
  },
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
  starterLink: {
    label: "View folder structure in starter",
    href: "https://github.com/sindev08/react-principles-nextjs/tree/main/src",
  },
};
