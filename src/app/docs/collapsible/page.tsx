"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Collapsible } from "@/ui/Collapsible";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Collapsible } from "@/ui/Collapsible";

// Uncontrolled
<Collapsible defaultOpen>
  <Collapsible.Trigger>Toggle</Collapsible.Trigger>
  <Collapsible.Content>
    <div>Content that animates</div>
  </Collapsible.Content>
</Collapsible>

// Controlled
function MyComponent() {
  const [open, setOpen] = useState(false);
  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger>Toggle</Collapsible.Trigger>
      <Collapsible.Content>
        <div>Content</div>
      </Collapsible.Content>
    </Collapsible>
  );
}

// With chevron icon
<Collapsible>
  <Collapsible.Trigger className="flex items-center gap-2">
    <span>Section</span>
    <ChevronDownIcon className="h-4 w-4 transition-transform duration-200" />
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div>Content</div>
  </Collapsible.Content>
</Collapsible>

// Disabled
<Collapsible disabled>
  <Collapsible.Trigger>Cannot Toggle</Collapsible.Trigger>
  <Collapsible.Content>
    <div>Locked content</div>
  </Collapsible.Content>
</Collapsible>`;

const COPY_PASTE_SNIPPET = `"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CollapsibleProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export interface CollapsibleTriggerProps {
  children: ReactNode;
  className?: string;
}

export interface CollapsibleContentProps {
  children: ReactNode;
  className?: string;
}

// ─── Context ───────────────────────────────────────────────────────────────────

interface CollapsibleContextValue {
  open: boolean;
  toggle: () => void;
  disabled: boolean;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error("Collapsible sub-components must be used inside <Collapsible>");
  }
  return context;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  children,
  className,
}: CollapsibleProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const toggle = useCallback(() => {
    if (disabled) return;

    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    if (onOpenChange) {
      onOpenChange(next);
    }
  }, [open, isControlled, disabled, onOpenChange]);

  return (
    <CollapsibleContext.Provider value={{ open, toggle, disabled }}>
      <div className={className}>{children}</div>
    </CollapsibleContext.Provider>
  );
}

// ─── Trigger Sub-Component ─────────────────────────────────────────────────────

Collapsible.Trigger = function CollapsibleTrigger({ children, className }: CollapsibleTriggerProps) {
  const { open, toggle, disabled } = useCollapsibleContext();

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-disabled={disabled}
      disabled={disabled}
      onClick={toggle}
      className={cn(
        "flex w-full items-center justify-between",
        "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
        disabled && "opacity-50 cursor-not-allowed",
        !disabled && "cursor-pointer",
        className
      )}
    >
      {children}
    </button>
  );
};

// ─── Content Sub-Component ─────────────────────────────────────────────────────

Collapsible.Content = function CollapsibleContent({ children, className }: CollapsibleContentProps) {
  const { open } = useCollapsibleContext();

  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: open ? "1fr" : "0fr",
        transition: "grid-template-rows 0.2s ease",
      }}
    >
      <div style={{ overflow: "hidden" }}>
        <div className={className}>{children}</div>
      </div>
    </div>
  );
};
`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function CollapsibleDocsPage() {
  const [controlled, setControlled] = useState(false);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(false);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Collapsible</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Collapsible
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A simpler expand/collapse primitive compared to Accordion. For single-section toggling
            without the accordion group behavior.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Controlled/Uncontrolled", "Animated", "Disabled State"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="collapsible" />
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
              <strong>Controlled & Uncontrolled:</strong> Works with both <code>open</code> prop and{" "}
              <code>defaultOpen</code> prop
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span>
              <strong>Smooth Animation:</strong> CSS Grid transition for 200ms height animation
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span>
              <strong>Keyboard Accessible:</strong> Native button element with Enter/Space support
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span>
              <strong>Disabled State:</strong> Prevents toggling with visual feedback
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span>
              <strong>Compound Component:</strong> <code>Collapsible.Trigger</code> and{" "}
              <code>Collapsible.Content</code> sub-components
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

        <div className="space-y-6">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-slate-100 dark:bg-[#1f2937] rounded-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={controlled}
                onChange={(e) => setControlled(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Controlled Mode</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={disabled}
                onChange={(e) => setDisabled(e.target.checked)}
                className="w-4 h-4 text-primary rounded border-slate-300 focus:ring-primary"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">Disabled</span>
            </label>
            {controlled && (
              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setOpen(!open)}
                  className="px-3 py-1 text-sm bg-primary text-white rounded-sm hover:bg-primary/90 transition-colors"
                >
                  {open ? "Close" : "Open"}
                </button>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  State: {open ? "open" : "closed"}
                </span>
              </div>
            )}
          </div>

          {/* Demo */}
          <div className="w-full max-w-md">
            {controlled ? (
              <Collapsible open={open} onOpenChange={setOpen} disabled={disabled}>
                <Collapsible.Trigger className="px-4 py-3 bg-slate-100 dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-[#161b22] transition-colors">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {disabled ? "Disabled " : ""}Trigger (Controlled)
                  </span>
                  <svg
                    className="h-4 w-4 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180"
                    data-state={open ? "open" : "closed"}
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This is a controlled collapsible. Use the checkbox above to switch between
                      controlled and uncontrolled modes, or use the Open/Close button to toggle
                      externally.
                    </p>
                  </div>
                </Collapsible.Content>
              </Collapsible>
            ) : (
              <Collapsible disabled={disabled}>
                <Collapsible.Trigger className="px-4 py-3 bg-slate-100 dark:bg-[#1f2937] hover:bg-slate-200 dark:hover:bg-[#161b22] transition-colors">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {disabled ? "Disabled " : ""}Trigger (Uncontrolled)
                  </span>
                  <svg
                    className="h-4 w-4 text-slate-400 transition-transform duration-200 data-[state=open]:rotate-180"
                    data-state={open ? "open" : "closed"}
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Collapsible.Trigger>
                <Collapsible.Content>
                  <div className="p-4 bg-slate-50 dark:bg-[#0d1117]">
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      This is an uncontrolled collapsible. It manages its own open/closed state
                      internally. Click the trigger to toggle.
                    </p>
                  </div>
                </Collapsible.Content>
              </Collapsible>
            )}
          </div>
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
        <CodeBlock filename="Collapsible.tsx" copyText={CODE_SNIPPET}>
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
        <CodeBlock filename="Collapsible.tsx" copyText={COPY_PASTE_SNIPPET}>
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
          {/* Uncontrolled with defaultOpen */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Uncontrolled with defaultOpen
            </h3>
            <CodeBlock
              copyText={`<Collapsible defaultOpen>
  <Collapsible.Trigger>
    <span>Section Title</span>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="p-4">
      Content that starts open
    </div>
  </Collapsible.Content>
