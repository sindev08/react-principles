# Changelog

## [0.1.0] - 2026-05-02

### Added

- `react-principles create <app-name>` command — scaffolds a full React project from a preset
  - Supports Next.js and Vite frameworks
  - Decodes preset string from `reactprinciples.dev/create`
  - Auto-detects package manager (npm / pnpm / yarn / bun)
  - Scaffolds feature-sliced structure: `src/ui/`, `src/shared/`, `src/app/`
  - Generates `package.json`, `tsconfig.json`, framework config, and CSS with style vars
  - Copies selected UI components into `src/ui/`
  - Runs install automatically after scaffold
  - `--dry-run` flag to preview without writing files
- Preset decoder (`utils/preset.ts`) — decodes base64+deflate preset strings using Node.js built-in `zlib`
- Dependency resolver (`utils/deps.ts`) — maps component and stack selections to deduplicated npm package lists

## [0.0.4] - 2025-10-01

### Changed

- Internal registry sync improvements

## [0.0.1] - 2025-09-01

### Added

- Initial release
- `react-principles init` — initialize `components.json` config
- `react-principles add [components...]` — add UI components to existing project
- `react-principles list` — list all available components
- 33 UI components available
