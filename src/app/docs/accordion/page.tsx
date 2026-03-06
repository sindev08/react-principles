"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Accordion } from "@/ui/Accordion";
import type { AccordionType } from "@/ui/Accordion";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const TYPES: AccordionType[] = ["single", "multiple"];

const CODE_SNIPPET = `import { Accordion } from "@/ui/Accordion";

// Single — only one item open at a time
<Accordion.Root type="single" defaultValue="item-1">
  <Accordion.Item value="item-1">
    <Accordion.Trigger>Is it accessible?</Accordion.Trigger>
    <Accordion.Content>
      Yes. It uses aria-expanded and keyboard-navigable buttons.
    </Accordion.Content>
  </Accordion.Item>
  <Accordion.Item value="item-2">
    <Accordion.Trigger>Is it animated?</Accordion.Trigger>
    <Accordion.Content>
      Yes. Content expands with a CSS grid-template-rows transition.
    </Accordion.Content>
  </Accordion.Item>
</Accordion.Root>

// Multiple — any number of items open simultaneously
<Accordion.Root type="multiple" defaultValue={["item-1", "item-3"]}>
  ...
</Accordion.Root>

// Controlled
<Accordion.Root type="single" value={open} onChange={(v) => setOpen(v as string)}>
  ...
</Accordion.Root>

// Prevent collapse (collapsible=false)
<Accordion.Root type="single" collapsible={false} defaultValue="item-1">
  ...
</Accordion.Root>`;

const COPY_PASTE_SNIPPET = `"use client";

import {
  createContext,
  useContext,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";

type ClassValue = string | false | null | undefined;
const cn = (...classes: ClassValue[]) => classes.filter(Boolean).join(" ");

type AccordionType = "single" | "multiple";

interface AccordionProps {
  type?: AccordionType;
  defaultValue?: string | string[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  collapsible?: boolean;
  children: ReactNode;
  className?: string;
}

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

interface AccordionContextValue {
  isOpen: (value: string) => boolean;
  toggle: (value: string) => void;
}

interface ItemContextValue {
  value: string;
  open: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);
const ItemContext = createContext<ItemContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion sub-components must be used inside <Accordion.Root>");
  return context;
}

function useAccordionItem() {
  const context = useContext(ItemContext);
  if (!context) throw new Error("Accordion sub-components must be used inside <Accordion.Item>");
  return context;
}

function AccordionRoot({
  type = "single",
  defaultValue,
  value: controlledValue,
  onChange,
  collapsible = true,
  children,
  className,
}: AccordionProps) {
  const toSet = (next?: string | string[]) => {
    if (!next) return new Set<string>();
    return new Set(Array.isArray(next) ? next : [next]);
  };

  const [internal, setInternal] = useState<Set<string>>(() => toSet(defaultValue));
  const isControlled = controlledValue !== undefined;
  const active = isControlled ? toSet(controlledValue) : internal;

  const toggle = (nextValue: string) => {
    let next: Set<string>;

    if (type === "single") {
      if (active.has(nextValue)) {
        next = collapsible ? new Set() : new Set([nextValue]);
      } else {
        next = new Set([nextValue]);
      }
    } else {
      next = new Set(active);
      if (next.has(nextValue)) next.delete(nextValue);
      else next.add(nextValue);
    }

    if (!isControlled) setInternal(next);
    if (onChange) {
      const values = [...next];
      onChange(type === "single" ? (values[0] ?? "") : values);
    }
  };

  return (
    <AccordionContext.Provider value={{ isOpen: (v) => active.has(v), toggle }}>
      <div className={cn("w-full overflow-hidden rounded-xl border border-slate-200", className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

function AccordionItem({ value, className, children, ...props }: AccordionItemProps) {
  const { isOpen } = useAccordionContext();
  const open = isOpen(value);

  return (
    <ItemContext.Provider value={{ value, open }}>
      <div className={cn("border-b border-slate-200 bg-white last:border-b-0", className)} {...props}>
        {children}
      </div>
    </ItemContext.Provider>
  );
}

function AccordionTrigger({ children, className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { toggle } = useAccordionContext();
  const { value, open } = useAccordionItem();

  return (
    <button
      type="button"
      aria-expanded={open}
      onClick={() => toggle(value)}
      className={cn("flex w-full items-center justify-between px-5 py-4 text-left text-sm font-medium", className)}
      {...props}
    >
      <span>{children}</span>
      <span className={cn("transition-transform", open && "rotate-180")}>⌄</span>
    </button>
  );
}

function AccordionContent({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { open } = useAccordionItem();

  return (
    <div style={{ display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows .2s ease" }}>
      <div style={{ overflow: "hidden" }}>
        <div className={cn("px-5 pb-4 text-sm text-slate-600", className)} {...props}>
          {children}
        </div>
      </div>
    </div>
  );
}

type AccordionCompound = typeof AccordionRoot & {
  Root: typeof AccordionRoot;
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
};

export const Accordion = Object.assign(AccordionRoot, {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
}) as AccordionCompound;`;

