# react-principles

React patterns & principles — reusable hooks, utilities, types, stores, and UI components. Also a living Next.js reference app with runnable examples and pattern documentation.

---

## Install

```bash
npm install react-principles
# or
pnpm add react-principles
# or
yarn add react-principles
```

## Peer Dependencies

```bash
# Required
npm install react react-dom

# Optional (only needed for the features you use)
npm install zustand          # for react-principles/stores
npm install zod              # for react-principles/utils validators
npm install clsx tailwind-merge  # for react-principles/utils cn()
```

---

## Entry Points

| Import | What you get |
|--------|-------------|
| `react-principles` | Everything (hooks + utils + types + stores + components + lib) |
| `react-principles/hooks` | `useDebounce`, `useMediaQuery`, `useLocalStorage`, `useProgressBar`, `useAnimatedMount` |
| `react-principles/utils` | `cn`, `formatCurrency`, `formatDate`, `formatNumber`, Zod schemas |
| `react-principles/types` | TypeScript types — `User`, `ApiResponse`, `PaginatedResponse`, etc. |
| `react-principles/stores` | `useAppStore`, `useFilterStore`, `useSearchStore`, `useHasActiveFilters` |
| `react-principles/components` | `EmptyState`, `LoadingState`, `ErrorBoundary` |
| `react-principles/lib` | `createApiClient` — type-safe fetch wrapper |

---

## UI Components (CLI)

UI components are installed directly into your project via the CLI — similar to how shadcn/ui works. This gives you full ownership of the source so you can customize freely.

### Setup

```bash
npx react-principles-cli init
```

This creates `components.json` and installs the `cn()` utility. Supports Next.js, Vite, Remix, and other React frameworks.

```bash
# With auto-detected framework
npx react-principles-cli init

# Or specify explicitly
npx react-principles-cli init -t next
npx react-principles-cli init -t vite
```

### Add Components

```bash
# Add one component
npx react-principles-cli add button

# Add multiple at once
npx react-principles-cli add button dialog badge card input

# See all available components
npx react-principles-cli list
```

Components are written to `src/components/ui/` (configurable in `components.json`). Dependencies are resolved and installed automatically.

### Available Components

| Component | CLI name | Description |
|-----------|----------|-------------|
| `Accordion` | `accordion` | Collapsible content sections |
| `Alert` | `alert` | Inline status messages |
| `AlertDialog` | `alert-dialog` | Confirmation dialog with destructive actions |
| `Avatar` | `avatar` | User avatar with size variants |
| `Badge` | `badge` | Status and label tags |
| `Breadcrumb` | `breadcrumb` | Navigation breadcrumb trail |
| `Button` | `button` | Primary, secondary, ghost, outline, destructive variants |
| `Card` | `card` | Content container with variants |
| `Checkbox` | `checkbox` | Controlled checkbox with label |
| `Combobox` | `combobox` | Searchable dropdown select |
| `Command` | `command` | Command palette container |
| `DatePicker` | `date-picker` | Date input |
| `Dialog` | `dialog` | Modal dialog with compound sub-components |
| `Drawer` | `drawer` | Slide-in panel (left/right) |
| `DropdownMenu` | `dropdown-menu` | Contextual dropdown |
| `Input` | `input` | Text input with variants |
| `Pagination` | `pagination` | Page navigation |
| `Popover` | `popover` | Floating content anchored to a trigger |
| `Progress` | `progress` | Linear progress bar |
| `RadioGroup` | `radio-group` | Radio button group |
| `Select` | `select` | Native select with styling |
| `Separator` | `separator` | Horizontal/vertical divider |
| `Skeleton` | `skeleton` | Loading placeholder shapes |
| `Slider` | `slider` | Range input |
| `Switch` | `switch` | Toggle switch |
| `Tabs` | `tabs` | Tabbed content panels |
| `Textarea` | `textarea` | Multi-line text input |
| `Toast` | `toast` | Transient notification |
| `Tooltip` | `tooltip` | Hover tooltip with positioning |

---

## Usage Examples

### Hooks

```tsx
import { useDebounce, useMediaQuery, useLocalStorage } from "react-principles/hooks";

function SearchInput() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 400);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />;
}
```

