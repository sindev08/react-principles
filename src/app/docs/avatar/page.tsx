"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Avatar } from "@/ui/Avatar";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
];

const CODE_SNIPPET = `import { Avatar } from "@/ui/Avatar";

<Avatar size="lg">
  <Avatar.Image src="https://i.pravatar.cc/120" alt="Profile" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar>`;

const COPY_PASTE_SNIPPET = `"use client";
/* eslint-disable @next/next/no-img-element */

import { createContext, useContext, useState, type ImgHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

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

Avatar.Fallback = function AvatarFallback({ className, children }: { className?: string; children: ReactNode }) {
  const { hasImageError } = useAvatarContext();
  if (!hasImageError) return null;

  return <span className={cn("font-semibold uppercase", className)}>{children}</span>;
}`;

export default function AvatarDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <h1 className="mb-3 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">Avatar</h1>
        <p className="mb-10 text-lg text-slate-600 dark:text-slate-400">User identity visual with image fallback initials.</p>

        <CliInstallBlock name="avatar" />

        <section id="demo" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">01 Live Demo</h2>
          <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <Avatar size="sm">
              <Avatar.Image src="https://i.pravatar.cc/40?img=15" alt="User" />
              <Avatar.Fallback>AL</Avatar.Fallback>
            </Avatar>
            <Avatar size="md">
              <Avatar.Image src="https://i.pravatar.cc/60?img=32" alt="User" />
              <Avatar.Fallback>BR</Avatar.Fallback>
            </Avatar>
            <Avatar size="lg">
              <Avatar.Image src="https://i.pravatar.cc/100?img=12" alt="User" />
              <Avatar.Fallback>CK</Avatar.Fallback>
            </Avatar>
            <Avatar size="xl">
              <Avatar.Image src="https://invalid.example.com/avatar.png" alt="Fallback" />
              <Avatar.Fallback>DD</Avatar.Fallback>
            </Avatar>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">02 Code Snippet</h2>
          <CodeBlock filename="src/ui/Avatar.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-white">03 Copy-Paste (Single File)</h2>
          <CodeBlock filename="Avatar.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>
      </div>
    </DocsPageLayout>
  );
}
