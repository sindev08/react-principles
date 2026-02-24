# Styling

## Principle

Why Tailwind-only, without CSS modules or styled-components? Because of **co-location** — styles live in the same place as markup. No need to switch context between `.tsx` and `.module.css`. No need to invent class names. No need to worry about CSS specificity wars or unused styles. Tailwind + PurgeCSS = only the CSS that's used gets shipped.

The `cn()` utility (clsx + tailwind-merge) is essential because conditional Tailwind classes without merging can conflict. `px-2 px-4` should resolve to `px-4`, not apply both. `tailwind-merge` solves this. `clsx` solves conditional application. Combine both = `cn()`.

Dark mode uses class-based strategy (`dark:` prefix) instead of media-query-based because we want users to be able to toggle it manually, not just follow OS preference. Class-based = we control when the `.dark` class is applied to `<html>`.

## Rules

- **Tailwind only** — no CSS modules, no styled-components, no inline styles (except dynamic values)
- Use `cn()` utility for conditional and merged classes
- Dark mode via `dark:` prefix — class-based strategy
- Component variants via conditional `cn()`, not CSS
- Responsive via Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Don't modify shadcn/ui components directly — extend via wrapper
- Avoid `!important` — if needed, there's likely a class conflict that should be fixed
- Consistent spacing: use Tailwind scale (4, 8, 12, 16...), avoid arbitrary values unless necessary

## Pattern

```
// cn() utility — conditional class merging
cn("base-classes", condition && "conditional-classes", "override-classes")

// Component variant pattern
cn(
  "base rounded-lg font-medium transition-colors",
  variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
  variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
  disabled && "cursor-not-allowed opacity-50",
)

// Responsive
"text-sm md:text-base lg:text-lg"

// Dark mode
"bg-white text-gray-900 dark:bg-gray-900 dark:text-white"
```

## Implementation

> **Version:** Tailwind CSS v3 + clsx + tailwind-merge | Tested on: 2025-05

### cn() Utility

From `packages/shared/src/utils/cn.ts`:

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names using clsx and resolves Tailwind CSS conflicts
 * with tailwind-merge.
 *
 * @example
 * cn("px-2 py-1", "px-4") // => "px-4 py-1"
 * cn("text-red-500", condition && "text-blue-500")
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

Why two libraries?
- `clsx` — handles conditionals: `clsx("a", false && "b", "c")` => `"a c"`
- `tailwind-merge` — resolves conflicts: `twMerge("px-2 px-4")` => `"px-4"`
- `cn()` — combines both

### Conditional Classes in Components

From `apps/nextjs/components/examples/UserTable.tsx` — status badge:

```tsx
<span
  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
    status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
  }`}
>
  {status}
</span>
```

With `cn()`:
```tsx
<span
  className={cn(
    "rounded-full px-2.5 py-0.5 text-xs font-medium",
    status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  )}
>
  {status}
</span>
```

### Component Variant Pattern

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  children: React.ReactNode;
}

function Button({ variant = "primary", size = "md", disabled, children }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={cn(
        // Base styles — always applied
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",

        // Variant
        variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        variant === "secondary" && "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800",
        variant === "danger" && "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
        variant === "ghost" && "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800",

        // Size
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-5 py-2.5 text-sm",
        size === "lg" && "px-6 py-3 text-base",

        // Disabled
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      {children}
    </button>
  );
}
```

### Dark Mode

Dark mode uses the class strategy. Toggle the `dark` class on `<html>`:

```tsx
// Zustand store controls theme
const theme = useAppStore((s) => s.theme);

// Apply to html element
useEffect(() => {
  document.documentElement.classList.toggle("dark", theme === "dark");
}, [theme]);
```

Dark mode classes in components:
```tsx
// Pattern: light-style dark:dark-style
<div className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
  <p className="text-gray-500 dark:text-gray-400">Subtitle</p>
  <div className="border-gray-200 dark:border-gray-800">
    {/* content */}
  </div>
</div>
```

### Responsive Design

```tsx
// Mobile-first — base = mobile, then add breakpoints
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
  {/* Cards */}
</div>

// Text scaling
<h1 className="text-xl md:text-2xl lg:text-3xl font-bold">Title</h1>

// Hide/show per breakpoint
<nav className="hidden md:flex">Desktop nav</nav>
<button className="md:hidden">Mobile menu</button>

// Combine with useMediaQuery for JS-level responsive
const isMobile = useMediaQuery("(max-width: 768px)");
```

### Form Input Styling

Consistent pattern from project forms:

```tsx
// Input base
const inputClasses = cn(
  "w-full rounded-lg border px-3 py-2 text-sm",
  "border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500",
  "dark:border-gray-700 dark:bg-gray-900",
);

// Error state
const inputErrorClasses = cn(
  inputClasses,
  "border-red-500 focus:border-red-500 focus:ring-red-500",
);

// Usage
<input className={cn(inputClasses, errors.name && "border-red-500")} />
```

### Table Styling

Consistent pattern from UserTable:

```tsx
// Table container
<div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
  <table className="w-full text-left text-sm">
    {/* Header */}
    <thead className="border-b border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
      <th className="px-4 py-3 font-medium text-gray-600 dark:text-gray-400">
    </thead>
    {/* Body */}
    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
      <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-900/50">
        <td className="px-4 py-3">
      </tr>
    </tbody>
  </table>
</div>
```

### Next.js

- Tailwind config in `apps/nextjs/tailwind.config.js`
- PostCSS config in `apps/nextjs/postcss.config.js`
- Global styles in `app/globals.css` with `@tailwind` directives

### Vite

- Tailwind config in `apps/vite/tailwind.config.js`
- Global styles in `src/index.css` with `@tailwind` directives
- Identical, only the file location differs

## Common Mistakes

- **String concatenation without merge** — `` `px-2 ${condition ? "px-4" : ""}` `` can produce `px-2 px-4` (both applied). Use `cn()` so `px-4` overrides `px-2`.
- **CSS modules** — Don't create `.module.css` files. All styling via Tailwind utility classes.
- **Inline styles** — `style={{ padding: "16px" }}` — use `className="p-4"`. Exception: truly dynamic values that can't be predicted (e.g., position from calculation).
- **Arbitrary values overuse** — `w-[347px]` is usually a sign of design inconsistency. Prefer Tailwind scale values.
- **Forgetting dark mode** — A component that only has light styles. Every `bg-*`, `text-*`, `border-*` should have a `dark:` counterpart.
- **`!important` usage** — If `!important` is needed (`!px-4`), there's usually a class conflict that should be resolved with `cn()` or by restructuring.
- **Giant className strings** — If className is > 3 lines, extract to a variable or a `cn()` call above the return statement.

## Related

- [Component Patterns](./component-patterns.md) — Component anatomy includes styling
- [TanStack Table](./tanstack-table.md) — Table-specific Tailwind patterns
- [Forms](./forms.md) — Form input styling patterns
- [Zustand](./zustand.md) — Theme store controls dark mode
