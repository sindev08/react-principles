"use client";

import { useState } from "react";
import { cn } from "@/shared/utils/cn";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "icon" | "labeled";
  className?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  variant = "icon",
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : label}
        className={cn(
          "rounded-md p-1.5 transition-colors",
          copied
            ? "text-green-500"
            : "text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300",
          className,
        )}
      >
        <span className="material-symbols-outlined text-[18px]">
          {copied ? "check" : "content_copy"}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold transition-colors dark:border-slate-700",
        copied
          ? "border-green-500 text-green-600 dark:border-green-500 dark:text-green-400"
          : "text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-800",
        className,
      )}
    >
      <span className="material-symbols-outlined text-base">
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Copied" : label}
    </button>
  );
}
