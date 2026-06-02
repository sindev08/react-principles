"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Menubar } from "@/ui/Menubar";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Menubar } from "@/ui/Menubar";

function MyApp() {
  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>File</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item onSelect={() => {}}>
            New Tab <Menubar.Shortcut>⌘T</Menubar.Shortcut>
          </Menubar.Item>
          <Menubar.Separator />
          <Menubar.Item onSelect={() => {}}>
            Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
          </Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
}`;

const COPY_PASTE_SNIPPET = `"use client";

import React, {
  createContext, useCallback, useContext, useEffect, useRef, useState,
  type ButtonHTMLAttributes, type HTMLAttributes, type ReactElement, type ReactNode,
} from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MenubarProps { children: ReactNode; className?: string; }
export interface MenubarMenuProps { children: ReactNode; className?: string; }
export interface MenubarTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; }
export interface MenubarContentProps extends HTMLAttributes<HTMLDivElement> { children: ReactNode; }
export interface MenubarItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; onSelect?: () => void; disabled?: boolean; inset?: boolean;
}
export interface MenubarCheckboxItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; checked?: boolean; defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void; disabled?: boolean;
}
export interface MenubarRadioGroupProps {
  value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
  children: ReactNode; className?: string;
}
export interface MenubarRadioItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string; children: ReactNode; disabled?: boolean;
}
export interface MenubarSeparatorProps extends HTMLAttributes<HTMLDivElement> {}
export interface MenubarSubProps {
  children: ReactNode; className?: string; defaultOpen?: boolean;
  open?: boolean; onOpenChange?: (open: boolean) => void;
}
export interface MenubarSubTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> { children: ReactNode; }
export interface MenubarShortcutProps extends HTMLAttributes<HTMLSpanElement> { children: ReactNode; }

