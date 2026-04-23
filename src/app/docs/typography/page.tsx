"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Typography } from "@/ui/Typography";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-typography--default";

const CODE_SNIPPET = `import { Typography } from "@/ui/Typography";

// Headings
<Typography variant="h1">Page Title</Typography>
<Typography variant="h2">Section Title</Typography>
<Typography variant="h3">Subsection Title</Typography>

// Body text
<Typography variant="p">Body text paragraph.</Typography>
<Typography variant="lead">Large introductory paragraph.</Typography>
<Typography variant="muted">Secondary subdued text.</Typography>

// Block elements
<Typography variant="blockquote">"Quote text here"</Typography>
<Typography variant="list">
  <li>First item</li>
  <li>Second item</li>
</Typography>

// Inline code
<Typography variant="code">const foo = "bar";</Typography>`;

const COPY_PASTE_SNIPPET = `import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TypographyVariant =
  | "h1" | "h2" | "h3" | "h4"
  | "p" | "lead" | "muted" | "small"
  | "blockquote" | "code" | "list";

export interface TypographyProps extends Omit<HTMLAttributes<HTMLElement>, "as"> {
  variant?: TypographyVariant;
  as?: React.ElementType;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const VARIANT_STYLES: Record<TypographyVariant, string> = {
  h1: "text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl",
  h2: "text-2xl font-bold text-slate-900 dark:text-white",
  h3: "text-xl font-bold text-slate-900 dark:text-white",
  h4: "text-lg font-semibold text-slate-900 dark:text-white",
  p: "text-sm leading-relaxed text-slate-600 dark:text-slate-400",
  lead: "text-lg leading-relaxed text-slate-700 dark:text-slate-300",
  muted: "text-sm text-slate-500 dark:text-slate-400",
  small: "text-xs text-slate-500 dark:text-slate-400",
  blockquote: "border-l-4 border-primary pl-4 italic text-slate-700 dark:text-slate-300",
  code: "font-mono text-xs bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 rounded text-slate-900 dark:text-white",
  list: "list-disc pl-4 space-y-1 text-sm text-slate-600 dark:text-slate-400",
};

const DEFAULT_ELEMENTS: Record<TypographyVariant, string> = {
  h1: "h1", h2: "h2", h3: "h3", h4: "h4",
  p: "p", lead: "p", muted: "p", small: "small",
  blockquote: "blockquote", code: "code", list: "ul",
};

// ─── Component ────────────────────────────────────────────────────────────────

export const Typography = forwardRef<HTMLElement, TypographyProps>(
  function TypographyRoot({ variant = "p", as, className, children, ...rest }, ref) {
    const Component = as || DEFAULT_ELEMENTS[variant];
    const variantStyle = VARIANT_STYLES[variant];

    return (
      <Component ref={ref} className={cn(variantStyle, className)} {...rest}>
        {children}
      </Component>
    );
  }
);`;

const PROPS_ROWS = [
  { prop: "variant", type: "TypographyVariant", default: '"p"', description: "Typography style to apply (h1, h2, h3, h4, p, lead, muted, small, blockquote, code, list)." },
  { prop: "as", type: "React.ElementType", default: "—", description: "Override the default HTML element. Example: variant='h2' as='h1' renders h1 with h2 styling." },
  { prop: "className", type: "string", default: "—", description: "Additional CSS classes to apply (merged with variant styles)." },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TypographyDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 text-sm font-medium text-slate-500">
          <span className="transition-colors cursor-pointer hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="transition-colors cursor-pointer hover:text-primary">Typography</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Typography</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <Typography variant="h1" className="mb-4">Typography</Typography>
          <Typography variant="lead">
            Semantic text elements with consistent styling. Provides unified typography system for
            headings, body text, blockquotes, lists, and inline code.
          </Typography>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Semantic", "11 Variants", "Flexible"].map((tag) => (
              <span key={tag} className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="typography" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <Typography variant="h2">Live Demo</Typography>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <Typography variant="muted" className="flex-1">
              Explore all variants and interactive states in Storybook.
            </Typography>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>

          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-6">
            <div className="space-y-4">
              <Typography variant="h1">Heading 1 - Page Title</Typography>
              <Typography variant="h2">Heading 2 - Section Title</Typography>
              <Typography variant="h3">Heading 3 - Subsection Title</Typography>
              <Typography variant="h4">Heading 4 - Component Title</Typography>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div className="space-y-4">
              <Typography variant="p">
                This is body text. It uses a comfortable reading size with proper line height for
                long-form content. The text color provides good contrast in both light and dark modes.
              </Typography>

              <Typography variant="lead">
                This is a lead paragraph. It's larger than body text and perfect for introductory
                content or opening statements.
              </Typography>

              <Typography variant="muted">
                This is muted text. It's styled with a lighter color for secondary information.
              </Typography>

              <Typography variant="small">
                This is small text. Use it for fine print, legal disclaimers, or copyright notices.
              </Typography>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <div className="space-y-4">
              <Typography variant="blockquote">
                "Good typography is invisible—it lets the content shine without drawing attention to itself."
              </Typography>

              <Typography variant="list">
                <li>Semantic HTML elements by default</li>
                <li>Consistent sizing and spacing</li>
                <li>Dark mode support out of the box</li>
              </Typography>
            </div>

            <hr className="border-slate-200 dark:border-[#1f2937]" />

            <Typography variant="p">
              You can use inline code like <Typography variant="code">Typography</Typography> within
              body text to highlight technical terms.
            </Typography>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <Typography variant="h2">Code Snippet</Typography>
          </div>
          <CodeBlock filename="src/ui/Typography.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <Typography variant="h2">Copy-Paste (Single File)</Typography>
          </div>
          <CodeBlock filename="Typography.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <Typography variant="h2">Props</Typography>
          </div>
          <Typography variant="muted" className="mb-4">
            Extends all native HTML element attributes. The rendered element can be customized with the
            `as` prop.
          </Typography>
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
                    <td className="px-4 py-3 max-w-[180px]">
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
