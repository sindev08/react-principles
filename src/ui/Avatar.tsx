"use client";
/* eslint-disable @next/next/no-img-element */

import { createContext, useContext, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

export interface AvatarProps {
  size?: AvatarSize;
  className?: string;
  children?: ReactNode;
}

interface AvatarContextValue {
  hasImageError: boolean;
  setHasImageError: (value: boolean) => void;
}

const AvatarContext = createContext<AvatarContextValue | null>(null);

function useAvatarContext() {
  const context = useContext(AvatarContext);
  if (!context) throw new Error("Avatar sub-components must be used inside <Avatar>");
  return context;
}

const SIZE_CLASSES: Record<AvatarSize, string> = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-lg",
};

export function Avatar({ size = "md", className, children }: AvatarProps) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <AvatarContext.Provider value={{ hasImageError, setHasImageError }}>
      <span
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 text-slate-700 dark:bg-[#1f2937] dark:text-slate-200",
          SIZE_CLASSES[size],
          className
        )}
      >
        {children}
      </span>
    </AvatarContext.Provider>
  );
}

Avatar.Image = function AvatarImage({ className, onError, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const { hasImageError, setHasImageError } = useAvatarContext();

  if (hasImageError) return null;

  return (
    <img
      className={cn("h-full w-full object-cover", className)}
      alt={alt ?? ""}
      onError={(event) => {
        setHasImageError(true);
        onError?.(event);
      }}
      {...props}
    />
  );
}

Avatar.Fallback = function AvatarFallback({ className, style, children }: { className?: string; style?: React.CSSProperties; children: ReactNode }) {
  const { hasImageError } = useAvatarContext();
  if (!hasImageError) return null;

  return <span className={cn("font-semibold uppercase", className)} style={style}>{children}</span>;
}

