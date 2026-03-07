# ui/

Design system primitives inspired by shadcn/ui conventions, implemented as custom components in this repo.

## What Goes Here

Reusable, stateless UI components that are part of the design system. These are building blocks, not feature components.

## Rules

- Components here must be **stateless** — no API calls, no business logic
- This repo does not use generated shadcn registry files; maintain components directly in `src/ui`
- Use `cn()` utility from `lib/utils` for conditional class names
- PascalCase filenames matching the component name: `Button.tsx` → `<Button />`

## Difference from shared/components/

| `ui/` | `shared/components/` |
|-------|----------------------|
| Stateless primitives (Button, Input, Card) | Stateful shared components (ErrorBoundary, LoadingScreen) |
| Design system building blocks | Cross-feature composite components |
| No props beyond styling/variant | Can have business-related props |
