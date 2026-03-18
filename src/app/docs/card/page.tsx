"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Badge } from "@/ui/Badge";
import type { CardVariant } from "@/ui/Card";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const VARIANTS: CardVariant[] = ["default", "elevated", "flat"];

// Forced-theme card (no dark: prefix)
const FORCED = {
  light: {
    card: "bg-white border border-slate-200",
    title: "text-slate-900",
    desc: "text-slate-500",
    meta: "text-slate-400",
    divider: "border-slate-100",
    avatarBg: "bg-slate-100",
    avatarText: "text-slate-500",
    statVal: "text-slate-900",
    statLabel: "text-slate-500",
    trendUp: "text-green-600 bg-green-50",
    badgeRole: "bg-[#4628F1]/10 text-[#4628F1]",
    badgeActive: "bg-green-100 text-green-700",
    btn: "bg-[#4628F1] text-white",
    btnOutline: "border border-slate-300 text-slate-700",
  },
  dark: {
    card: "bg-[#161b22] border border-[#1f2937]",
    title: "text-white",
    desc: "text-slate-400",
    meta: "text-slate-500",
    divider: "border-[#1f2937]",
    avatarBg: "bg-[#1f2937]",
    avatarText: "text-slate-400",
    statVal: "text-white",
    statLabel: "text-slate-400",
    trendUp: "text-green-400 bg-green-900/30",
    badgeRole: "bg-[#4628F1]/20 text-[#7c6ef5]",
    badgeActive: "bg-green-900/40 text-green-400",
    btn: "bg-[#4628F1] text-white",
    btnOutline: "border border-slate-600 text-slate-300",
  },
};

const CODE_SNIPPET = `import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";

<Card variant="elevated">
  <Card.Header>
    <Card.Title>Account Settings</Card.Title>
    <Card.Description>
      Manage your profile and preferences.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <p className="text-sm text-slate-600 dark:text-slate-400">
      Your account was last updated 3 days ago.
    </p>
  </Card.Content>
  <Card.Footer>
    <Button size="sm">Save changes</Button>
    <Button variant="ghost" size="sm">Cancel</Button>
  </Card.Footer>
</Card>`;

const COPY_PASTE_SNIPPET = `import type { HTMLAttributes } from "react";
import { cn } from "@/shared/utils/cn";

export type CardVariant = "default" | "elevated" | "flat";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
}

const CARD_VARIANT_CLASSES: Record<CardVariant, string> = {
  default: "bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937]",
  elevated: "bg-white dark:bg-[#161b22] border border-slate-200 dark:border-[#1f2937] shadow-lg shadow-slate-200/60 dark:shadow-black/30",
  flat: "bg-slate-50 dark:bg-[#0d1117] border border-transparent",
};

export function Card({ variant = "default", className, children, ...props }: CardProps) {
  return (
    <div className={cn("rounded-xl", CARD_VARIANT_CLASSES[variant], className)} {...props}>
      {children}
    </div>
  );
}

Card.Header = function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

Card.Title = function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("text-base font-bold text-slate-900 dark:text-white leading-snug", className)} {...props}>
      {children}
    </h3>
  );
}

Card.Description = function CardDescription({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("mt-1 text-sm text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

Card.Content = function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

Card.Footer = function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 pb-6 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}`;

