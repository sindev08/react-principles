# Styling

## Principle

Kenapa Tailwind-only, tanpa CSS modules atau styled-components? Karena **co-location** — styles hidup di tempat yang sama dengan markup. Ga perlu switch context antara `.tsx` dan `.module.css`. Ga perlu invent class names. Ga perlu worry about CSS specificity wars atau unused styles. Tailwind + PurgeCSS = hanya CSS yang dipakai yang di-ship.

`cn()` utility (clsx + tailwind-merge) itu essential karena conditional Tailwind classes tanpa merge bisa conflict. `px-2 px-4` harusnya resolve ke `px-4`, bukan apply keduanya. `tailwind-merge` solve ini. `clsx` solve conditional application. Combine keduanya = `cn()`.

Dark mode pakai class-based (`dark:` prefix) bukan media-query-based karena kita mau user bisa toggle manual, bukan cuma follow OS preference. Class-based = kita control kapan `.dark` class di-apply ke `<html>`.

## Rules

- **Tailwind only** — no CSS modules, no styled-components, no inline styles (kecuali dynamic values)
- Pakai `cn()` utility untuk conditional dan merged classes
- Dark mode via `dark:` prefix — class-based strategy
- Component variants via conditional `cn()`, bukan CSS
- Responsive via Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Jangan modify shadcn/ui components langsung — extend via wrapper
- Hindari `!important` — kalau butuh, kemungkinan ada class conflict yang harus di-fix
- Consistent spacing: pakai Tailwind scale (4, 8, 12, 16...), jangan arbitrary values kecuali terpaksa

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

Dari `packages/shared/src/utils/cn.ts`:

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

Kenapa dua library?
- `clsx` — handle conditionals: `clsx("a", false && "b", "c")` => `"a c"`
- `tailwind-merge` — resolve conflicts: `twMerge("px-2 px-4")` => `"px-4"`
- `cn()` — combine keduanya

### Conditional Classes in Components

Dari `apps/nextjs/components/examples/UserTable.tsx` — status badge:

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

Dengan `cn()`:
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

Dark mode pakai class strategy. Toggle class `dark` di `<html>`:

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

Consistent pattern dari project forms:

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

Consistent pattern dari UserTable:

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

- Tailwind config di `apps/nextjs/tailwind.config.js`
- PostCSS config di `apps/nextjs/postcss.config.js`
- Global styles di `app/globals.css` dengan `@tailwind` directives

### Vite

- Tailwind config di `apps/vite/tailwind.config.js`
- Global styles di `src/index.css` dengan `@tailwind` directives
- Sama persis, hanya file location yang beda

## Common Mistakes

- **String concatenation tanpa merge** — `` `px-2 ${condition ? "px-4" : ""}` `` bisa produce `px-2 px-4` (both applied). Pakai `cn()` supaya `px-4` override `px-2`.
- **CSS modules** — Jangan buat `.module.css` files. Semua styling via Tailwind utility classes.
- **Inline styles** — `style={{ padding: "16px" }}` — pakai `className="p-4"`. Exception: truly dynamic values yang ga bisa di-predict (e.g., position from calculation).
- **Arbitrary values overuse** — `w-[347px]` biasanya sign of design inconsistency. Prefer Tailwind scale values.
- **Dark mode lupa** — Component yang cuma punya light styles. Setiap `bg-*`, `text-*`, `border-*` harus ada `dark:` counterpart.
- **`!important` usage** — Kalau butuh `!important` (`!px-4`), biasanya ada class conflict yang harus di-resolve dengan `cn()` atau restructure.
- **Giant className strings** — Kalau className > 3 lines, extract ke variable atau `cn()` call di atas return statement.

## Related

- [Component Patterns](./component-patterns.md) — Component anatomy includes styling
- [TanStack Table](./tanstack-table.md) — Table-specific Tailwind patterns
- [Forms](./forms.md) — Form input styling patterns
- [Zustand](./zustand.md) — Theme store controls dark mode
