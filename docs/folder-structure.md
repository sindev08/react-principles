# Folder Structure

## Principle

Why does folder structure matter before learning any pattern? Because **structure is the first architectural decision** that determines how easily a project can be scaled, maintained, and understood by others.

Default React project templates encourage grouping by file type (`/components`, `/hooks`, `/utils`, `/services`). At 5 files, that feels tidy. But at 50+ files, it turns into a flat dump — utilities like `formatDate.ts` get written twice simply because nobody can find the original after 4 months.

The core axiom: **files that change together, belong together.**

The architecture recommended here is built on the **4-Pillar Mental Model**:
1. `features/[domain]/` → Self-contained business domains (vertical slices).
2. `shared/` → Reusable assembled pieces WITH logic, app state, or API contracts.
3. `ui/` → Raw LEGO bricks: pure visual primitives with ZERO business logic.
4. `lib/` → Infrastructure, external SDK configurations, and HTTP client instances.

One core principle: **every file must have one clear, unambiguous place to live.**

---

## Rules

- **The 3-Second Decision Filter:**
  1. Specific to a single business domain? → `features/[domain]/`
  2. Reused across multiple domains WITH logic or API contracts? → `shared/`
  3. Pure visual styling without product context? → `ui/`
- **LEGO Bricks vs Assembled Pieces (`ui/` vs `shared/`):**
  - Never put business logic in `ui/`. `ui/` contains raw LEGO bricks (`Button`, `Input`, `Modal`, `Badge`) that only accept visual props (`variant`, `size`, `disabled`, `children`). They must pass the portability test: you can copy-paste them into an e-commerce, crypto, or SaaS app without a single missing dependency error.
  - `shared/components/` contains assembled pieces (`DataTable` with pagination, `ErrorBoundary`, `CopyButton`) that compose UI primitives with cross-cutting logic or data contracts.
- **Domain Encapsulation & Sunset:**
  - Everything belonging to a feature lives in `features/[feature-name]/`.
  - When a feature is retired or sunset, you delete its ONE folder with zero orphaned files left behind.
- **No Direct Cross-Feature Imports:**
  - By convention, features do not reach into each other's internal files. Code needed by 2+ features moves to `shared/`.
- **Public API via `index.ts`:**
  - Every feature exposes its public contract through an `index.ts` barrel. External consumers import strictly from `@/features/[name]`.
- **Client State Scoping:**
  - App-wide client stores (theme, sidebar, session) go in `shared/stores/`.
  - Feature-scoped client stores (multi-step form, active selection) go in `features/[name]/stores/`.
- **Infrastructure Isolation:**
  - Third-party client configuration (fetch/axios instance, query client) goes in `lib/` — not in `shared/`.

---

## Recommended Structure

### Next.js (App Router)

```
src/
├── app/                             # Next.js App Router — routing only, no business logic
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── [feature]/
│       ├── page.tsx
│       ├── loading.tsx
│       └── error.tsx
│
├── features/                        # Business logic per feature
│   └── [feature-name]/
│       ├── components/              # UI components belonging to this feature
│       ├── hooks/                   # All hooks belonging to this feature (API + UI logic)
│       │   ├── useUsers.ts          # GET /users — React Query hook
│       │   ├── useCreateUser.ts     # POST /users — mutation hook
│       │   └── useFeatureFilter.ts  # Pure UI logic hook
│       ├── services/                # Raw API call functions (axios/fetch)
│       │   └── feature.service.ts
│       ├── types/                   # TypeScript types belonging to this feature
│       │   └── feature.types.ts
│       └── index.ts                 # Public exports
│
├── shared/                          # Cross-feature reusables
│   ├── components/                  # UI components used by 2+ features
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingScreen.tsx
│   │   └── EmptyState.tsx
│   ├── hooks/                       # UI hooks used by 2+ features (no API)
│   │   ├── useDebounce.ts
│   │   ├── useMediaQuery.ts
│   │   └── useQueryParams.ts
│   ├── stores/                      # Zustand stores — client state only
│   │   └── useAppStore.ts
│   ├── types/                       # TypeScript types shared across features
│   │   ├── api.types.ts
│   │   └── common.types.ts
│   └── utils/                       # Helper functions & formatters
│       ├── formatters.ts
│       └── validators.ts
│
├── lib/                             # Third-party configs & clients
│   ├── api-client.ts                # Axios instance with interceptors
│   ├── query-client.ts              # TanStack Query global config
│   └── query-keys.ts                # Query key factory (centralized)
│
└── ui/                              # Design system — shadcn/ui + custom
    ├── button.tsx
    ├── card.tsx
    └── input.tsx
```

### Vite (React SPA)

