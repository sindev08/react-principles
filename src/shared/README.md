# shared/

Cross-feature reusables — code used by 2 or more features.

## The Rule

```
Used by 1 feature?   → Keep it inside that feature
Used by 2+ features? → Move it here
```

## Structure

```
shared/
├── components/    # UI components used across 2+ features
├── hooks/         # UI hooks used across 2+ features (no API calls)
├── stores/        # Zustand stores — client state only
├── types/         # TypeScript types shared across features
└── utils/         # Helper functions and formatters
```

## What Does NOT Go Here

- API call hooks → those go in `/hooks/queries` or `/hooks/mutations`
- Server state (data from API) → that's React Query's responsibility, not Zustand
- Feature-specific logic → keep it inside the feature folder

## stores/ Note

Zustand stores here manage **client state** only: theme, sidebar open/close, language preference, UI filters. Never put API response data into a Zustand store — that creates two sources of truth with React Query.
