"use client";

import { cn } from "@/shared/utils/cn";

interface RadiusSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  { value: "none", label: "None", className: "rounded-none" },
  { value: "sm", label: "Small", className: "rounded-sm" },
  { value: "md", label: "Medium", className: "rounded-md" },
  { value: "lg", label: "Large", className: "rounded-lg" },
  { value: "full", label: "Full", className: "rounded-full" },
] as const;

export function RadiusSelector({ value, onChange }: RadiusSelectorProps) {
  return (
    <div className="flex gap-3">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "flex flex-col items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all duration-200",
            "hover:border-primary/50 hover:scale-105",
            value === option.value
              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
              : "border-border"
          )}
        >
          {/* Visual Preview */}
          <div
            className={cn(
              "w-12 h-12 bg-muted border-2 border-border",
              option.className
            )}
          />

          {/* Label */}
          <span className="text-xs font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
