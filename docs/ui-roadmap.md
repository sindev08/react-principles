# UI Kit Roadmap

Direction for evolving the UI Kit, grounded in what frontend developers need in **2025–2026**. See the [Sources](#sources) at the bottom.

---

## Where the kit stands

The kit already ships **59 components** — effectively shadcn/ui parity on primitives (button, dialog, popover, combobox, data-table, command, etc.). **More low-level primitives are not the gap.**

What 2025/2026 demands is a **higher-order layer** the kit does not have yet:

| Dominant 2025/2026 trend | Status in the kit |
|---|---|
| **AI-native UI** (chat, prompt, reasoning, streaming) — the #1 trend, standardized by Vercel AI Elements & assistant-ui | ❌ 0 components |
| **App-shell / Sidebar** (dashboard era; shadcn Sidebar is now standard) | ⚠️ has `sheet` / `navigation-menu`, no full Sidebar |
| **Forms for the React 19 era** (Actions, `useFormStatus`, `useOptimistic`) | ⚠️ has `field` / `label`, no Form abstraction |
| **Data density** (faceted filters, virtualization) | ⚠️ has `data-table` / `table`, no "block" patterns |
| **A11y WCAG 2.2 + token-driven Tailwind v4** | ✅ already the foundation — needs an audit |

**Strategic call:** stop adding primitives. Move up to higher-order components, with **AI-native as the flagship** — it differentiates the kit from generic shadcn clones and can be dogfooded on the project's own `/ai` and cookbook pages.

---

## Roadmap — three waves

### Wave 1 — AI-native surface (P0, flagship & differentiator)

Follow the conventions of Vercel AI Elements / assistant-ui / prompt-kit, but as copy-paste components the user fully owns, in the kit's `zinc` style.

| Component | Purpose |
|---|---|
| `prompt-input` | Textarea + attachments + submit (`useFormStatus`-aware) |
| `message` / `conversation` | User/assistant bubbles + auto-scroll during streaming |
| `markdown` + `code-block` | Safe markdown render + syntax highlight (reuses the existing `CopyButton`) |
| `reasoning` | Collapsible "thinking" panel |
| `tool-call` | Tool/agent invocation display |
| `response-actions` | Copy / regenerate / feedback |
| `inline-citation` | Source citations |
| `streaming-text` / `shimmer` | Loading/streaming indicator |

**Why first:** the #1 trend of 2025/2026 and a perfect fit for the AI-first product. Bonus: every component automatically flows to the **CLI `add`**, the **MCP `Get Component` tool**, and the cookbook — so AI components become both installable *and* queryable by AI tools via the project's own MCP server. Compounding advantage.

### Wave 2 — App-shell & productivity (P1)

| Component | Why |
|---|---|
| `sidebar` | Collapsible app sidebar (rail, groups, mobile) — now the dashboard standard |
| `theme-toggle` | Dark-mode switcher — surprisingly missing |
| `empty-state` | Promote from `shared/components` into the kit |
| `stepper` | Wizard/onboarding — ties into the Configurator |
| `sonner`-style toast | Modern toast (if the current `toast` isn't already) |
| `data-table` blocks | Faceted filters, column visibility, selection toolbar |

### Wave 3 — Forms for the React 19 era (P2)

| Component | Why |
|---|---|
| `form` | RHF + Zod abstraction over `field` / `label` — ties into the Form Validation cookbook recipe |
| `submit-button` | Native pending state via `useFormStatus` (React 19) |
| `file-upload` / `dropzone` | Common need, not covered |
| `tags-input` / `multi-select` | Multi-combobox — frequently requested |
| `number-input`, `rating`, `color-picker` | Fillers |

---

## Cross-cutting upgrades (parallel, not new components)

- **React 19**: adopt `use()`, Actions, `useOptimistic`, `useFormStatus`, and **ref-as-prop** (drop `forwardRef`).
- **Tailwind v4 tokens**: ensure consistent `@theme` design tokens + container queries.
- **A11y WCAG 2.2**: audit target size & focus-visible across all 59 components.
- **Virtualization**: for `data-table` / long lists (data-density trend).

---

## How to execute (fits the repo's existing mechanics)

Each new component is one existing pipeline:

1. `src/ui/X.tsx` + an entry in `src/lib/ui-registry.json` → `node scripts/sync-registry.mjs` (auto-generates the CLI `templates.ts` / `registry-data.json` and the MCP `ui-templates.generated.ts`).
2. Plus one Applied cookbook recipe + a starter example in `react-principles-nextjs`.
3. Release each wave as **`feat(cli): add <components>`** landing on `main` with a Conventional Commit *type* (not a `release:` squash title) so release-please cuts a minor automatically. Suggested versions: **1.2.0 = AI wave**, **1.3.0 = app-shell**, **1.4.0 = forms**. See [publishing-package.md](./publishing-package.md).

---

## Recommended first step

Pilot **three Wave 1 components** — `prompt-input`, `message` / `conversation`, and `markdown` + `code-block` — then **dogfood** them on the `/ai` page or a cookbook demo. High impact, low risk, and it immediately strengthens the AI-first story.

---

## Sources

- [Introducing AI Elements — Vercel](https://vercel.com/changelog/introducing-ai-elements)
- [Vercel AI Elements (LogRocket)](https://blog.logrocket.com/vercel-ai-elements/)
- [Frontend Development Trends 2026 — Syncfusion](https://www.syncfusion.com/blogs/post/frontend-development-trends)
- [10 Best Frontend Trends for AI-Ready Web Apps in 2026](https://www.buildmvpfast.com/blog/frontend-trends-ai-ready-web-apps)
- [8 Best React Component Libraries 2026 — UXPin](https://www.uxpin.com/studio/blog/top-react-component-libraries/)
- [UI Components 2025: AI, Web Components, Accessibility](https://blog.madrigan.com/en/blog/202512291048/)
