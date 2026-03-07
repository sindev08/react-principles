# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-03-08

Initial public release of **react-principles** — a living cookbook of production-grade React patterns.

### Added

#### Cookbook
- Tier 1 recipes: Folder Structure, Client State, Server State
- Tier 2 recipes: useEffect & Render Cycle, Component Composition, Custom Hooks
- Tier 3 recipes: Services Layer, State Taxonomy
- Coming-soon system with learning ladder structure
- Slug-based recipe routing with detail pages (`/nextjs/cookbook/[slug]`)
- Framework switcher (Next.js / Vite) in DocsHeader — cookbook routes only
- Save/bookmark recipe pattern with localStorage persistence
- Inline live demos per recipe

#### Docs
- Component doc pages with sidebar navigation
- Sliding active indicator in sidebar
- Smooth scroll on TOC link click with header offset
- Cookbook section in sidebar nav
- Active sidebar item auto-centered on navigation

#### UI & Landing
- Command palette search with ⌘K shortcut
- Top progress bar for page navigation feedback
- Enter/exit animations for overlays, tabs, and page transitions
- Floating lines WebGL background in hero section
- Dark mode with anti-FOUC script and localStorage sync
- New UI components: Alert, Avatar, Breadcrumb, Combobox, Command, DatePicker, DropdownMenu, Pagination, Popover, Progress, RadioGroup, Select, Separator, Skeleton, Slider, Switch, Textarea, Toast, Tooltip

#### SEO
- `generateMetadata` per page (cookbook list, recipe detail, docs)
- Dynamic OG image per recipe via Next.js `ImageResponse` (1200×630)
- Root and docs section OG images
- `sitemap.ts` — auto-generated from published recipes
- `robots.ts` — disallow `/vitejs/`, link sitemap
- Canonical URL strategy — `/vitejs/` routes point canonical to `/nextjs/`
- Custom domain: `reactprinciples.dev`

#### Infrastructure
- GitHub Actions CI — lint, typecheck, build on every PR
- PR template and issue templates (Bug, Recipe Proposal, Feature Request)
- `CONTRIBUTING.md` with code conventions and review process
- MIT License
- Branch protection (protect-development, protect-main)
- Vitest setup with 59 unit tests (utils, hooks, stores)

### Changed
- Migrated from monorepo to standalone Next.js app
- Upgraded stack: Next.js 16, React 19, Tailwind CSS 4
- Renamed `Modal` → `Drawer`
- Framework switcher moved to DocsHeader (was in sidebar/landing)
- Real GitHub link in header and footer

### Removed
- Submit recipe button (temporary — pending issue template flow)
- Framework switcher from cookbook detail page and sidebar

[1.0.0]: https://github.com/sindev08/react-principles/releases/tag/v1.0.0
