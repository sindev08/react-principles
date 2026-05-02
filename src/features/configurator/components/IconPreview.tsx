"use client";

import { cn } from "@/shared/utils/cn";

interface IconPreviewProps {
  iconSet: string;
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function IconPreview({ iconSet, name, size = 20, color = "#64748b", className }: IconPreviewProps) {
  if (iconSet === "material-symbols") {
    return (
      <span
        className={cn("material-symbols-outlined select-none", className)}
        style={{ fontSize: size, color }}
        aria-hidden="true"
      >
        {name}
      </span>
    );
  }

  return (
    <img
      src={`https://api.iconify.design/${iconSet}/${name}.svg?color=${encodeURIComponent(color)}`}
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
