"use client";

import { useState, type ReactNode } from "react";
import { cn } from "../../utils/cn";

interface CodeBlockProps {
  filename?: string;
  copyText: string;
  children: ReactNode;
  className?: string;
}

export function CodeBlock({
  filename,
  copyText,
  children,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-white/10 bg-[#0f172a]",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
        {filename && (
          <span className="text-xs font-medium text-slate-400">{filename}</span>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-400 transition-colors hover:text-white ml-auto"
        >
          <span className="material-symbols-outlined text-[14px]">
            {copied ? "check" : "content_copy"}
          </span>
          {copied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <div className="p-6 overflow-x-auto">
        <pre className="font-mono text-sm leading-relaxed text-white">
          {children}
        </pre>
      </div>
    </div>
  );
}