const PROPS_ROWS = [
  { component: "Accordion.Root", prop: "type", type: '"single" | "multiple"', default: '"single"', description: "Whether one or multiple items can be open at a time." },
  { component: "Accordion.Root", prop: "defaultValue", type: "string | string[]", default: "—", description: "Initially open item(s) — uncontrolled." },
  { component: "Accordion.Root", prop: "value", type: "string | string[]", default: "—", description: "Controlled open item(s)." },
  { component: "Accordion.Root", prop: "onChange", type: "(value: string | string[]) => void", default: "—", description: "Callback when open items change." },
  { component: "Accordion.Root", prop: "collapsible", type: "boolean", default: "true", description: "When type=single, allow closing the open item by clicking it." },
  { component: "Accordion.Item", prop: "value", type: "string", default: "—", description: "Unique identifier for this item." },
  { component: "Accordion.Trigger", prop: "—", type: "ButtonHTMLAttributes", default: "—", description: "Extends all native button attributes." },
  { component: "Accordion.Content", prop: "—", type: "HTMLAttributes<div>", default: "—", description: "Animated content panel." },
];

// ─── FAQ items ────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    value: "accessible",
    q: "Is it accessible?",
    a: "Yes. Each trigger is a native <button> with aria-expanded. Keyboard navigation works out of the box — Tab moves focus and Enter/Space toggles.",
  },
  {
    value: "animated",
    q: "Is it animated?",
    a: "Yes. Content panels expand and collapse using a CSS grid-template-rows transition from 0fr to 1fr, giving a smooth height animation without JavaScript.",
  },
  {
    value: "controlled",
    q: "Does it support controlled mode?",
    a: "Yes. Pass value and onChange to control open items externally. Omit them and use defaultValue for fully uncontrolled behaviour.",
  },
  {
    value: "multiple",
    q: "Can multiple items be open at once?",
    a: "Yes. Set type=\"multiple\". You can also set defaultValue to an array of item values to open multiple items initially.",
  },
  {
    value: "collapsible",
    q: "Can I prevent an item from closing?",
    a: "Set collapsible={false} on the Accordion. This only applies to type=\"single\" — the open item won't collapse when clicked again.",
  },
];

