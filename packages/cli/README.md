# react-principles

A CLI to add react-principles UI components to your project — copy-paste based, no dependency lock-in.

## Requirements

- Node.js 18+
- React 19+
- react-dom 19+
- TypeScript 5+
- Tailwind CSS v4

## Usage

No installation needed. Run directly with `npx`:

```bash
npx react-principles@latest init
npx react-principles@latest add <component>
npx react-principles@latest list
```

---

## Commands

### `init`

Initialize react-principles in your project. Run this once before adding components.

```bash
npx react-principles init
npx react-principles init --template next
```

**Options**

| Flag | Description |
|------|-------------|
| `-t, --template <framework>` | Skip prompt and set framework directly: `next` \| `vite` \| `remix` \| `other` |

**What it does**

1. Auto-detects your framework from `package.json`
2. Prompts for install directories (components, hooks, utilities)
3. Creates `components.json` in your project root
4. Installs `cn()` utility to your lib directory
5. Installs `clsx`, `tailwind-merge`, and `tailwind-animate`
6. Appends `@import "tailwindcss"` to your `globals.css` (skipped for Vite)

**Interactive prompts**

```
? Which framework are you using?   › Next.js  (detected: Next.js)
? Where should components be installed?  › src/components/ui
? Where should hooks be installed?  › src/hooks
? Where should utilities be installed?  › src/lib
```

**Generated `components.json`**

```json
{
  "framework": "next",
  "rsc": true,
  "tsx": true,
  "componentsDir": "src/components/ui",
  "hooksDir": "src/hooks",
  "libDir": "src/lib",
  "aliases": {
    "components": "@/components/ui",
    "hooks": "@/hooks",
    "lib": "@/lib"
  }
}
```

---

### `create`