### Utils

```tsx
import { cn, formatCurrency, formatDate } from "react-principles/utils";
import { emailSchema, userSchema } from "react-principles/utils";

cn("base", isActive && "active", isDisabled && "opacity-50");
formatCurrency(1234.56);   // "$1,234.56"
formatDate(new Date());    // "Mar 28, 2026"

const result = emailSchema.safeParse("user@example.com");
```

### Stores

```tsx
import { useAppStore, useFilterStore, useHasActiveFilters } from "react-principles/stores";

function Toolbar() {
  const { theme, toggleTheme } = useAppStore();
  const { search, setSearch, reset } = useFilterStore();
  const hasFilters = useHasActiveFilters();

  return (
    <div>
      <button onClick={toggleTheme}>Theme: {theme}</button>
      {hasFilters && <button onClick={reset}>Clear filters</button>}
    </div>
  );
}
```

### API Client

```tsx
import { createApiClient } from "react-principles/lib";

const api = createApiClient({
  baseUrl: "https://api.example.com",
  getAuthToken: () => localStorage.getItem("token"),
  onError: (err) => console.error(err),
});

const user = await api.get<User>("/users/1");
const created = await api.post<User>("/users", { name: "Alice" });
```

---

## Framework Compatibility

Works with any React 18+ framework:

| Framework | Supported |
|-----------|-----------|
| Next.js (App Router) | ✅ |
| Next.js (Pages Router) | ✅ |
| Vite + React | ✅ |
| Remix | ✅ |
| Gatsby | ✅ |
| Astro (React integration) | ✅ |

All hooks, stores, and components include the `"use client"` directive for Next.js App Router compatibility. In non-Next.js environments the directive is a no-op.

---

## Reference App

This repo also ships as a Next.js reference application with runnable examples and pattern documentation.

### Tech Stack

| Category | Tool |
|----------|------|
| Framework | Next.js 15 (App Router) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form v7 + Zod v3 |
| UI | Tailwind CSS + custom `src/ui` primitives |
| Linting | ESLint + Prettier |
| Type Safety | TypeScript strict mode |

### Running Locally

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Building the CLI

```bash
# Build CLI package only
pnpm build:cli

# Sync component templates from src/ui/ into CLI registry
node scripts/sync-registry.mjs
```

### Project Structure

```text
react-principles/
├── docs/                    # Pattern documentation
├── packages/
│   └── cli/                 # react-principles-cli — component installer
│       └── src/
│           ├── commands/    # init, add
│           ├── registry/    # component registry + templates
│           └── utils/       # fs, pm, css helpers
├── public/                  # Static assets
├── scripts/                 # Build helpers (sync-registry, update-docs)
├── src/
│   ├── app/                 # Next.js App Router routes
│   ├── features/            # Feature modules (landing, docs, cookbook, examples)
│   ├── shared/              # Shared hooks, stores, types, utils, components
│   ├── ui/                  # Design system primitives (copy-paste source)
│   └── lib/                 # Data/client utilities and mock API layer
├── CLAUDE.md                # AI instruction file
└── README.md
```

### Example Routes

| Route | What It Shows |
|-------|---------------|
| `/` | Landing page and project entry |
| `/react-query` | React Query data fetching patterns |
| `/table` | TanStack Table patterns |
| `/forms` | React Hook Form + Zod validation |
| `/state` | Zustand store patterns |
| `/docs/*` | Component and pattern documentation |
| `/nextjs/cookbook/*` | Cookbook examples for Next.js context |
| `/vitejs/cookbook/*` | Cookbook examples for Vite context |

### Pattern Documentation

All patterns documented in [`docs/`](./docs/README.md):

- [Component Patterns](./docs/component-patterns.md)
- [Hooks](./docs/hooks.md)
- [TypeScript](./docs/typescript.md)
- [React Query](./docs/react-query.md)
- [TanStack Table](./docs/tanstack-table.md)
- [Zustand](./docs/zustand.md)
- [Forms](./docs/forms.md)
- [Services](./docs/services.md)
- [Styling](./docs/styling.md)
- [Publishing Package](./docs/publishing-package.md)

---

## License

MIT © [Singgih Budi Purnadi](https://github.com/sindev08)
