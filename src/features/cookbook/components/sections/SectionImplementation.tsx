import { SectionHeading } from "../SectionHeading";
import { CodeBlock } from "../CodeBlock";
import type { ImplTab } from "../../data/detail-data";
import type { Framework } from "../CookbookListPage";

interface SectionImplementationProps {
  number: number;
  implementation: { nextjs: ImplTab; vite: ImplTab };
  framework: Framework;
}

export function SectionImplementation({ number, implementation, framework }: SectionImplementationProps) {
  const activeImpl = framework === "nextjs" ? implementation.nextjs : implementation.vite;

  return (
    <section className="mb-16" id="implementation">
      <SectionHeading number={number} title="Implementation" />
      <div className="flex gap-4 p-4 mb-8 border border-amber-200 dark:border-amber-900/50 rounded-lg bg-amber-50 dark:bg-amber-900/20">
        <span className="material-symbols-outlined text-amber-600">info</span>
        <div>
          <p className="text-sm font-bold tracking-tight text-amber-900 dark:text-amber-300">
            Version Compatibility
          </p>
          <p className="text-xs text-amber-800 dark:text-amber-400">
            Requires React 19+ and the latest stable versions of all dependencies shown.
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <p className="leading-relaxed text-slate-600 dark:text-slate-400">
          {activeImpl.description}
        </p>
        <CodeBlock filename={activeImpl.filename} copyText={activeImpl.code}>
          {activeImpl.code}
        </CodeBlock>
      </div>
    </section>
  );
}