Scaffold a full React project from a preset string generated at [reactprinciples.dev/create](https://reactprinciples.dev/create).

```bash
npx react-principles create my-app
npx react-principles create my-app --preset <encoded>
npx react-principles create my-app --preset <encoded> --dry-run
```

**Arguments**

| Argument | Description |
|----------|-------------|
| `[app-name]` | Name of the project directory to create. Prompted if not provided. |

**Options**

| Flag | Description |
|------|-------------|
| `--preset <encoded>` | Encoded preset string from `reactprinciples.dev/create`. Falls back to default (Arc style, Next.js) if omitted. |
| `--dry-run` | Print the dependency list and project summary without writing any files. |

**What it does**

1. Decodes the preset string to read your chosen style, framework, components, and stack
2. Creates the project directory with a feature-sliced structure: `src/ui/`, `src/shared/`, `src/app/`
3. Generates `package.json`, `tsconfig.json`, framework config, and `globals.css` with your style's CSS custom properties
4. Copies your selected UI components into `src/ui/`
5. Auto-detects your package manager (npm / pnpm / yarn / bun) and runs install

**Example output**

```
✦ react-principles create

  Framework : Next.js
  Style     : arc (#3b82f6)
  Radius    : md
  Components: Button, Input, Card, Dialog, Toast
  Packages  : 2 deps, 0 devDeps
  PM        : pnpm

→ Creating project structure
  ✓ Base files
  ✓ Next.js config + app directory
  ✓ package.json
  ✓ components.json

→ Copying components
  ✓ Copied: Button, Input, Card, Dialog, Toast

→ Installing dependencies with pnpm
  ✓ Dependencies installed

✓ Done! Created my-app/

  cd my-app
  pnpm run dev
```

---

### `add`

Add one or more components to your project.

```bash
npx react-principles add button
npx react-principles add button input card
npx react-principles add --all
```

**Arguments**

| Argument | Description |
|----------|-------------|
| `[components...]` | One or more component names (space-separated) |
| `--all` | Install all available components at once |

**What it does**

1. Reads `components.json` to determine install paths
2. Resolves transitive dependencies automatically (e.g. adding `dialog` also installs `utils` and `use-animated-mount`)
3. Writes component files to the configured directory
4. Skips files that already exist — your customizations are safe
5. Installs any required npm packages using your detected package manager

**Example output**

```
✓ Created src/lib/utils.ts
✓ Created src/hooks/use-animated-mount.ts
✓ Created src/components/ui/Dialog.tsx
– Skipped src/lib/utils.ts (already exists)

Done!
```

> If you pass an unknown component name, the CLI will show all available components inline so you don't need to run `list` separately.

---

### `list`

Display all available components.

```bash
npx react-principles list
```

**Example output**

```
Available components:

  accordion            Collapsible content sections
  alert                Inline status messages
  alert-dialog         Confirmation dialog with destructive actions
  ...
```

---

## Configuration

`components.json` is created by `init` and read by `add`. You can edit it manually if you change your project structure.

| Field | Type | Description |
|-------|------|-------------|
| `framework` | `next` \| `vite` \| `remix` \| `other` | Your framework |
| `rsc` | `boolean` | React Server Components (auto-set to `true` for Next.js) |
| `tsx` | `boolean` | TypeScript (always `true`) |
| `componentsDir` | `string` | Where UI components are written |
| `hooksDir` | `string` | Where hooks are written |
| `libDir` | `string` | Where utilities are written |
| `aliases.components` | `string` | Import alias for components |
| `aliases.hooks` | `string` | Import alias for hooks |
| `aliases.lib` | `string` | Import alias for utilities |

---

## Available Components

Run `npx react-principles list` to see all components with descriptions.

### Utilities

Installed automatically as dependencies of any component, or added directly.

| Name | Output | Description |
|------|--------|-------------|
| `utils` | `lib/utils.ts` | `cn()` utility for merging Tailwind classes |
| `use-animated-mount` | `hooks/use-animated-mount.ts` | Hook for managing animated mount/unmount timing |

### Components

| Name | Output | Extra deps |
|------|--------|------------|
| `accordion` | `Accordion.tsx` | — |
| `alert` | `Alert.tsx` | — |
| `alert-dialog` | `AlertDialog.tsx` | `use-animated-mount` |
| `aspect-ratio` | `AspectRatio.tsx` | — |
| `avatar` | `Avatar.tsx` | — |
| `badge` | `Badge.tsx` | — |
| `breadcrumb` | `Breadcrumb.tsx` | — |
| `button` | `Button.tsx` | — |
| `button-group` | `ButtonGroup.tsx` | — |
| `calendar` | `Calendar.tsx` | — |
| `card` | `Card.tsx` | — |
| `carousel` | `Carousel.tsx` | — |
| `chart` | `Chart.tsx` | `recharts` |
| `checkbox` | `Checkbox.tsx` | — |
| `collapsible` | `Collapsible.tsx` | — |
| `combobox` | `Combobox.tsx` | — |
| `command` | `Command.tsx` | — |
| `context-menu` | `ContextMenu.tsx` | — |
| `data-table` | `DataTable.tsx` | `@tanstack/react-table` |
| `date-picker` | `DatePicker.tsx` | — |
| `dialog` | `Dialog.tsx` | `use-animated-mount` |
| `drawer` | `Drawer.tsx` | `use-animated-mount` |
| `dropdown-menu` | `DropdownMenu.tsx` | — |
| `field` | `Field.tsx` | — |
| `hover-card` | `HoverCard.tsx` | — |
| `input` | `Input.tsx` | — |
| `input-group` | `InputGroup.tsx` | — |
| `input-otp` | `InputOTP.tsx` | — |
| `item` | `Item.tsx` | — |
| `kbd` | `Kbd.tsx` | — |
| `menubar` | `Menubar.tsx` | — |
| `native-select` | `NativeSelect.tsx` | — |
| `navigation-menu` | `NavigationMenu.tsx` | — |
| `page-progress` | `PageProgress.tsx` | `use-animated-mount` |
| `pagination` | `Pagination.tsx` | — |
| `popover` | `Popover.tsx` | — |
| `progress` | `Progress.tsx` | — |
| `radio-group` | `RadioGroup.tsx` | — |
| `resizable` | `Resizable.tsx` | — |
| `scrollarea` | `ScrollArea.tsx` | — |
| `search-dialog` | `SearchDialog.tsx` | `use-animated-mount` |
| `select` | `Select.tsx` | — |
| `separator` | `Separator.tsx` | — |
| `sheet` | `Sheet.tsx` | `use-animated-mount` |
| `skeleton` | `Skeleton.tsx` | — |
| `slider` | `Slider.tsx` | — |
| `spinner` | `Spinner.tsx` | — |
| `switch` | `Switch.tsx` | — |
| `table` | `Table.tsx` | — |
| `tabs` | `Tabs.tsx` | — |
| `textarea` | `Textarea.tsx` | — |
| `toast` | `Toast.tsx` | `use-animated-mount` |
| `toggle` | `Toggle.tsx` | — |
| `toggle-group` | `ToggleGroup.tsx` | — |
| `tooltip` | `Tooltip.tsx` | — |
| `typography` | `Typography.tsx` | — |

> **Note:** All components depend on `utils` (`cn()` utility). It is always installed automatically.

---

## How It Works

react-principles uses a **copy-paste model** — component source code is copied directly into your project. You own the code and can customize it freely without maintaining a fork or ejecting from a library.

There are no runtime dependencies on react-principles. Once a component is added to your project, it has no connection to this package.

---

## License

MIT