const PROPS_ROWS = [
  { component: "Card", prop: "variant", type: '"default" | "elevated" | "flat"', default: '"default"', description: "Visual style — border only, shadow, or flat background." },
  { component: "Card", prop: "className", type: "string", default: "—", description: "Additional CSS classes." },
  { component: "Card.Header", prop: "className", type: "string", default: "—", description: "Spacing wrapper for title + description." },
  { component: "Card.Title", prop: "className", type: "string", default: "—", description: "Renders as h3. Bold, dark text." },
  { component: "Card.Description", prop: "className", type: "string", default: "—", description: "Renders as p. Muted, secondary text." },
  { component: "Card.Content", prop: "className", type: "string", default: "—", description: "Main body area with horizontal padding." },
  { component: "Card.Footer", prop: "className", type: "string", default: "—", description: "Action row with flex + gap. Usually holds buttons." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

function ThemedCardPreview({ theme }: { theme: "light" | "dark" }) {
  const t = FORCED[theme];
  const bg = theme === "dark" ? "bg-[#0d1117]" : "bg-slate-50";

  return (
    <div className={`rounded-xl p-6 ${bg}`}>
      <div className={`rounded-xl ${t.card} overflow-hidden`}>
        {/* Header */}
        <div className="p-6 pb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className={`h-10 w-10 rounded-full ${t.avatarBg} flex items-center justify-center`}>
              <span className={`text-sm font-bold ${t.avatarText}`}>AJ</span>
            </div>
            <div>
              <p className={`text-sm font-bold ${t.title}`}>Alice Johnson</p>
              <p className={`text-xs ${t.meta}`}>alice@example.com</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className={`inline-flex items-center font-medium rounded-full text-xs px-2.5 py-0.5 ${t.badgeRole}`}>Admin</span>
            <span className={`inline-flex items-center font-medium rounded-full text-xs px-2.5 py-0.5 ${t.badgeActive}`}>Active</span>
          </div>
        </div>
        {/* Divider */}
        <div className={`mx-6 border-t ${t.divider}`} />
        {/* Footer */}
        <div className="p-6 pt-4 flex gap-2">
          <button className={`inline-flex items-center justify-center font-semibold rounded-lg text-xs px-3 py-1.5 h-7 ${t.btn}`}>Follow</button>
          <button className={`inline-flex items-center justify-center font-semibold rounded-lg text-xs px-3 py-1.5 h-7 ${t.btnOutline}`}>Message</button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CardDocPage() {
  const [activeVariant, setActiveVariant] = useState<CardVariant>("default");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Layout</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Card</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Card
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A flexible container for grouping related content. Uses a compound component
            pattern — compose Header, Content, and Footer independently for full layout control.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Compound Pattern", "Dark Mode", "3 Variants", "Composable"].map((tag) => (
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
            A profile card rendered with forced light and dark styling — independent of
            the current app theme.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
              </div>
              <ThemedCardPreview theme="light" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
              </div>
              <ThemedCardPreview theme="dark" />
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
            {/* Variant selector */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Variant</span>
              <div className="flex gap-2">
                {VARIANTS.map((v) => (
                  <button
                    key={v}
                    onClick={() => setActiveVariant(v)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all capitalize ${activeVariant === v
                        ? "bg-primary text-white"
                        : "bg-slate-100 dark:bg-[#1f2937] text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#2d3748]"
                      }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Cards grid */}
            <div className="grid gap-4 sm:grid-cols-3 bg-slate-50 dark:bg-[#0d1117] rounded-xl p-4">
              {/* Profile card */}
              <Card variant={activeVariant}>
                <Card.Header>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">AJ</span>
                    </div>
                    <div>
                      <Card.Title className="text-sm">Alice Johnson</Card.Title>
                      <p className="text-xs text-slate-400 dark:text-slate-500">alice@example.com</p>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Badge variant="info" size="sm">Admin</Badge>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                </Card.Header>
                <Card.Footer className="pt-2">
                  <Button size="sm" className="flex-1">Follow</Button>
                  <Button variant="outline" size="sm" className="flex-1">Message</Button>
                </Card.Footer>
              </Card>

              {/* Stats card */}
              <Card variant={activeVariant}>
                <Card.Content className="pt-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30">
                      <span className="material-symbols-outlined text-[18px] text-green-600 dark:text-green-400">trending_up</span>
                    </div>
                    <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                      +12.5%
                    </span>
                  </div>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">8,249</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Monthly visitors</p>
                </Card.Content>
              </Card>

              {/* Notification card */}
              <Card variant={activeVariant}>
                <Card.Header>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <span className="material-symbols-outlined text-[16px] text-primary">notifications</span>
                    </div>
                    <div>
                      <Card.Title className="text-sm">New comment</Card.Title>
                      <Card.Description className="text-xs">Bob left a reply on your post.</Card.Description>
                    </div>
                  </div>
                </Card.Header>
                <Card.Footer className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full text-xs">View thread</Button>
                </Card.Footer>
              </Card>
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
          <CodeBlock filename="src/ui/Card.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Flat exports seperti <code>CardHeader</code>, <code>CardContent</code>, dan
            lainnya tetap didukung untuk migrasi bertahap.
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
            Snippet ini self-contained dan bisa dipindahkan ke project lain tanpa setup alias atau util tambahan.
          </p>
          <CodeBlock filename="Card.tsx" copyText={COPY_PASTE_SNIPPET}>
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
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            All sub-components extend their corresponding HTML element attributes.
          </p>
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
                {PROPS_ROWS.map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">{row.component}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
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
