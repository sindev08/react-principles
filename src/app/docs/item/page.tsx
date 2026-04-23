"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Item } from "@/ui/Item";
import { Kbd } from "@/ui/Kbd";
import { Badge } from "@/ui/Badge";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Item } from "@/ui/Item";
import { Kbd } from "@/ui/Kbd";

// Basic
<Item label="Settings" />

// With icon
<Item
  label="Search"
  icon={<span className="material-symbols-outlined text-[18px]">search</span>}
/>

// With description
<Item
  label="Notifications"
  description="Manage your notification preferences"
/>

// With trailing action
<Item
  label="Save"
  trailing={<Kbd>⌘S</Kbd>}
/>

// Active state
<Item label="Home" active />

// Disabled
<Item label="Sign out" disabled />`;

const COPY_PASTE_SNIPPET = `import {
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface ItemProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  label: string;
  description?: string;
  trailing?: ReactNode;
  active?: boolean;
  disabled?: boolean;
}

export function Item({
  icon,
  label,
  description,
  trailing,
  active = false,
  disabled = false,
  className,
  ...props
}: ItemProps) {
  return (
    <div
      role="option"
      aria-selected={active || undefined}
      aria-disabled={disabled || undefined}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors",
        !disabled && "cursor-pointer",
        active && "bg-primary/10",
        !active && !disabled && "hover:bg-slate-100 dark:hover:bg-slate-800/50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="shrink-0 text-slate-500 dark:text-slate-400">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            "block truncate text-sm font-medium",
            active
              ? "text-primary"
              : "text-slate-900 dark:text-white",
          )}
        >
          {label}
        </span>
        {description && (
          <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
            {description}
          </span>
        )}
      </span>
      {trailing && (
        <span className="ml-auto shrink-0">{trailing}</span>
      )}
    </div>
  );
}`;

const PROPS_ROWS = [
  {
    prop: "icon",
    type: "ReactNode",
    default: "—",
    description: "Leading icon slot.",
  },
  {
    prop: "label",
    type: "string",
    default: "—",
    description: "Primary text content.",
  },
  {
    prop: "description",
    type: "string",
    default: "—",
    description: "Secondary text below the label.",
  },
  {
    prop: "trailing",
    type: "ReactNode",
    default: "—",
    description: "Trailing slot for badges, shortcuts, or action buttons.",
  },
  {
    prop: "active",
    type: "boolean",
    default: "false",
    description: "Highlights the item with a primary background.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Prevents interaction and reduces opacity.",
  },
  {
    prop: "className",
    type: "string",
    default: "—",
    description: "Extra CSS classes merged via cn().",
  },
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ItemDocsPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">General</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Item</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Item
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A composable list item primitive with slots for icon, label,
            description, and trailing action. Foundation for list UIs, command
            palettes, and menu-like layouts.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Active State", "Slot-based"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="item" />
        </section>

        {/* 01 Features */}
        <section id="features" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Four independent slots:</strong> icon, label, description, and trailing action
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Active state:</strong> visually distinct highlighting for selected items
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Disabled state:</strong> prevents interaction and reduces opacity
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Composable slots:</strong> icon, label, description, and trailing are all independently optional
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">&#10003;</span>
              <span>
                <strong>Accessible:</strong> <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">role="option"</code>, <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">aria-selected</code>, <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">aria-disabled</code>
              </span>
            </li>
          </ul>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>

          <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8 space-y-8">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">All slots populated</p>
              <div className="max-w-xs space-y-1">
                <Item
                  icon={<span className="material-symbols-outlined text-[18px]">search</span>}
                  label="Search"
                  description="Find files and content"
                  trailing={<Kbd>⌘K</Kbd>}
                />
                <Item
                  icon={<span className="material-symbols-outlined text-[18px]">home</span>}
                  label="Home"
                  description="Go to dashboard"
                  active
                />
                <Item
                  icon={<span className="material-symbols-outlined text-[18px]">logout</span>}
                  label="Sign out"
                  disabled
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">With trailing badges</p>
              <div className="max-w-xs space-y-1">
                <Item
                  icon={<span className="material-symbols-outlined text-[18px]">mail</span>}
                  label="Messages"
                  trailing={<Badge variant="default">3</Badge>}
                />
                <Item
                  icon={<span className="material-symbols-outlined text-[18px]">update</span>}
                  label="Updates"
                  trailing={<Badge variant="success">New</Badge>}
                />
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Minimal — label only</p>
              <div className="max-w-xs space-y-1">
                <Item label="Plain item" />
                <Item label="Another item" active />
              </div>
            </div>
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Item.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Item.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Usage Examples */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Examples</h2>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Command palette item
              </h3>
              <CodeBlock
                copyText={`<Item
  icon={<span className="material-symbols-outlined text-[18px]">search</span>}
  label="Search"
  description="Find files and content"
  trailing={<Kbd>⌘K</Kbd>}
/>`}
              >{`<Item
  icon={<span className="material-symbols-outlined text-[18px]">search</span>}
  label="Search"
  description="Find files and content"
  trailing={<Kbd>⌘K</Kbd>}
/>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Menu with active and disabled items
              </h3>
              <CodeBlock
                copyText={`<Item icon={<Icon />} label="Dashboard" active />
<Item icon={<Icon />} label="Settings" />
<Item icon={<Icon />} label="Sign out" disabled />`}
              >{`<Item icon={<Icon />} label="Dashboard" active />
<Item icon={<Icon />} label="Settings" />
<Item icon={<Icon />} label="Sign out" disabled />`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                List with badge trailing
              </h3>
              <CodeBlock
                copyText={`<Item
  icon={<Icon />}
  label="Messages"
  trailing={<Badge variant="default">3</Badge>}
/>`}
              >{`<Item
  icon={<Icon />}
  label="Messages"
  trailing={<Badge variant="default">3</Badge>}
/>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* 06 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">06</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-[#1f2937]">
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Prop
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Type
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Default
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="py-3 px-4">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="py-3 px-4 max-w-[200px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400">{row.type}</code>
                    </td>
                    <td className="py-3 px-4">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="py-3 px-4 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
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
