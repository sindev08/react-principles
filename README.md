# react-principles

A living cookbook and UI kit for modern React development — available at [reactprinciples.dev](https://reactprinciples.dev).

## What's inside

### Cookbook
A reference app with real-world React patterns organized by topic — server state, client state, forms, data tables, auth flows, and more. Each recipe is a runnable example with explanation.

### UI Kit
33 copy-paste UI components installable via CLI. No dependency lock-in — you own the source.

```bash
npx react-principles init
npx react-principles add button card input dialog
```

See [packages/cli/README.md](./packages/cli/README.md) for full CLI documentation.

---

## Tech Stack

| Category | Tool |
|----------|------|
| Framework | Next.js 16 (App Router) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Tables | TanStack Table v8 |
| Forms | React Hook Form v7 + Zod v4 |
| UI | Tailwind CSS v4 + custom `src/ui` primitives |
| Component Explorer | Storybook 10 |
| Testing | Vitest + Testing Library |
| Type Safety | TypeScript strict mode |

---

## Running Locally

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### Storybook

Browse and interact with all 32 UI components in isolation, with light/dark mode toggle and accessibility checks:

```bash
pnpm storybook  # http://localhost:6006
```

### Building the CLI

```bash
pnpm build:cli
```

---

## Project Structure

```
react-principles/
├── packages/
│   └── cli/              # react-principles npm package — component installer
├── src/
│   ├── app/              # Next.js App Router routes
│   ├── features/         # Feature modules (landing, docs, cookbook, examples)
│   ├── shared/           # Shared hooks, stores, types, utils, components
│   ├── ui/               # 33 UI component primitives (CLI source)
│   └── lib/              # Mock API, query client, data utilities
├── scripts/              # Build helpers (sync-registry)
└── docs/                 # Internal pattern documentation
```

---

## Key Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/nextjs/cookbook` | Cookbook recipes (Next.js context) |
| `/vitejs/cookbook` | Cookbook recipes (Vite context) |
| `/docs` | UI component documentation |

---

## License

MIT © [Singgih Budi Purnadi](https://github.com/sindev08)
