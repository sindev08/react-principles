import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Alert } from "@/ui/Alert";
import { Card } from "@/ui/Card";

const TOC_ITEMS = [
  { label: "Requirements", href: "#requirements" },
  { label: "Install Package", href: "#install-package" },
  { label: "Import APIs", href: "#import-apis" },
];

const INSTALL_PACKAGE = `pnpm add react-principles

# optional — only install what you use
pnpm add zustand          # for react-principles/stores
pnpm add zod              # for react-principles/utils validators
pnpm add clsx tailwind-merge  # for cn()`;

const NPM_INSTALL = `npm install react-principles

# optional — only install what you use
npm install zustand          # for react-principles/stores
npm install zod              # for react-principles/utils validators
npm install clsx tailwind-merge  # for cn()`;

const YARN_INSTALL = `yarn add react-principles

# optional — only install what you use
yarn add zustand zod clsx tailwind-merge`;

const IMPORT_EXAMPLE = `import { cn, useLocalStorage, useFilterStore, EmptyState } from "react-principles";

export function ExamplePanel() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const filters = useFilterStore((state) => state.filters);

  return (
    <section className={cn("rounded-xl border p-4", theme === "dark" && "bg-slate-950 text-white")}>
      {filters.length === 0 ? (
        <EmptyState
          title="No filters applied"
          description="Start selecting filters to narrow your data."
        />
      ) : null}

      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle theme
      </button>
    </section>
  );
}`;

const SUBPATH_IMPORTS = `import { useDebounce } from "react-principles/hooks";
import { cn } from "react-principles/utils";
import type { User } from "react-principles/types";
import { useSearchStore } from "react-principles/stores";
import { ErrorBoundary } from "react-principles/components";
import { createApiClient } from "react-principles/lib";`;

const REQUIREMENTS = [
  "React 18+ or React 19",
  "react-dom 18+",
  "TypeScript 5+ for the best typing experience",
  "Tailwind CSS if you want to use the same styling utilities as in these docs",
];

const REQUIRED_PEERS = [
  { name: "react", note: ">=18 required" },
  { name: "react-dom", note: ">=18 required" },
];

const OPTIONAL_PEERS = [
  { name: "zustand", note: "react-principles/stores" },
  { name: "zod", note: "react-principles/utils validators" },
  { name: "clsx", note: "cn() utility" },
  { name: "tailwind-merge", note: "cn() utility" },
];

export default function InstallationPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <Link href="/docs/introduction" className="cursor-pointer transition-colors hover:text-primary">
            Getting Started
          </Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Installation</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Installation
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Add the
            <code className="mx-1 font-mono text-sm text-primary">react-principles</code>
            package to your project to use hooks, stores, utils, types, shared components,
            and the API client helper exported from this library.
          </p>
        </div>

        <section id="requirements" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Requirements</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            This library is built for the modern React ecosystem. Whether you use Next.js App Router,
            Vite, or any other standard React setup, the installation steps are the same.
          </p>

          <div className="mb-6 grid gap-3">
            {REQUIREMENTS.map((item) => (
              <Card key={item} className="flex items-start gap-3 p-4">
                <span className="material-symbols-outlined mt-0.5 text-[18px] text-primary">check_circle</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
              </Card>
            ))}
          </div>

          <Alert variant="warning">
            <Alert.Description>
              Some APIs in this package rely on optional peer dependencies. Install the packages
              you use so your bundler and type checker do not complain on import.
            </Alert.Description>
          </Alert>
        </section>

        <section id="install-package" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Install Package</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Use your preferred package manager. The examples below also install the most commonly
            used peer dependencies alongside this library.
          </p>

          <div className="space-y-4">
            <CodeBlock filename="pnpm" copyText={INSTALL_PACKAGE}>
              {INSTALL_PACKAGE}
            </CodeBlock>
            <CodeBlock filename="npm" copyText={NPM_INSTALL}>
              {NPM_INSTALL}
            </CodeBlock>
            <CodeBlock filename="yarn" copyText={YARN_INSTALL}>
              {YARN_INSTALL}
            </CodeBlock>
          </div>

          <Card className="mt-6 p-6 space-y-5">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Required</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {REQUIRED_PEERS.map((peer) => (
                  <Card key={peer.name} variant="flat" className="p-4">
                    <code className="text-sm font-semibold text-primary">{peer.name}</code>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{peer.note}</p>
                  </Card>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Optional</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {OPTIONAL_PEERS.map((peer) => (
                  <Card key={peer.name} variant="flat" className="p-4">
                    <code className="text-sm font-semibold text-primary">{peer.name}</code>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{peer.note}</p>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </section>

        <section id="import-apis" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Import APIs</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Once installed, you can import directly from the root package or use subpath
            exports to be more explicit about the module you need.
          </p>

          <div className="space-y-4">
            <CodeBlock filename="example.tsx" copyText={IMPORT_EXAMPLE}>
              {IMPORT_EXAMPLE}
            </CodeBlock>
            <CodeBlock filename="subpath-imports.ts" copyText={SUBPATH_IMPORTS}>
              {SUBPATH_IMPORTS}
            </CodeBlock>
          </div>
        </section>

        <div className="flex items-center justify-between border-t border-slate-200 pt-8 dark:border-[#1f2937]">
          <Link href="/docs/introduction" className="group flex flex-col gap-1 transition-colors">
            <span className="text-xs text-slate-400">Previous</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Introduction
            </span>
          </Link>
          <Link href="/docs/theming" className="group flex flex-col items-end gap-1 transition-colors">
            <span className="text-xs text-slate-400">Next</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Theming
            </span>
          </Link>
        </div>
      </div>
    </DocsPageLayout>
  );
}
