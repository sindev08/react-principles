# Folder Structure

## Principle

Why does folder structure matter before learning any pattern? Because **structure is the first architectural decision** that determines how easily a project can be scaled, maintained, and understood by others.

Many developers learn React from tutorials that put all files in a single `components/` folder — and that's fine for small projects. But once the project grows, without a clear structure, a single change can cascade everywhere and nobody knows "where should this file go".

The structure recommended here is based on **feature-based organization**: each feature is a self-contained module. Code that is truly reusable across features goes into `shared/`. Third-party configuration goes into `lib/`. The design system goes into `ui/`.

One core principle: **every file must have one clear, unambiguous place to live.**

---

## Rules

- New feature → create a new folder under `features/[feature-name]/`
- No direct cross-feature imports — use `shared/` as the bridge
- Hooks (API + UI logic) live inside the feature that uses them (`features/[name]/hooks/`)
- Hooks used by 2+ features → move to `shared/hooks/`
- Every feature must have an `index.ts` as its public API — only export what needs to be accessed externally
- Zustand stores go in `shared/stores/` — not inside a feature
- Third-party configuration (axios instance, query client) goes in `lib/` — not in `shared/`
- Design system components go in `ui/` — not `shared/components/`

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

| Code | Place it in |
|------|----------|
| Component used by only 1 feature | `features/[name]/components/` |
| Component used by 2+ features | `shared/components/` |
| Hook that calls an API (read/write) | `features/[name]/hooks/` |
| Pure UI logic hook for 1 feature | `features/[name]/hooks/` |
| Pure UI logic hook for 2+ features | `shared/hooks/` |
| Raw API call functions | `features/[name]/services/` |
| Axios instance, base config | `lib/api-client.ts` |
| Zustand store | `shared/stores/` |
| TypeScript types for 1 feature | `features/[name]/types/` |
| TypeScript types shared across features | `shared/types/` |
| shadcn/ui + custom design system | `ui/` |
| Helper functions | `shared/utils/` |

### The Most Important Rule

```
Hook (API or UI)?            → features/[name]/hooks/ (co-located)
Hook used by 2+ features?    → shared/hooks/
```

---

## Anti-Patterns

```
❌ Put all components in one components/ folder
   → Not scalable, no boundaries between features

❌ Import directly from another feature
   import { UserCard } from '../user/components/UserCard'
   → High coupling, hard to refactor

✅ Export via index.ts, import from public API
   import { UserCard } from '@/features/user'

❌ Put server state (data from API) in Zustand
   → Two sources of truth, can go out of sync

✅ Server state → React Query | Client state → Zustand

❌ Put axios instance inside a component or hook
   → Logic scattered, hard to maintain

✅ Single axios instance in lib/api-client.ts
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
