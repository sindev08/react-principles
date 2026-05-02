"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Toggle } from "@/ui/Toggle";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Usage Examples", href: "#examples" },
  { label: "Props", href: "#props" },
];

const CODE_SNIPPET = `import { Toggle } from "@/ui/Toggle";

function Toolbar() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);

  return (
    <div className="flex gap-1">
      <Toggle pressed={bold} onPressedChange={setBold}>
        B
      </Toggle>
      <Toggle pressed={italic} onPressedChange={setItalic}>
        I
      </Toggle>
    </div>
  );
}`;

const COPY_PASTE_SNIPPET = `import { useState, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";

export type ToggleVariant = "default" | "outline";
export type ToggleSize = "sm" | "md" | "lg";

export interface ToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
  variant?: ToggleVariant;
  size?: ToggleSize;
  disabled?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<ToggleVariant, Record<"on" | "off", string>> = {
  default: {
    on: "bg-primary text-white hover:bg-primary/90 focus-visible:ring-primary/40",
    off: "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 focus-visible:ring-slate-400/40",
  },
  outline: {
    on: "bg-slate-100 text-slate-900 border border-slate-300 dark:bg-slate-800 dark:text-white dark:border-slate-600 focus-visible:ring-slate-400/40",
    off: "border border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-800/50 focus-visible:ring-slate-400/40",
  },
};

const SIZE_CLASSES: Record<ToggleSize, string> = {
  sm: "text-xs px-3 py-1.5 h-7 gap-1.5",
  md: "text-sm px-4 py-2 h-9 gap-2",
  lg: "text-base px-6 py-2.5 h-11 gap-2",
};

export function Toggle({
  pressed, defaultPressed = false, onPressedChange,
  variant = "default", size = "md", disabled = false,
  children, className, onClick, ...props
}: ToggleProps) {
  const [internal, setInternal] = useState(defaultPressed);
  const isControlled = pressed !== undefined;
  const isOn = isControlled ? pressed : internal;

  const toggle = () => {
    if (disabled) return;
    const next = !isOn;
    if (!isControlled) setInternal(next);
    onPressedChange?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={isOn}
      disabled={disabled}
      onClick={(e) => { onClick?.(e); toggle(); }}
      className={cn(
        "inline-flex items-center justify-center font-semibold rounded-lg transition-all",
        "focus-visible:outline-hidden focus-visible:ring-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isOn ? VARIANT_CLASSES[variant].on : VARIANT_CLASSES[variant].off,
        SIZE_CLASSES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}`;

// ─── Page Component ───────────────────────────────────────────────────────────

export default function ToggleDocsPage() {
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Toggle</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Toggle
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            A two-state button that persists its pressed/active state. Visually reflects
            on/off state and supports controlled and uncontrolled modes.
          </p>
        </div>

        {/* CliInstallBlock */}
        <section className="mb-16">
          <CliInstallBlock name="toggle" />
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
                <strong>Visual State:</strong> Distinct pressed/unpressed styling
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Controlled &amp; Uncontrolled:</strong> Use <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">pressed</code> + <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">onPressedChange</code> or <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">defaultPressed</code>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Accessible:</strong> Correct <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">aria-pressed</code> attribute
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Keyboard Accessible:</strong> Space/Enter to toggle
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">✓</span>
              <span>
                <strong>Variants &amp; Sizes:</strong> <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">default</code> / <code className="text-sm font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">outline</code> in sm/md/lg
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

          <div className="border border-slate-200 dark:border-[#1f2937] rounded-lg p-8 space-y-6">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Toolbar (controlled)</p>
              <div className="inline-flex gap-1">
                <Toggle variant="outline" pressed={bold} onPressedChange={setBold}>B</Toggle>
                <Toggle variant="outline" pressed={italic} onPressedChange={setItalic}>I</Toggle>
                <Toggle variant="outline" pressed={underline} onPressedChange={setUnderline}>U</Toggle>
              </div>
              <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                Active: {bold && "Bold"}{italic && " Italic"}{underline && " Underline"}{!bold && !italic && !underline && "none"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Default variant</p>
              <div className="flex gap-3">
                <Toggle defaultPressed>Pressed</Toggle>
                <Toggle>Unpressed</Toggle>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500 mb-3">Sizes</p>
              <div className="flex items-center gap-3">
                <Toggle size="sm">Small</Toggle>
                <Toggle size="md">Medium</Toggle>
                <Toggle size="lg">Large</Toggle>
              </div>
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
          <CodeBlock filename="Toggle.tsx" copyText={CODE_SNIPPET}>
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
          <CodeBlock filename="Toggle.tsx" copyText={COPY_PASTE_SNIPPET}>
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
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Uncontrolled
              </h3>
              <CodeBlock
                copyText={`<Toggle defaultPressed>Toggle</Toggle>`}
              >{`<Toggle defaultPressed>Toggle</Toggle>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Controlled
              </h3>
              <CodeBlock
                copyText={`const [isOn, setIsOn] = useState(false);

<Toggle pressed={isOn} onPressedChange={setIsOn}>
  Toggle
</Toggle>`}
              >{`const [isOn, setIsOn] = useState(false);

<Toggle pressed={isOn} onPressedChange={setIsOn}>
  Toggle
</Toggle>`}</CodeBlock>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                Outline variant with sizes
              </h3>
              <CodeBlock
                copyText={`<div className="flex gap-3">
  <Toggle variant="outline" size="sm">Small</Toggle>
  <Toggle variant="outline" size="md">Medium</Toggle>
  <Toggle variant="outline" size="lg">Large</Toggle>
</div>`}
              >{`<div className="flex gap-3">
  <Toggle variant="outline" size="sm">Small</Toggle>
  <Toggle variant="outline" size="md">Medium</Toggle>
  <Toggle variant="outline" size="lg">Large</Toggle>
</div>`}</CodeBlock>
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
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Prop</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Default</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">pressed</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Controlled pressed state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">defaultPressed</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Uncontrolled initial pressed state</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">onPressedChange</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">(pressed: boolean) =&gt; void</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">—</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Called when pressed state changes</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">variant</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"default" | "outline"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"default"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Visual variant</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">size</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"sm" | "md" | "lg"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">"md"</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Button size</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-sm font-mono text-slate-600 dark:text-slate-400">disabled</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">boolean</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">false</td>
                  <td className="py-3 px-4 text-sm text-slate-600 dark:text-slate-400">Disable the toggle</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DocsPageLayout>
  );
}
