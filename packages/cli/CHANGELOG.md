# Changelog

## [1.1.0](https://github.com/sindev08/react-principles/compare/react-principles@v1.0.1...react-principles@v1.1.0) (2026-07-23)


### Features

* **cli:** add AI onboarding to the init command ([b11dda0](https://github.com/sindev08/react-principles/commit/b11dda0cb64be7184f936124281fdd77aeda4aa6))
* **cli:** generate ecosystem-ready starters in create ([cee98db](https://github.com/sindev08/react-principles/commit/cee98db3d9c1d79152f22d722baeb3684cc5074e))


### Miscellaneous Chores

* **cli:** move the component registry into registry-data.json ([a154f98](https://github.com/sindev08/react-principles/commit/a154f98))

## [1.0.1](https://github.com/sindev08/react-principles/compare/react-principles@v1.0.0...react-principles@v1.0.1) (2026-06-02)


### Bug Fixes

* **cli:** remove stale radix and third-party deps from create command ([1cef2bf](https://github.com/sindev08/react-principles/commit/1cef2bf71af9e318a0b22dfa3807cee42798ffba))
* **cli:** remove stale third-party deps from create command ([158e997](https://github.com/sindev08/react-principles/commit/158e997b8ba84bd528ba7671a476cda79fdea00b))

## [1.0.0](https://github.com/sindev08/react-principles/compare/react-principles@v0.1.1...react-principles@v1.0.0) (2026-05-20)


### ⚠ BREAKING CHANGES

* **cli:** 'npx react-principles add scrollarea' no longer resolves. Use 'npx react-principles add scroll-area' instead.

### Bug Fixes

* **cli:** add label to registry (missing dependency for field) ([0c3e96c](https://github.com/sindev08/react-principles/commit/0c3e96c609b3ce636210806e85a5d13d73a9f836))
* **cli:** rename scrollarea registry entry to scroll-area ([b22794c](https://github.com/sindev08/react-principles/commit/b22794c972df8e44060a7f60f21903b05b4d1da5))
* **cli:** rename scrollarea registry entry to scroll-area ([bce5ce4](https://github.com/sindev08/react-principles/commit/bce5ce4d8cf0a1502eb55d9bd75d4b8cfac799f1))
* **configurator:** Configurator v1.0 audit — fixes for component names and error handling ([80d94e6](https://github.com/sindev08/react-principles/commit/80d94e67d28ed45d9de083136a278676eae824dc))
* **configurator:** fix component name mismatches in deps and cli ([39d6b66](https://github.com/sindev08/react-principles/commit/39d6b66a66b90f2dcbaf8b4016f7f3ad044775d8))
* **ui:** UI Kit v1.0 audit — fixes for 57 components ([649215f](https://github.com/sindev08/react-principles/commit/649215f460ec56a77d43da1c735bbc091e0d6900))


### Miscellaneous Chores

* **cli:** trigger v1.0.0 release via release-please ([935a36a](https://github.com/sindev08/react-principles/commit/935a36a7bec6fc06db0c34811992de7bf54b8a4e))

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
