<div align="center">

<img src="https://www.reactprinciples.dev/logo-icon-dark.svg" alt="React Principles" width="64" />

# React Principles

**A cookbook of React patterns, a copy-paste UI Kit, and a project configurator.**

[![Live Site](https://img.shields.io/badge/site-reactprinciples.dev-4628F1?style=flat-square)](https://reactprinciples.dev)
[![npm](https://img.shields.io/npm/v/react-principles?style=flat-square&color=4628F1)](https://www.npmjs.com/package/react-principles)
[![License: MIT](https://img.shields.io/badge/license-MIT-4628F1?style=flat-square)](./LICENSE)

[Cookbook](https://reactprinciples.dev/nextjs/cookbook) · [Docs](https://reactprinciples.dev/docs/introduction) · [Create](https://reactprinciples.dev/create)

</div>

---

## What is this?

React Principles is an umbrella that contains three distinct products. Each one serves a different audience and has different boundaries.

### Cookbook — the main product

A curated, opinionated guide to modern React development. Production-grade patterns and principles organized as a progressive curriculum (Foundation → Applied → Patterns).

- **For:** Mid-level React developers; AI tools that need a structured corpus of React principles.
- **Not:** Not a beginner tutorial, not a comprehensive React reference, not framework documentation.

### UI Kit — supporting product

A copy-paste React component library. Production-ready components (Tailwind v4, accessibility built-in) that you own fully after install. No runtime dependency on a package.

- **For:** Developers who want pre-built, accessible components they can freely customize.
- **Not:** Not an npm package to import from. Not a CSS framework. Not a design system with a Figma kit.

### Configurator — supporting tool

A browser-based wizard at `/create` that generates a customized React project starter — pick style system, fonts, colors, and components, then download a ready-to-run codebase aligned with Cookbook patterns.

- **For:** Developers starting a new project who want sensible defaults.
- **Not:** Not a CLI. Not a replacement for `create-next-app`. Not for adding components to existing projects (that's UI Kit's CLI).

---

## Quick Start

### Browse patterns

```
https://reactprinciples.dev/nextjs/cookbook
# or
https://reactprinciples.dev/vitejs/cookbook
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

React Principles covers what most UI libraries stop short of:

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
│   ├── ui/               # 30+ UI component primitives
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
| `/llms.txt` | AI-readable compact cookbook (principles + rules) |
| `/llms-full.txt` | AI-readable full cookbook (with code examples) |

---

## For AI Tools

React Principles is structured so AI assistants (Claude, Cursor, Copilot, GPT) can consume the cookbook directly:

- **`/llms.txt`** — compact markdown (principles + rules, no code). ~5K tokens. Drop into any AI context for quick principle-aware help.
- **`/llms-full.txt`** — full markdown with pattern code and framework-specific (Next.js + Vite) implementations. ~17K tokens. Use as RAG context, fine-tuning corpus, or long-form briefing for AI tools.
- **AI Skills** — invocable commands like `/reactprinciples-review` and `/reactprinciples-component`. Install via [skills.sh](https://www.skills.sh):
  ```bash
  npx skills add sindev08/react-principles-skills
  ```

See [github.com/sindev08/react-principles-skills](https://github.com/sindev08/react-principles-skills) for the full skills catalog.

---

## Contributing

Issues and PRs are welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT © [Singgih Budi Purnadi](https://github.com/sindev08)
