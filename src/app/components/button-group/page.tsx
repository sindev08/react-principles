"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { ButtonGroup } from "@/ui/ButtonGroup";
import { Button } from "@/ui/Button";
import type { ButtonGroupVariant, ButtonGroupSize, ButtonGroupOrientation } from "@/ui/ButtonGroup";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

type VariantMeta = { variant: ButtonGroupVariant; label: string };

const VARIANTS: VariantMeta[] = [
  { variant: "default", label: "Default" },
  { variant: "outline", label: "Outline" },
];

const SIZES: ButtonGroupSize[] = ["sm", "md", "lg"];
const ORIENTATIONS: ButtonGroupOrientation[] = ["horizontal", "vertical"];

// Forced-theme classes (no dark: prefix)
const FORCED_LIGHT_DEFAULT =
  "bg-[#4628F1] text-white hover:bg-[#4628F1]/90";
const FORCED_DARK_DEFAULT =
  "bg-[#4628F1] text-white hover:bg-[#4628F1]/90";
const FORCED_LIGHT_OUTLINE =
  "border border-slate-300 text-slate-700 hover:bg-slate-50";
const FORCED_DARK_OUTLINE =
  "border border-slate-600 text-slate-300 hover:bg-slate-800/50";

const CODE_SNIPPET = `import { ButtonGroup } from "@/ui/ButtonGroup";
import { Button } from "@/ui/Button";

// Horizontal (default)
<ButtonGroup variant="default">
  <Button>Left</Button>
  <Button>Center</Button>
  <Button>Right</Button>
</ButtonGroup>

// Outline variant
<ButtonGroup variant="outline">
  <Button>Save</Button>
  <Button>Cancel</Button>
</ButtonGroup>

// Vertical orientation
<ButtonGroup orientation="vertical">
  <Button>Top</Button>
  <Button>Middle</Button>
  <Button>Bottom</Button>
</ButtonGroup>

// Sizes
<ButtonGroup size="sm">...</ButtonGroup>
<ButtonGroup size="md">...</ButtonGroup>
<ButtonGroup size="lg">...</ButtonGroup>`;

const COPY_PASTE_SNIPPET = `import {
  Children,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import type { ButtonProps } from "./Button";

export type ButtonGroupOrientation = "horizontal" | "vertical";
export type ButtonGroupVariant = "default" | "outline";
export type ButtonGroupSize = "sm" | "md" | "lg";

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: ButtonGroupOrientation;
  variant?: ButtonGroupVariant;
  size?: ButtonGroupSize;
  disabled?: boolean;
  children: ReactNode;
}

const VARIANT_MAP: Record<ButtonGroupVariant, ButtonProps["variant"]> = {
  default: "primary",
  outline: "outline",
};

function getGroupedRadiusClass(
  index: number,
  total: number,
  isVertical: boolean,
): string {
  if (total <= 1) return "";
  const isFirst = index === 0;
  const isLast = index === total - 1;

  if (isVertical) {
    if (isFirst) return "rounded-b-none";
    if (isLast) return "rounded-t-none";
    return "rounded-none";
  }

  if (isFirst) return "rounded-r-none";
  if (isLast) return "rounded-l-none";
  return "rounded-none";
}

export function ButtonGroup({
  orientation = "horizontal",
  variant = "default",
  size = "md",
  disabled = false,
  children,
  className,
  ...props
}: ButtonGroupProps) {
  const isVertical = orientation === "vertical";
  const mappedVariant = VARIANT_MAP[variant];
  const count = Children.count(children);

  return (
    <div
      role="group"
      className={cn(
        isVertical ? "inline-flex flex-col" : "inline-flex items-center",
        className,
      )}
      {...props}
    >
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;
        const childProps = child.props as Partial<ButtonProps>;
        const radiusClass = getGroupedRadiusClass(index, count, isVertical);
        const spacingClass = isVertical
          ? "not-first:-mt-px"
          : "not-first:-ml-px";

        return cloneElement(child as ReactElement<ButtonProps>, {
          variant: childProps.variant ?? mappedVariant,
          size: childProps.size ?? size,
          disabled: childProps.disabled ?? disabled,
          className: cn(radiusClass, spacingClass, childProps.className),
        });
      })}
    </div>
  );
}`;

