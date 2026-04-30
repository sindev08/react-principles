<div align="center">

<img src="https://www.reactprinciples.dev/logo-icon-dark.svg" alt="React Principles" width="64" />

# React Principles

**Production-grade React patterns, 30+ copy-paste UI components, and a project configurator.**

[![Live Site](https://img.shields.io/badge/site-reactprinciples.dev-4628F1?style=flat-square)](https://reactprinciples.dev)
[![npm](https://img.shields.io/npm/v/react-principles?style=flat-square&color=4628F1)](https://www.npmjs.com/package/react-principles)
[![License: MIT](https://img.shields.io/badge/license-MIT-4628F1?style=flat-square)](./LICENSE)

[Cookbook](https://reactprinciples.dev/nextjs/cookbook) · [Docs](https://reactprinciples.dev/docs/introduction) · [Create](https://reactprinciples.dev/create)

</div>

---

## What is this?

React Principles is a reference implementation for modern React development. Not just a component library — a full production codebase with real patterns, real architecture decisions, and real tradeoffs documented.

**Three things in one:**

| | |
|---|---|
| **Cookbook** | Real-world React patterns: server state, forms, data tables, auth flows, and more. Each recipe is runnable and explained. |
| **UI Components** | 30+ copy-paste components installable via CLI. You own the source — no dependency lock-in. |
| **Configurator** | Web wizard at `/create` to scaffold a React project with your chosen style, stack, and components. |

---

## Quick Start

### Browse patterns

```
https://reactprinciples.dev/nextjs/cookbook
```

### Install components via CLI

```bash
npx react-principles add button card input dialog
```

### Scaffold a project

```bash
npx react-principles create my-app --preset <encoded>
```

Or configure interactively at [reactprinciples.dev/create](https://reactprinciples.dev/create).

---

## Beyond components

- **Patterns, not just components** — how to structure server state, manage forms at scale, handle optimistic updates, build data tables
- **Full architecture reference** — feature-sliced structure, query key factories, typed API client, store patterns
- **Framework-aware** — recipes available in both Next.js (App Router) and Vite contexts
- **Project configurator** — generate a preset-encoded starter with your exact stack and style

---

## Stack

| Category | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Server State | TanStack Query v5 |
| Client State | Zustand v5 |
| Forms | React Hook Form v7 + Zod v4 |
| Tables | TanStack Table v8 |
| Styling | Tailwind CSS v4 |
| Testing | Vitest + Testing Library |
| Language | TypeScript (strict) |

---

## Running Locally

```bash
pnpm install
pnpm dev        # http://localhost:3001
pnpm test
pnpm typecheck
pnpm lint
```

### Storybook

```bash
pnpm storybook  # http://localhost:6006
```

### CLI

```bash
pnpm build:cli
```

---

## Project Structure

```
react-principles/
├── packages/
│   └── cli/              # react-principles npm package
├── src/
│   ├── app/              # Next.js App Router routes
│   ├── features/         # Feature modules (landing, docs, cookbook, configurator)
│   ├── shared/           # Shared hooks, stores, types, utils
│   ├── ui/               # 33 UI component primitives
│   └── lib/              # API client, query client, mock data
└── scripts/              # Build helpers
```

---

## Key Routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/create` | Project configurator |
| `/nextjs/cookbook` | Cookbook (Next.js) |
| `/vitejs/cookbook` | Cookbook (Vite) |
| `/docs` | Component docs |

---

## Contributing

Issues and PRs are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT © [Singgih Budi Purnadi](https://github.com/sindev08)