// See full source at /docs/menubar or run: npx react-principles add menubar`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function MenubarDocsPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Menubar</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Menubar
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A desktop-style menu bar with top-level menus, nested dropdowns, checkbox and radio items,
            keyboard navigation, and shortcut hints.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Keyboard Nav", "Nested Menus", "Compound Component"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="menubar" />
        </section>

        {/* Features */}
        <section id="features" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Features</h2>
          </div>
          <ul className="space-y-3 text-slate-600 dark:text-slate-400">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Compound Components:</strong> Menu, Trigger, Content, Item, Separator, Sub, SubTrigger, CheckboxItem, RadioGroup, RadioItem, Shortcut
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Nested Submenus:</strong> Support for arbitrarily nested dropdown menus
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Checkbox Items:</strong> Toggle items with checked/unchecked state
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Radio Items:</strong> Mutually exclusive selection within radio groups
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Keyboard Navigation:</strong> Arrow keys, Escape, Enter/Space
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Keyboard Shortcut Hints:</strong> Display shortcuts with Menubar.Shortcut
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Auto-close:</strong> Escape or outside click closes the menu
              </span>
            </li>
          </ul>
        </section>

        {/* Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>

          <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8">
            <Menubar>
              <Menubar.Menu>
                <Menubar.Trigger>File</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item onSelect={() => {}}>
                    New Tab <Menubar.Shortcut>⌘T</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Item onSelect={() => {}}>
                    New Window <Menubar.Shortcut>⌘N</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Separator />
                  <Menubar.Item onSelect={() => {}}>
                    Open... <Menubar.Shortcut>⌘O</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Item onSelect={() => {}}>
                    Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Separator />
                  <Menubar.CheckboxItem defaultChecked>
                    Auto-save
                  </Menubar.CheckboxItem>
                  <Menubar.Separator />
                  <Menubar.Sub>
                    <Menubar.SubTrigger>Export As</Menubar.SubTrigger>
                    <Menubar.Content>
                      <Menubar.Item onSelect={() => {}}>PDF</Menubar.Item>
                      <Menubar.Item onSelect={() => {}}>PNG</Menubar.Item>
                      <Menubar.Item onSelect={() => {}}>SVG</Menubar.Item>
                    </Menubar.Content>
                  </Menubar.Sub>
                </Menubar.Content>
              </Menubar.Menu>

              <Menubar.Menu>
                <Menubar.Trigger>Edit</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.Item onSelect={() => {}}>
                    Undo <Menubar.Shortcut>⌘Z</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Item onSelect={() => {}}>
                    Redo <Menubar.Shortcut>⇧⌘Z</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Separator />
                  <Menubar.Item onSelect={() => {}}>
                    Cut <Menubar.Shortcut>⌘X</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Item onSelect={() => {}}>
                    Copy <Menubar.Shortcut>⌘C</Menubar.Shortcut>
                  </Menubar.Item>
                  <Menubar.Item onSelect={() => {}}>
                    Paste <Menubar.Shortcut>⌘V</Menubar.Shortcut>
                  </Menubar.Item>
                </Menubar.Content>
              </Menubar.Menu>

              <Menubar.Menu>
                <Menubar.Trigger>View</Menubar.Trigger>
                <Menubar.Content>
                  <Menubar.RadioGroup defaultValue="system">
                    <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
                    <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
                    <Menubar.RadioItem value="system">System</Menubar.RadioItem>
                  </Menubar.RadioGroup>
                  <Menubar.Separator />
                  <Menubar.CheckboxItem defaultChecked>
                    Show Toolbar
                  </Menubar.CheckboxItem>
                  <Menubar.CheckboxItem defaultChecked>
                    Show Sidebar
                  </Menubar.CheckboxItem>
                </Menubar.Content>
              </Menubar.Menu>
            </Menubar>
          </div>
        </section>

        {/* Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="Menubar.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Menubar.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* Usage Examples */}
        <section id="examples" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Usage Examples</h2>
          </div>

          <div className="space-y-8">
            {/* Checkbox items */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Checkbox items
              </h3>
              <CodeBlock
                copyText={`<Menubar.Menu>
  <Menubar.Trigger>View</Menubar.Trigger>
  <Menubar.Content>
    <Menubar.CheckboxItem defaultChecked>
      Show Toolbar
    </Menubar.CheckboxItem>
    <Menubar.CheckboxItem defaultChecked>
      Show Sidebar
    </Menubar.CheckboxItem>
    <Menubar.CheckboxItem>
      Show Status Bar
    </Menubar.CheckboxItem>
  </Menubar.Content>
</Menubar.Menu>`}
              >{`<Menubar.Menu>
  <Menubar.Trigger>View</Menubar.Trigger>
  <Menubar.Content>
    <Menubar.CheckboxItem defaultChecked>
      Show Toolbar
    </Menubar.CheckboxItem>
    <Menubar.CheckboxItem defaultChecked>
      Show Sidebar
    </Menubar.CheckboxItem>
    <Menubar.CheckboxItem>
      Show Status Bar
    </Menubar.CheckboxItem>
  </Menubar.Content>
</Menubar.Menu>`}</CodeBlock>
            </div>

            {/* Radio items */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Radio items
              </h3>
              <CodeBlock
                copyText={`<Menubar.Menu>
  <Menubar.Trigger>Theme</Menubar.Trigger>
  <Menubar.Content>
    <Menubar.RadioGroup defaultValue="system">
      <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
      <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
      <Menubar.RadioItem value="system">System</Menubar.RadioItem>
    </Menubar.RadioGroup>
  </Menubar.Content>
</Menubar.Menu>`}
              >{`<Menubar.Menu>
  <Menubar.Trigger>Theme</Menubar.Trigger>
  <Menubar.Content>
    <Menubar.RadioGroup defaultValue="system">
      <Menubar.RadioItem value="light">Light</Menubar.RadioItem>
      <Menubar.RadioItem value="dark">Dark</Menubar.RadioItem>
      <Menubar.RadioItem value="system">System</Menubar.RadioItem>
    </Menubar.RadioGroup>
  </Menubar.Content>
</Menubar.Menu>`}</CodeBlock>
            </div>

            {/* Submenu */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Nested submenu
              </h3>
              <CodeBlock
                copyText={`<Menubar.Menu>
  <Menubar.Trigger>File</Menubar.Trigger>
  <Menubar.Content>
    <Menubar.Item onSelect={() => {}}>New</Menubar.Item>
    <Menubar.Sub>
      <Menubar.SubTrigger>Open Recent</Menubar.SubTrigger>
      <Menubar.Content>
        <Menubar.Item onSelect={() => {}}>home.html</Menubar.Item>
        <Menubar.Item onSelect={() => {}}>about.html</Menubar.Item>
      </Menubar.Content>
    </Menubar.Sub>
    <Menubar.Separator />
    <Menubar.Item onSelect={() => {}}>
      Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
    </Menubar.Item>
  </Menubar.Content>
</Menubar.Menu>`}
              >{`<Menubar.Menu>
  <Menubar.Trigger>File</Menubar.Trigger>
  <Menubar.Content>
    <Menubar.Item onSelect={() => {}}>New</Menubar.Item>
    <Menubar.Sub>
      <Menubar.SubTrigger>Open Recent</Menubar.SubTrigger>
      <Menubar.Content>
        <Menubar.Item onSelect={() => {}}>home.html</Menubar.Item>
        <Menubar.Item onSelect={() => {}}>about.html</Menubar.Item>
      </Menubar.Content>
    </Menubar.Sub>
    <Menubar.Separator />
    <Menubar.Item onSelect={() => {}}>
      Save <Menubar.Shortcut>⌘S</Menubar.Shortcut>
    </Menubar.Item>
  </Menubar.Content>
</Menubar.Menu>`}</CodeBlock>
            </div>
          </div>
        </section>

        {/* Props Table */}
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
                    Component
                  </th>
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
                {/* Menubar */}
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={1}>
                    Menubar
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">className</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Additional CSS classes</td>
                </tr>
                {/* MenubarItem */}
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={4}>
                    MenubarItem
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onSelect</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">() =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when item is selected (menu closes after)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">inset</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Add left padding (for visual grouping)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">className</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Additional CSS classes</td>
                </tr>
                {/* MenubarCheckboxItem */}
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={4}>
                    MenubarCheckboxItem
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">checked</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled checked state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultChecked</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Uncontrolled initial checked state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onCheckedChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(checked: boolean) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when checked state changes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the item</td>
                </tr>
                {/* MenubarRadioGroup */}
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={3}>
                    MenubarRadioGroup
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">value</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled value</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultValue</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">""</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Uncontrolled initial value</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onValueChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(value: string) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when value changes</td>
                </tr>
                {/* MenubarRadioItem */}
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>
                    MenubarRadioItem
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">value</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Unique value for this radio item</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the item</td>
                </tr>
                {/* MenubarSub */}
                <tr>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={3}>
                    MenubarSub
                  </td>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultOpen</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Start with submenu open</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">open</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled open state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onOpenChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(open: boolean) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when open state changes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