```
src/
├── routes/                          # React Router config — routing only
│   └── index.tsx
│
├── pages/                           # Page entry points — thin, no logic
│   └── [feature]/
│       └── index.tsx
│
├── features/                        # Identical to Next.js
│   └── [feature-name]/
│       ├── components/
│       ├── hooks/                   # API hooks + UI logic — all co-located
│       ├── services/
│       ├── types/
│       └── index.ts
│
├── shared/                          # Identical to Next.js
│   ├── components/
│   ├── hooks/
│   ├── stores/
│   ├── types/
│   └── utils/
│
├── lib/                             # Identical to Next.js
│   ├── api-client.ts
│   ├── query-client.ts
│   └── query-keys.ts
│
├── ui/                              # Identical to Next.js
│   └── [components].tsx
│
└── styles/
    └── globals.css
```

### Next.js vs Vite Differences

| | Next.js | Vite |
|--|---------|------|
| Routing | `app/` file-based (Next.js) | `routes/` + `pages/` (React Router) |
| Data fetching | Server + Client components | Client only |
| Entry point | `app/layout.tsx` | `main.tsx` |
| `features/` | ✅ Same | ✅ Same |
| `hooks/` | ✅ Same | ✅ Same |
| `shared/` | ✅ Same | ✅ Same |
| `lib/` | ✅ Same | ✅ Same |
| `ui/` | ✅ Same | ✅ Same |

---

## What Goes Where

| Code | Place it in | Notes |
|------|-------------|-------|
| Component used by only 1 feature | `features/[name]/components/` | Scoped to domain |
| Pure visual primitive (Button, Input, Modal) | `ui/` | Raw LEGO brick (0 business logic, 100% portable) |
| Reusable component with logic (DataTable, ErrorBoundary) | `shared/components/` | Assembled piece with logic/state |
| Hook that calls an API (read/write) | `features/[name]/hooks/` | Co-located query/mutation hook |
| Pure UI logic hook for 1 feature | `features/[name]/hooks/` | Domain-specific UI state |
| Pure UI logic hook for 2+ features | `shared/hooks/` | Generic (e.g. useDebounce, useMediaQuery) |
| Raw API call functions | `features/[name]/services/` | Domain API calls |
| HTTP client instance & global config | `lib/api-client.ts` | Infrastructure |
| App-wide Zustand store (theme, sidebar) | `shared/stores/` | Global client state |
| Feature-scoped Zustand store (multi-step form) | `features/[name]/stores/` | Scoped client state |
| TypeScript types for 1 feature | `features/[name]/types/` | Domain types |
| TypeScript types shared across features | `shared/types/` | Cross-cutting types |
| Helper functions & formatters | `shared/utils/` | Pure utilities (cn, formatters) |

### The Most Important Rule

```
Hook (API or UI)?            → features/[name]/hooks/ (co-located)
Hook used by 2+ features?    → shared/hooks/
Raw visual primitive?        → ui/ (zero logic, raw LEGO brick)
Reusable with logic?         → shared/components/ (assembled piece)
```

---

## Anti-Patterns

```
❌ Put all components in one components/ folder
   → Not scalable, flat-by-type trap, no boundaries between features

❌ Put business logic or domain hooks inside ui/
   → Breaks portability, leaks domain concerns into raw LEGO bricks

❌ Import directly from another feature's internal files
   import { UserCard } from '../user/components/UserCard'
   → High coupling, breaks encapsulation

✅ Export via index.ts, import from public API
   import { UserCard } from '@/features/user'

❌ Put server state (data from API) in Zustand
   → Two sources of truth, can go out of sync

✅ Server state → React Query | Client state → Zustand

❌ Put API client instances inside a component or hook
   → Logic scattered, hard to maintain

✅ Centralized API client factory in lib/api-client.ts
```

---

## Real Example — Educator Feature (Kedinasan)

```
features/
└── educator/
    ├── components/
    │   ├── EducatorTable.tsx      # Educator list table
    │   ├── EducatorForm.tsx       # Add/edit educator form
    │   └── EducatorDeleteModal.tsx
    ├── hooks/
    │   ├── queries/
    │   │   ├── useEducatorList.ts  # GET /educators
    │   │   └── useEducatorDetail.ts # GET /educators/:id
    │   └── mutations/
    │       ├── useCreateEducator.ts # POST /educators
    │       └── useApproveEducator.ts # PATCH /educators/:id/approve
    ├── services/
    │   └── educator.service.ts
    ├── types/
    │   └── educator.types.ts
    └── index.ts                   # export { EducatorTable, EducatorForm }
```

---

## Why Not Atomic Design?

Atomic Design (atoms/molecules/organisms) is popular, but for most projects the scale doesn't fit well:

- It's hard to distinguish a "molecule" from an "organism" in practice
- No clear boundaries between features
- When the project grows, `organisms/` becomes an unstructured catch-all

Feature-based is more pragmatic: boundaries between features are clear, and the "where does this go" rule is unambiguous.

---

_Part of React Principles — foundation before all other patterns._