const PROPS_ROWS = [
  {
    prop: "orientation",
    type: '"horizontal" | "vertical"',
    default: '"horizontal"',
    description: "Layout direction of the button group.",
  },
  {
    prop: "variant",
    type: '"default" | "outline"',
    default: '"default"',
    description: 'Variant applied to all child Buttons. "default" maps to primary, "outline" maps to outline.',
  },
  {
    prop: "size",
    type: '"sm" | "md" | "lg"',
    default: '"md"',
    description: "Size applied to all child Buttons.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Disables all child Buttons.",
  },
  {
    prop: "children",
    type: "ReactNode",
    default: "—",
    description: "Must contain <Button> elements.",
  },
  {
    prop: "className",
    type: "string",
    default: "—",
    description: "Extra CSS classes on the container div.",
  },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

function ThemedButtonGroupGrid({ theme }: { theme: "light" | "dark" }) {
  const d = theme === "dark";
  const bg = d ? "bg-[#0d1117]" : "bg-white";
  const border = d ? "border-[#1f2937]" : "border-slate-200";
  const defaultCls = d ? FORCED_DARK_DEFAULT : FORCED_LIGHT_DEFAULT;
  const outlineCls = d ? FORCED_DARK_OUTLINE : FORCED_LIGHT_OUTLINE;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-6`}>
      <div className="flex flex-wrap items-center gap-3">
        <span className={`inline-flex items-center justify-center font-semibold rounded-l-lg rounded-r-none text-sm px-4 py-2 h-9 transition-all ${defaultCls}`}>
          Left
        </span>
        <span className={`inline-flex items-center justify-center font-semibold rounded-none text-sm px-4 py-2 h-9 transition-all -ml-px ${defaultCls}`}>
          Center
        </span>
        <span className={`inline-flex items-center justify-center font-semibold rounded-r-lg rounded-l-none text-sm px-4 py-2 h-9 transition-all -ml-px ${defaultCls}`}>
          Right
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4">
        <span className={`inline-flex items-center justify-center font-semibold rounded-l-lg rounded-r-none text-sm px-4 py-2 h-9 transition-all ${outlineCls}`}>
          Save
        </span>
        <span className={`inline-flex items-center justify-center font-semibold rounded-r-lg rounded-l-none text-sm px-4 py-2 h-9 transition-all -ml-px ${outlineCls}`}>
          Cancel
        </span>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ButtonGroupDocPage() {
  const [activeVariant, setActiveVariant] = useState<ButtonGroupVariant>("default");
  const [activeSize, setActiveSize] = useState<ButtonGroupSize>("md");
  const [activeOrientation, setActiveOrientation] = useState<ButtonGroupOrientation>("horizontal");
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">General</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Button Group</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            ButtonGroup
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A set of buttons visually joined together, used for segmented actions
            or view toggles. Supports horizontal and vertical orientations with
            shared variant and size propagation.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "2 Variants", "3 Sizes", "2 Orientations"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="button-group" />

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Theme Preview</h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Both variants across light and dark themes — forced styling for
            accurate side-by-side comparison.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full shadow-xs bg-amber-400 shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedButtonGroupGrid theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedButtonGroupGrid theme="dark" />
            </div>
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
            {/* Controls */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Variant</span>
                <div className="flex flex-wrap gap-2">
                  {VARIANTS.map(({ variant, label }) => (
                    <button
                      key={variant}
                      onClick={() => setActiveVariant(variant)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeVariant === variant
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Size</span>
                <div className="flex gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setActiveSize(s)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeSize === s
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                        }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">Orientation</span>
                <div className="flex gap-2">
                  {ORIENTATIONS.map((o) => (
                    <button
                      key={o}
                      onClick={() => setActiveOrientation(o)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeOrientation === o
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                        }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* State toggle */}
            <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100 dark:border-[#1f2937]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDisabled}
                  onChange={(e) => setIsDisabled(e.target.checked)}
                  className="rounded-sm border-slate-300 dark:border-slate-600 accent-primary"
                />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">disabled</span>
              </label>
            </div>

            {/* Preview */}
            <div className="flex items-center py-6 border-t border-slate-100 dark:border-[#1f2937]">
              <ButtonGroup
                variant={activeVariant}
                size={activeSize}
                orientation={activeOrientation}
                disabled={isDisabled}
              >
                <Button>Left</Button>
                <Button>Center</Button>
                <Button>Right</Button>
              </ButtonGroup>
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
          <CodeBlock filename="src/ui/ButtonGroup.tsx" copyText={CODE_SNIPPET}>
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
          <CodeBlock filename="ButtonGroup.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Extends all native{" "}
            <code className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 text-xs font-mono text-primary">HTMLDivElement</code>
            {" "}attributes (id, aria-label, etc.).
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-sm text-left">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[200px]">
                      <code className="font-mono text-xs text-slate-600 dark:text-slate-400 wrap-break-word">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">{row.default}</code>
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
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