const INSTALL_ITEMS = [
  { value: "react", q: "React", a: "This component requires React 19+ and uses createContext, useState, and useContext from the standard React package." },
  { value: "tailwind", q: "Tailwind CSS", a: "Styling is fully Tailwind-based with Tailwind v4. Theme tokens and variants are configured in src/app/globals.css." },
  { value: "cn", q: "cn() utility", a: "Uses cn() from @/shared/utils/cn (clsx + tailwind-merge) for conditional class merging." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type ForcedTheme = {
  wrapBg: string;
  panelBg: string;
  panelBorder: string;
  divider: string;
  triggerText: string;
  triggerHover: string;
  chevron: string;
  contentText: string;
};

const FORCED: Record<"light" | "dark", ForcedTheme> = {
  light: {
    wrapBg: "bg-slate-100",
    panelBg: "bg-white",
    panelBorder: "border border-slate-200",
    divider: "divide-y divide-slate-200",
    triggerText: "text-slate-900",
    triggerHover: "hover:bg-slate-50",
    chevron: "text-slate-400",
    contentText: "text-slate-500",
  },
  dark: {
    wrapBg: "bg-[#0d1117]",
    panelBg: "bg-[#161b22]",
    panelBorder: "border border-[#1f2937]",
    divider: "divide-y divide-[#1f2937]",
    triggerText: "text-white",
    triggerHover: "hover:bg-[#1f2937]",
    chevron: "text-slate-500",
    contentText: "text-slate-400",
  },
};

const PREVIEW_ITEMS = [
  { q: "Is it accessible?", open: true, a: "Yes. Uses aria-expanded and keyboard-navigable buttons." },
  { q: "Is it animated?", open: false },
  { q: "Controlled mode?", open: false },
];

function ThemedAccordionPreview({ theme }: { theme: "light" | "dark" }) {
  const c = FORCED[theme];
  const dot =
    theme === "dark"
      ? "h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400"
      : "h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300";

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className={dot} />
        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
          {theme === "dark" ? "Dark" : "Light"}
        </span>
      </div>
      <div className={`${c.wrapBg} rounded-xl p-6`}>
        <div className={`rounded-xl overflow-hidden ${c.panelBorder} ${c.divider}`}>
          {PREVIEW_ITEMS.map((item) => (
            <div key={item.q} className={c.panelBg}>
              <div className={`flex items-center justify-between px-5 py-4 ${c.triggerHover}`}>
                <span className={`text-sm font-medium ${c.triggerText}`}>{item.q}</span>
                <svg
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${c.chevron} ${item.open ? "rotate-180" : ""}`}
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {item.open && item.a && (
                <div className={`px-5 pb-4 text-sm ${c.contentText}`}>{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AccordionDocPage() {
  const [activeType, setActiveType] = useState<AccordionType>("single");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Disclosure</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Accordion</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Accordion
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A vertically stacked set of collapsible sections. Supports single and multiple
            expansion, controlled mode, and smooth CSS animation.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Animated", "Single / Multiple", "Controlled", "Compound"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            First item open, remaining items collapsed — forced light and dark styling.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemedAccordionPreview theme="light" />
            <ThemedAccordionPreview theme="dark" />
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">

            {/* Type selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Type</span>
              <div className="flex gap-2">
                {TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveType(t)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      activeType === t
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* FAQ accordion */}
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                {activeType === "single" ? "Only one item open at a time." : "Multiple items can be open simultaneously."}
              </p>
              <Accordion.Root
                key={activeType}
                type={activeType}
                defaultValue={activeType === "multiple" ? ["accessible", "animated"] : "accessible"}
              >
                {FAQ_ITEMS.map((item) => (
                  <Accordion.Item key={item.value} value={item.value}>
                    <Accordion.Trigger>{item.q}</Accordion.Trigger>
                    <Accordion.Content>{item.a}</Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>

            {/* Second accordion — non-collapsible single */}
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
                <code className="font-mono">collapsible=&#123;false&#125;</code> — active item cannot be collapsed.
              </p>
              <Accordion.Root type="single" collapsible={false} defaultValue="react">
                {INSTALL_ITEMS.map((item) => (
                  <Accordion.Item key={item.value} value={item.value}>
                    <Accordion.Trigger>{item.q}</Accordion.Trigger>
                    <Accordion.Content>{item.a}</Accordion.Content>
                  </Accordion.Item>
                ))}
              </Accordion.Root>
            </div>
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Accordion.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Flat exports seperti <code>AccordionItem</code>, <code>AccordionTrigger</code>, dan
            <code>AccordionContent</code> tetap didukung untuk migrasi bertahap.
          </p>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">
            Snippet ini self-contained dengan context + animation logic di satu file agar minim setup.
          </p>
          <CodeBlock filename="Accordion.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Component", "Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={`${row.component}-${row.prop}`} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.component}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[160px]">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
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
