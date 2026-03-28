"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";

interface CliInstallBlockProps {
  name: string;
}

export function CliInstallBlock({ name }: CliInstallBlockProps) {
  const [copied, setCopied] = useState(false);

  const command = `npx react-principles-cli add ${name}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <button
          onClick={handleCopy}
          aria-label="Copy install command"
          className={cn(
            "rounded-md p-1.5 transition-colors",
            copied
              ? "text-green-500"
              : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
          )}
        >
          <span className="material-symbols-outlined text-[18px]">
            {copied ? "check" : "content_copy"}
          </span>
        </button>
      </div>
    </div>
  );
}
