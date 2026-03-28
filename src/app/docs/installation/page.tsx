import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";

const TOC_ITEMS = [
  { label: "Requirements", href: "#requirements" },
  { label: "Install Package", href: "#install-package" },
  { label: "Import APIs", href: "#import-apis" },
  { label: "Next Steps", href: "#next-steps" },
];

const INSTALL_PACKAGE = `pnpm add react-principles

# required peers
pnpm add zod zustand clsx tailwind-merge`;

const NPM_INSTALL = `npm install react-principles

# required peers
npm install zod zustand clsx tailwind-merge`;

const YARN_INSTALL = `yarn add react-principles zod zustand clsx tailwind-merge`;

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
  "React 18+ atau React 19",
  "react-dom 18+",
  "TypeScript 5+ untuk pengalaman typing terbaik",
  "Tailwind CSS jika ingin memakai utilitas styling yang sama seperti docs ini",
];

const PEERS = [
  { name: "zod", note: "schema validation helpers" },
  { name: "zustand", note: "state store exports" },
  { name: "clsx", note: "class composition utility" },
  { name: "tailwind-merge", note: "Tailwind class merging for cn()" },
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
            Tambahkan package
            <code className="mx-1 font-mono text-sm text-primary">react-principles</code>
            ke project Anda untuk memakai hooks, stores, utils, types, shared components,
            dan helper API client yang diekspor dari library ini.
          </p>
        </div>

        <section id="requirements" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Requirements</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Library ini dibangun untuk ekosistem React modern. Jika Anda memakai Next.js App Router,
            Vite, atau setup React standar lain, langkah instalasinya tetap sama.
          </p>

          <div className="mb-6 grid gap-3">
            {REQUIREMENTS.map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-[#1f2937] dark:bg-[#161b22]"
              >
                <span className="material-symbols-outlined mt-0.5 text-[18px] text-primary">check_circle</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900/40 dark:bg-amber-900/10">
            <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
              Beberapa API dari package ini mengandalkan peer dependency opsional. Install package
              yang Anda pakai agar bundler dan type checker tidak mengeluh saat import.
            </p>
          </div>
        </section>

        <section id="install-package" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Install Package</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Gunakan package manager favorit Anda. Contoh di bawah juga menginstall peer dependency
            yang paling umum dipakai bersama library ini.
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

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Peer dependencies</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {PEERS.map((peer) => (
                <div
                  key={peer.name}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-[#30363d] dark:bg-[#0d1117]"
                >
                  <code className="text-sm font-semibold text-primary">{peer.name}</code>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{peer.note}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="import-apis" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Import APIs</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Setelah terpasang, Anda bisa import langsung dari root package atau memakai subpath
            exports agar lebih eksplisit sesuai kebutuhan modul Anda.
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

        <section id="next-steps" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Next Steps</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Setelah instalasi selesai, lanjutkan ke halaman berikut agar setup visual dan tema project
            Anda konsisten dengan contoh-contoh yang ada di docs ini.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/docs/theming"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary/40 dark:border-[#1f2937] dark:bg-[#161b22]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Continue</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Theming</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Pelajari token warna, dark mode, dan cara menyesuaikan styling global.
              </p>
            </Link>

            <Link
              href="/docs/introduction"
              className="rounded-2xl border border-slate-200 bg-white p-5 transition-colors hover:border-primary/40 dark:border-[#1f2937] dark:bg-[#161b22]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Back</p>
              <h3 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">Introduction</h3>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Kembali ke overview library dan gambaran umum komponen yang tersedia.
              </p>
            </Link>
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
