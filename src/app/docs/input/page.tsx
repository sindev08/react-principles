"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Input } from "@/ui/Input";
import type { InputSize, InputVariant } from "@/ui/Input";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Props", href: "#props" },
];

const SIZES: InputSize[] = ["sm", "md", "lg"];
const VARIANTS: InputVariant[] = ["default", "filled", "ghost"];

const CODE_SNIPPET = `import { Input } from "@/components/ui/Input";

// Basic
<Input placeholder="Enter your email" />

// With label + description
<Input
  label="Email address"
  description="We'll never share your email."
  placeholder="you@example.com"
  type="email"
/>

// Error state
<Input
  label="Username"
  error="Username is already taken."
  defaultValue="johndoe"
/>

// With icons
<Input
  label="Search"
  leadingIcon={<SearchIcon />}
  trailingIcon={<ClearIcon />}
  placeholder="Search..."
/>

// Sizes: "sm" | "md" | "lg"
// Variants: "default" | "filled" | "ghost"
<Input size="lg" variant="filled" label="Display name" />`;

const PROPS_ROWS = [
  { prop: "label", type: "string", default: "—", description: "Label rendered above the input." },
  { prop: "description", type: "string", default: "—", description: "Helper text shown below the input (hidden when error is present)." },
  { prop: "error", type: "string", default: "—", description: "Error message — turns border red and replaces description." },
  { prop: "size", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls input height and text size." },
  { prop: "variant", type: '"default" | "filled" | "ghost"', default: '"default"', description: "Visual style of the input wrapper." },
  { prop: "leadingIcon", type: "ReactNode", default: "—", description: "Icon placed at the left edge inside the input." },
  { prop: "trailingIcon", type: "ReactNode", default: "—", description: "Icon placed at the right edge inside the input." },
  { prop: "disabled", type: "boolean", default: "false", description: "Disables interaction and reduces opacity." },
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function SearchIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 16 16" fill="none">
      <circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 5.5l6 4 6-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 16 16" fill="none">
      <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg className="h-full w-full" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type ForcedRow = {
  label: string;
  placeholder: string;
  value?: string;
  state: "normal" | "focus" | "error" | "disabled";
  leading?: boolean;
};

const PREVIEW_ROWS: ForcedRow[] = [
  { label: "Email address", placeholder: "you@example.com", state: "normal", leading: true },
  { label: "Username", placeholder: "johndoe", value: "johndoe_xyz", state: "focus" },
  { label: "Password", placeholder: "••••••••", state: "error" },
  { label: "Display name", placeholder: "John Doe", state: "disabled" },
];

type ForcedTheme = {
  bg: string;
  wrap: string;
  label: string;
  placeholder: string;
  value: string;
  border: { normal: string; focus: string; error: string; disabled: string };
  ring: { focus: string };
  iconColor: string;
  desc: string;
  error: string;
};

const FORCED: Record<"light" | "dark", ForcedTheme> = {
  light: {
    bg: "bg-white",
    wrap: "bg-slate-100 p-6 rounded-xl",
    label: "text-slate-700",
    placeholder: "text-slate-400",
    value: "text-slate-900",
    border: {
      normal: "border border-slate-200 bg-white",
      focus: "border border-[#4628F1] ring-2 ring-[#4628F1]/20 bg-white",
      error: "border border-red-400 ring-2 ring-red-400/20 bg-white",
      disabled: "border border-slate-200 bg-slate-50 opacity-50",
    },
    ring: { focus: "ring-[#4628F1]/20" },
    iconColor: "text-slate-400",
    desc: "text-slate-500",
    error: "text-red-500",
  },
  dark: {
    bg: "bg-[#161b22]",
    wrap: "bg-[#0d1117] p-6 rounded-xl",
    label: "text-slate-300",
    placeholder: "text-slate-500",
    value: "text-white",
    border: {
      normal: "border border-[#1f2937] bg-[#0d1117]",
      focus: "border border-[#4628F1] ring-2 ring-[#4628F1]/20 bg-[#0d1117]",
      error: "border border-red-500 ring-2 ring-red-500/20 bg-[#0d1117]",
      disabled: "border border-[#1f2937] bg-[#161b22] opacity-50",
    },
    ring: { focus: "ring-[#4628F1]/20" },
    iconColor: "text-slate-500",
    desc: "text-slate-500",
    error: "text-red-400",
  },
};

function ThemedInputPreview({ theme }: { theme: "light" | "dark" }) {
  const c = FORCED[theme];
  const dot =
    theme === "dark"
      ? "h-3 w-3 rounded-full bg-indigo-500 shadow-sm shadow-indigo-400"
      : "h-3 w-3 rounded-full bg-amber-400 shadow-sm shadow-amber-300";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={dot} />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {theme === "dark" ? "Dark" : "Light"}
        </span>
      </div>
      <div className={c.wrap}>
        <div className="space-y-4">
          {PREVIEW_ROWS.map((row) => (
            <div key={row.label}>
              <p className={`text-xs font-medium mb-1.5 ${c.label}`}>{row.label}</p>
              <div className={`relative flex items-center rounded-lg h-10 px-3.5 transition-all ${c.border[row.state]}`}>
                {row.leading && (
                  <span className={`absolute left-3 h-4 w-4 ${c.iconColor}`}>
                    <MailIcon />
                  </span>
                )}
                <span className={`text-sm ${row.leading ? "pl-5" : ""} ${row.value ? c.value : c.placeholder}`}>
                  {row.value ?? row.placeholder}
                </span>
              </div>
              {row.state === "error" && (
                <p className={`text-xs mt-1 ${c.error}`}>Password must be at least 8 characters.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InputDocPage() {
  const [activeSize, setActiveSize] = useState<InputSize>("md");
  const [activeVariant, setActiveVariant] = useState<InputVariant>("default");
  const [searchValue, setSearchValue] = useState("");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Data Entry</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Input</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Input
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A text input with label, description, error state, leading/trailing icons,
            three sizes, and three visual variants.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "3 Sizes", "3 Variants", "Icons", "Error State"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Normal, focused, error, and disabled states — rendered with forced light and dark styling.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemedInputPreview theme="light" />
            <ThemedInputPreview theme="dark" />
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-sm space-y-6">

            {/* Controls */}
            <div className="flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Size</span>
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeSize === s
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Variant</span>
                <div className="flex gap-2">
                  {VARIANTS.map((v) => (
                    <button
                      key={v}
                      onClick={() => setActiveVariant(v)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeVariant === v
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                size={activeSize}
                variant={activeVariant}
                label="Search"
                placeholder="Search components..."
                leadingIcon={<SearchIcon />}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <Input
                size={activeSize}
                variant={activeVariant}
                label="Email address"
                placeholder="you@example.com"
                type="email"
                leadingIcon={<MailIcon />}
                description="We'll never share your email."
              />
              <Input
                size={activeSize}
                variant={activeVariant}
                label="Username"
                placeholder="johndoe"
                leadingIcon={<UserIcon />}
                error="Username is already taken."
                defaultValue="johndoe"
              />
              <Input
                size={activeSize}
                variant={activeVariant}
                label="Password"
                placeholder="Enter password"
                type="password"
                leadingIcon={<LockIcon />}
                disabled
              />
            </div>
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="components/ui/Input.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            Extends all native <code className="font-mono">HTMLInputElement</code> attributes.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400 break-words">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {row.description}
                    </td>
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
