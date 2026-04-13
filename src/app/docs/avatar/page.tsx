"use client";

import Link from "next/link";
import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Avatar } from "@/ui/Avatar";
import type { AvatarSize } from "@/ui/Avatar";
import { Button } from "@/ui/Button";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-avatar--default";

const SIZES: AvatarSize[] = ["sm", "md", "lg", "xl"];

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
}`;

const PROPS_ROWS = [
  { prop: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Controls the avatar diameter and fallback text size." },
  { prop: "className", type: "string", default: "—", description: "Additional classes applied to the avatar root." },
  { prop: "children", type: "ReactNode", default: "—", description: "Usually composed with Avatar.Image and Avatar.Fallback." },
  { prop: "Avatar.Image", type: "ImgHTMLAttributes<HTMLImageElement>", default: "—", description: "Displays the profile image until an error occurs." },
  { prop: "Avatar.Fallback", type: "{ className?: string; children: ReactNode }", default: "—", description: "Fallback initials or content shown after image load failure." },
];

function AvatarRow() {
  return (
    <div className="flex items-center gap-4">
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
  );
}

export default function AvatarDocPage() {
  const [size, setSize] = useState<AvatarSize>("lg");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">General</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Avatar</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Avatar
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Identity marker for people, teams, and entities with automatic image fallback handling
            and four size options for dense or spacious layouts.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "4 Sizes"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="avatar" />

        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shadow-xs bg-amber-400 shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <div className="p-6 bg-white border rounded-xl border-slate-200">
                <AvatarRow />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <div className="rounded-xl border border-[#1f2937] bg-[#0d1117] p-6">
                <AvatarRow />
              </div>
            </div>
          </div>
        </section>

        <section id="demo" className="mb-16">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
                <span className="text-sm font-bold">02</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0">
              <Link href={STORYBOOK_HREF} target="_blank" rel="noopener noreferrer">
                Open in Storybook
                <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              </Link>
            </Button>
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Size</span>
              <div className="flex gap-2">
                {SIZES.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    onClick={() => setSize(entry)}
                    className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${size === entry ? "bg-primary text-white" : "bg-slate-100 text-slate-600 dark:bg-[#1f2937] dark:text-slate-400"}`}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>
            <Avatar size={size}>
              <Avatar.Image src="https://i.pravatar.cc/120?img=21" alt="Profile" />
              <Avatar.Fallback>JD</Avatar.Fallback>
            </Avatar>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Avatar.tsx" copyText={CODE_SNIPPET}>{CODE_SNIPPET}</CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Avatar.tsx" copyText={COPY_PASTE_SNIPPET}>{COPY_PASTE_SNIPPET}</CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((heading) => (
                    <th key={heading} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3"><code className="font-mono text-xs font-semibold text-primary">{row.prop}</code></td>
                    <td className="px-4 py-3 max-w-[240px]"><code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code></td>
                    <td className="px-4 py-3"><code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code></td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">{row.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
