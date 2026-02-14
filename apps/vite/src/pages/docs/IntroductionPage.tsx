import { DocsPageLayout } from "@/components/docs";
import { CodeBlock } from "@react-principles/shared/components";

const TOC_ITEMS = [
  { label: "Featured Component", href: "#featured" },
  { label: "Usage", href: "#usage" },
  { label: "Installation", href: "#installation" },
  { label: "Customization", href: "#customization" },
  { label: "Accessibility", href: "#accessibility" },
];

const CODE_EXAMPLE = `import { Button } from "@/components/ui/button"

export function ButtonDemo() {
  return (
    <Button variant="primary" size="lg">
      Get Started
    </Button>
  )
}`;

export function IntroductionPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-3xl">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-2 text-sm text-slate-400">
          <span>Docs</span>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          <span className="font-medium text-primary">Introduction</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-5xl">
            Introduction
          </h1>
          <p className="text-xl leading-8 text-slate-500 dark:text-[#94a3b8]">
            Beautifully designed components that you can copy and paste into
            your apps. Accessible. Customizable. Open Source.
          </p>
          <div className="flex flex-wrap gap-4 mt-8">
            <button className="flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-primary px-6 py-2.5 text-sm font-bold text-white transition-opacity hover:opacity-90">
              Get Started
            </button>
            <button className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1f2937] px-6 py-2.5 text-sm font-bold text-slate-900 dark:text-white transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
              GitHub
            </button>
          </div>
        </div>

        {/* Featured Component */}
        <section className="mb-12" id="featured">
          <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Featured Component
          </h2>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#0d1117] p-1 shadow-sm">
            <div className="flex h-[320px] w-full items-center justify-center rounded-lg bg-white dark:bg-[#0b0e14] p-8">
              <PaymentCard />
            </div>
          </div>
        </section>

        {/* Usage */}
        <section className="mb-12" id="usage">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Usage
          </h2>
          <p className="mb-6 text-base text-slate-500 dark:text-[#94a3b8]">
            Copy the following code to integrate the button component into your
            project.
          </p>
          <CodeBlock filename="ButtonComponent.tsx" copyText={CODE_EXAMPLE}>
            <span className="text-primary">import</span>
            {" { Button } "}
            <span className="text-primary">from</span>
            {" "}
            <span className="text-[#a5d6ff]">"@/components/ui/button"</span>
            {"\n\n"}
            <span className="text-primary">export function</span>
            {" "}
            <span className="text-[#d2a8ff]">ButtonDemo</span>
            {"() {\n  "}
            <span className="text-primary">return</span>
            {" (\n    "}
            <span className="text-[#7ee787]">&lt;Button</span>
            {" "}
            <span className="text-[#79c0ff]">variant</span>
            {"="}
            <span className="text-[#a5d6ff]">"primary"</span>
            {" "}
            <span className="text-[#79c0ff]">size</span>
            {"="}
            <span className="text-[#a5d6ff]">"lg"</span>
            <span className="text-[#7ee787]">&gt;</span>
            {"\n      Get Started\n    "}
            <span className="text-[#7ee787]">&lt;/Button&gt;</span>
            {"\n  )\n}"}
          </CodeBlock>
        </section>

        {/* Installation */}
        <section className="mb-12 border-t border-slate-200 dark:border-[#1f2937] pt-12" id="installation">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Installation
          </h2>
          <p className="mb-6 text-base text-slate-500 dark:text-[#94a3b8]">
            The easiest way to get started is by using our CLI tool which
            handles all the configuration for you.
          </p>
          <CliBlock command="npx ui-docs-cli@latest init" />
        </section>

        {/* Page nav */}
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-[#1f2937] pt-8">
          <a href="#" className="flex flex-col gap-1 transition-colors group">
            <span className="text-xs text-slate-400">Previous</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary">
              Getting Started
            </span>
          </a>
          <a href="#" className="flex flex-col items-end gap-1 transition-colors group">
            <span className="text-xs text-slate-400">Next</span>
            <span className="text-sm font-medium text-slate-900 dark:text-white group-hover:text-primary">
              Installation
            </span>
          </a>
        </div>
      </div>
    </DocsPageLayout>
  );
}

function PaymentCard() {
  return (
    <div className="group w-full max-w-sm rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-primary/5 text-primary">
        <span className="material-symbols-outlined text-[28px]">credit_card</span>
      </div>
      <h3 className="mb-1 text-lg font-bold text-slate-900 dark:text-white">
        Payment Method
      </h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-[#94a3b8]">
        Add a new payment method to your account. Your information is encrypted.
      </p>
      <div className="flex flex-col gap-3">
        <div className="group-hover:border-primary/30 flex items-center gap-3 rounded-lg border border-slate-200 dark:border-[#30363d] p-3 transition-colors">
          <div className="flex h-8 w-12 items-center justify-center rounded bg-slate-100 dark:bg-[#f1f5f9]">
            <span className="material-symbols-outlined text-[18px] text-slate-500">
              payments
            </span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Visa ending in 4242
            </p>
            <p className="text-[10px] text-slate-400">Expires 12/26</p>
          </div>
          <div className="w-4 h-4 border-2 rounded-full border-primary bg-primary" />
        </div>
        <button className="w-full rounded-lg py-2.5 text-sm font-bold text-white bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
          Add Payment Method
        </button>
      </div>
    </div>
  );
}

function CliBlock({ command }: { command: string }) {
  return (
    <div className="group flex items-center justify-between rounded-lg border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] p-4">
      <code className="font-mono text-sm text-slate-900 dark:text-white">
        {command}
      </code>
      <button
        onClick={() => navigator.clipboard.writeText(command)}
        className="transition-opacity opacity-0 text-primary group-hover:opacity-100"
        aria-label="Copy command"
      >
        <span className="material-symbols-outlined text-[20px]">
          content_copy
        </span>
      </button>
    </div>
  );
}
