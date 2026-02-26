# ui/

Design system — shadcn/ui components and custom UI primitives.

## What Goes Here

Reusable, stateless UI components that are part of the design system. These are building blocks, not feature components.

## Rules

- Components here must be **stateless** — no API calls, no business logic
- Never modify shadcn/ui source files directly — extend via wrapper component
- Use `cn()` utility from `lib/utils` for conditional class names
- PascalCase filenames matching the component name: `Button.tsx` → `<Button />`

## Difference from shared/components/

| `ui/` | `shared/components/` |
|-------|----------------------|
| Stateless primitives (Button, Input, Card) | Stateful shared components (ErrorBoundary, LoadingScreen) |
| Design system building blocks | Cross-feature composite components |
| No props beyond styling/variant | Can have business-related props |
