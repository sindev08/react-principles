"use client";

import { CopyButton } from "@/shared/components";

interface CliInstallBlockProps {
  name: string;
}

export function CliInstallBlock({ name }: CliInstallBlockProps) {
  const command = `npx react-principles add ${name}`;

  return (
    <div className="mb-10">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-slate-500 dark:text-slate-400">
        Install
      </h2>
      <div className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-4 py-3">
        <span className="select-none text-slate-400 dark:text-slate-500">$</span>
        <code className="flex-1 font-mono text-sm text-slate-800 dark:text-slate-200">
          {command}
        </code>
        <CopyButton text={command} label="Copy install command" />
      </div>
    </div>
  );
}
