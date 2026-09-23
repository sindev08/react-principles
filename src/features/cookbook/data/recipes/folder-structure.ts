import type { RecipeDetail } from "../types";

export const folderStructure: RecipeDetail = {
  slug: "folder-structure",
  title: "Folder Structure",
  breadcrumbCategory: "Foundations",
  description: "A feature-based folder structure so you always know where a file goes — and why it belongs there.",
  lastUpdated: "Sep 23, 2026",
  principle: {
    text: "A good folder structure answers one question instantly: 'where does this file go?' Default React templates group by file type (/components, /hooks, /utils), which works at 5 files but turns into a flat dump at 50+ files where utilities get re-written because no one can find the original. The core axiom: files that change together, belong together. Feature-based organization encapsulates domain logic into vertical slices so when a feature evolves or is sunset, you delete one folder with zero orphaned code.",
    tip: "Apply the 3-Second Decision Filter: (1) Specific to one domain? → features/[domain]/. (2) Reusable across domains WITH logic or API contracts? → shared/. (3) Pure visual primitive with zero business rules? → ui/.",
  },
  rulesLabel: "Conventions",
  rules: [
    {
      title: "The 4-pillar mental model",
      description: "Organize code into four distinct layers: features/ for domain encapsulation, shared/ for cross-feature assembled code, ui/ for pure visual primitives, and lib/ for infrastructure. In Next.js, app/ is reserved strictly for file-based routing and layout shells — never business logic.",
    },
    {
      title: "LEGO Bricks vs Assembled Pieces (ui/ vs shared/)",
      description: "Never put business logic in ui/. The ui/ directory contains raw LEGO bricks (Button, Input, Modal, Badge) that only accept visual props (variant, size, disabled, children) and pass the portability test: you can copy-paste them into an e-commerce, crypto, or SaaS app without missing dependencies. The shared/ directory contains assembled pieces (DataTable with pagination, ErrorBoundary, CopyButton) that compose UI primitives with cross-cutting logic or data contracts.",
    },
    {
      title: "Domain encapsulation & clean sunset",
      description: "Everything belonging to a business domain lives inside src/features/[name]/ — its components, hooks, and local stores. External features must never reach into another feature's internal folders. When a feature is retired or sunset, you delete its single directory and leave zero orphaned files behind.",
    },
    {
      title: "Public API via index.ts",
      description: "Each feature exposes its public contract through an index.ts barrel. Other features and route pages import strictly from @/features/[name], never from internal paths. This isolates internal refactorings so moving a file inside a feature never breaks consumers.",
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
├── features/             # Domain encapsulation (vertical slices)
│   └── users/            # Each feature owns its own components, hooks, stores
│       ├── components/   # UI specific to this feature
│       ├── hooks/        # Data fetching and logic hooks
│       ├── stores/       # Zustand stores scoped to this feature
│       └── index.ts      # Barrel export — public API of the feature
│
├── shared/               # Assembled pieces (cross-feature reusables with logic)
│   ├── components/       # Reusable components (ErrorBoundary, CopyButton, EmptyState)
│   ├── hooks/            # Reusable hooks (useDebounce, useLocalStorage, useMediaQuery)
│   ├── stores/           # App-wide stores (theme, sidebar, session)
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Utility functions (cn, formatters, validators)
│
├── ui/                   # Raw LEGO bricks — pure visual primitives, ZERO business logic
│                         # (Button, Card, Dialog, Input, Badge — 100% portable)
│
├── lib/                  # Infrastructure & external SDK adapters
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
├── features/             # Domain encapsulation (vertical slices)
│   └── users/            # Each feature owns its own components, hooks, stores
│       ├── components/   # UI specific to this feature
│       ├── hooks/        # Data fetching and logic hooks
│       ├── stores/       # Zustand stores scoped to this feature
│       └── index.ts      # Barrel export — public API of the feature
│
├── shared/               # Assembled pieces (cross-feature reusables with logic)
│   ├── components/       # Reusable components (ErrorBoundary, CopyButton, EmptyState)
│   ├── hooks/            # Reusable hooks (useDebounce, useLocalStorage, useMediaQuery)
│   ├── stores/           # App-wide stores (theme, sidebar, session)
│   ├── types/            # Shared TypeScript types
│   └── utils/            # Utility functions (cn, formatters, validators)
│
├── ui/                   # Raw LEGO bricks — pure visual primitives, ZERO business logic
│                         # (Button, Card, Dialog, Input, Badge — 100% portable)
│
├── lib/                  # Infrastructure & external SDK adapters
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
