# Changelog

## [0.1.1](https://github.com/sindev08/react-principles/compare/react-principles@0.1.0...react-principles@v0.1.1) (2026-05-09)


### Bug Fixes

* **cli:** improve error handling, ux, and type safety ([a8fa3ee](https://github.com/sindev08/react-principles/commit/a8fa3ee5496c75e74f7b1768d8eb2e65d4699d3b))
* **cli:** improve error handling, ux, and type safety ([b2bd3ce](https://github.com/sindev08/react-principles/commit/b2bd3cedac10ad828f75dad119753da7045f8b30))
* **cli:** improve error handling, ux, and type safety ([5302b77](https://github.com/sindev08/react-principles/commit/5302b77dc203e6b3685f5c81b6215729001d23e1))

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