</Collapsible>`}
            >{`<Collapsible defaultOpen>
  <Collapsible.Trigger>
    <span>Section Title</span>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="p-4">
      Content that starts open
    </div>
  </Collapsible.Content>
</Collapsible>`}</CodeBlock>
          </div>

          {/* Controlled with external state */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              Controlled with external state
            </h3>
            <CodeBlock
              copyText={`function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        External Toggle: {open ? "Close" : "Open"}
      </button>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger>
          <span>Section Title</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="p-4">
            Controlled content
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}`}
            >{`function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setOpen(!open)}>
        External Toggle: {open ? "Close" : "Open"}
      </button>
      <Collapsible open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger>
          <span>Section Title</span>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="p-4">
            Controlled content
          </div>
        </Collapsible.Content>
      </Collapsible>
    </div>
  );
}`}</CodeBlock>
          </div>

          {/* With chevron icon */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
              With animated chevron icon
            </h3>
            <CodeBlock
              copyText={`<Collapsible>
  <Collapsible.Trigger className="flex items-center gap-2">
    <span>Toggle Section</span>
    <svg
      className="h-4 w-4 transition-transform duration-200"
      style={{ transform: open ? 'rotate(180deg)' : 'none' }}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="p-4">
      Content with animated icon
    </div>
  </Collapsible.Content>
</Collapsible>`}
            >{`<Collapsible>
  <Collapsible.Trigger className="flex items-center gap-2">
    <span>Toggle Section</span>
    <svg
      className="h-4 w-4 transition-transform duration-200"
      style={{ transform: open ? 'rotate(180deg)' : 'none' }}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M4 6l4 4 4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="p-4">
      Content with animated icon
    </div>
  </Collapsible.Content>
</Collapsible>`}</CodeBlock>
          </div>

          {/* Disabled state */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Disabled state</h3>
            <CodeBlock
              copyText={`<Collapsible disabled>
  <Collapsible.Trigger>
    <span>Cannot Toggle</span>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="p-4">
      This section is locked
    </div>
  </Collapsible.Content>
</Collapsible>`}
            >{`<Collapsible disabled>
  <Collapsible.Trigger>
    <span>Cannot Toggle</span>
  </Collapsible.Trigger>
  <Collapsible.Content>
    <div className="p-4">
      This section is locked
    </div>
  </Collapsible.Content>
</Collapsible>`}</CodeBlock>
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
              <tr>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={5}>
                  Collapsible
                </td>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  open
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Controlled open state
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  defaultOpen
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Initial open state (uncontrolled)
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  onOpenChange
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  (open: boolean) =&gt; void
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Callback when open state changes
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  disabled
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Prevents toggling when true
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  className
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Additional CSS classes
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>
                  Collapsible.Trigger
                </td>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  children
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">ReactNode</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Trigger content
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  className
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Additional CSS classes
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400" rowSpan={2}>
                  Collapsible.Content
                </td>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  children
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">ReactNode</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Collapsible content
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">
                  className
                </td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">string</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                  Additional CSS classes
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      </div>
    </DocsPageLayout>
  );
}
