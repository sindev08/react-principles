import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Alert } from "@/ui/Alert";
import { Card } from "@/ui/Card";
import { MAJOR_VERSIONS } from "@/shared/constants/versions";

const TOC_ITEMS = [
  { label: "Requirements", href: "#requirements" },
  { label: "UI Components", href: "#ui-components" },
];

const CLI_INIT_FRAMEWORK = `# auto-detect framework
npx react-principles@latest init

# or specify explicitly
npx react-principles@latest init -t next
npx react-principles@latest init -t vite
npx react-principles@latest init -t remix`;

const CLI_ADD = `# see all available components
npx react-principles@latest list

# add a single component
npx react-principles@latest add button

# add multiple at once
npx react-principles@latest add button badge card input dialog`;

const REQUIREMENTS = [
  `React ${MAJOR_VERSIONS.react}+`,
  `react-dom ${MAJOR_VERSIONS.react}+`,
  `TypeScript ${MAJOR_VERSIONS.typescript}+ for the best typing experience`,
  `Tailwind CSS v${MAJOR_VERSIONS.tailwindcss}`,
];

export default function InstallationPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <Link href="/docs/introduction" className="transition-colors cursor-pointer hover:text-primary">
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
            UI components are installed directly into your project via the CLI — similar to how
            shadcn/ui works. You own the source, so you can customize freely.
          </p>
        </div>

        {/* Requirements */}
        <section id="requirements" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">Requirements</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Make sure your project meets the following requirements before running the CLI.
          </p>

          <div className="grid gap-3">
            {REQUIREMENTS.map((item) => (
              <Card key={item} className="flex items-start gap-3 p-4">
                <span className="material-symbols-outlined mt-0.5 text-[18px] text-primary">check_circle</span>
                <p className="text-sm text-slate-600 dark:text-slate-400">{item}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* UI Components via CLI */}
        <section id="ui-components" className="mb-14">
          <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">UI Components</h2>
          <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Components are copied directly into your codebase with all dependencies resolved automatically.
          </p>

          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                1. Initialize your project
              </p>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                Creates <code className="font-mono">components.json</code> and installs the{" "}
                <code className="font-mono">cn()</code> utility. Auto-detects your framework
                and tsconfig path aliases.
              </p>
              <CodeBlock filename="terminal" copyText={CLI_INIT_FRAMEWORK}>
                {CLI_INIT_FRAMEWORK}
              </CodeBlock>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                2. Add components
              </p>
              <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
                Components are written to <code className="font-mono">src/components/ui/</code> by default,
                configurable via <code className="font-mono">components.json</code>.
              </p>
              <CodeBlock filename="terminal" copyText={CLI_ADD}>
                {CLI_ADD}
              </CodeBlock>
            </div>
          </div>

          <Alert variant="warning" className="mt-6">
            <Alert.Description>
              UI components require Tailwind CSS v{MAJOR_VERSIONS.tailwindcss}. Make sure your project has Tailwind configured
              before running the CLI.
            </Alert.Description>
          </Alert>
        </section>

        <div className="flex items-center justify-between border-t border-slate-200 pt-8 dark:border-[#1f2937]">
          <Link href="/docs/introduction" className="flex flex-col gap-1 transition-colors group">
            <span className="text-xs text-slate-400">Previous</span>
            <span className="text-sm font-medium text-slate-900 group-hover:text-primary dark:text-white">
              Introduction
            </span>
          </Link>
          <Link href="/docs/theming" className="flex flex-col items-end gap-1 transition-colors group">
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
