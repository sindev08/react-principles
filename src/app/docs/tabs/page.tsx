"use client";

import { useState } from "react";
import { DocsPageLayout } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Tabs } from "@/ui/Tabs";
import { Badge } from "@/ui/Badge";
import type { TabsVariant } from "@/ui/Tabs";

// ─── Constants ────────────────────────────────────────────────────────────────

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const VARIANTS: TabsVariant[] = ["underline", "pills"];

const CODE_SNIPPET = `import { Tabs } from "@/ui/Tabs";

// Uncontrolled
<Tabs.Root defaultValue="overview">
  <Tabs.List>
    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
    <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
    <Tabs.Trigger value="disabled" disabled>Disabled</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="overview">Overview content</Tabs.Content>
  <Tabs.Content value="activity">Activity content</Tabs.Content>
  <Tabs.Content value="settings">Settings content</Tabs.Content>
</Tabs.Root>

// Controlled
<Tabs.Root value={activeTab} onChange={setActiveTab}>
  ...
</Tabs.Root>

// Variants: "underline" (default) | "pills"
<Tabs.Root defaultValue="tab1" variant="pills">
  ...
</Tabs.Root>`;

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

export type TabsVariant = "underline" | "pills";

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  variant?: TabsVariant;
  children: ReactNode;
  className?: string;
}

interface TabsContextValue {
  active: string;
  setActive: (value: string) => void;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new Error("Tabs sub-components must be used inside <Tabs.Root>");
  return context;
}

function TabsRoot({
  value,
  defaultValue = "",
  onChange,
  variant = "underline",
  children,
  className,
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const isControlled = value !== undefined;
  const active = isControlled ? value : internalValue;

  const setActive = (next: string) => {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ active, setActive, variant }}>
      <div className={cn("w-full", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  const { variant } = useTabsContext();
  return (
    <div
      role="tablist"
      className={cn(
        "flex",
        variant === "underline" && "gap-0 border-b border-slate-200",
        variant === "pills" && "w-fit gap-1 rounded-xl bg-slate-100 p-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function TabsTrigger({
  value,
  className,
  children,
  disabled,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value"> & { value: string }) {
  const { active, setActive, variant } = useTabsContext();
  const isActive = active === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => setActive(value)}
      className={cn(
        "rounded-sm text-sm font-medium transition-all outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500/40",
        disabled && "pointer-events-none cursor-not-allowed opacity-40",
        variant === "underline" && [
          "-mb-px border-b-2 px-4 py-2.5",
          isActive ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800",
        ],
        variant === "pills" && [
          "rounded-lg px-4 py-1.5",
          isActive ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-700",
        ],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({
  value,
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { active } = useTabsContext();
  if (active !== value) return null;

  return (
    <div role="tabpanel" className={cn("mt-4", className)} {...props}>
      {children}
    </div>
  );
}

type TabsCompound = typeof TabsRoot & {
  Root: typeof TabsRoot;
  List: typeof TabsList;
  Trigger: typeof TabsTrigger;
  Content: typeof TabsContent;
};

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
}) as TabsCompound;`;

const PROPS_ROWS = [
  { component: "Tabs.Root", prop: "defaultValue", type: "string", default: '""', description: "Initially active tab (uncontrolled)." },
  { component: "Tabs.Root", prop: "value", type: "string", default: "—", description: "Controlled active tab value." },
  { component: "Tabs.Root", prop: "onChange", type: "(value: string) => void", default: "—", description: "Callback fired when the active tab changes." },
  { component: "Tabs.Root", prop: "variant", type: '"underline" | "pills"', default: '"underline"', description: "Visual style for the tab list." },
  { component: "Tabs.Trigger", prop: "value", type: "string", default: "—", description: "Unique identifier for this tab." },
  { component: "Tabs.Trigger", prop: "disabled", type: "boolean", default: "false", description: "Prevents selection and reduces opacity." },
  { component: "Tabs.Content", prop: "value", type: "string", default: "—", description: "Renders only when this matches the active tab." },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

type ForcedTheme = {
  wrapBg: string;
  panelBg: string;
  panelBorder: string;
  borderBottom: string;
  activeTab: string;
  activeTabUnderline: string;
  inactiveTab: string;
  contentTitle: string;
  contentText: string;
  pillsListBg: string;
  pillsActive: string;
  pillsInactive: string;
};

const FORCED: Record<"light" | "dark", ForcedTheme> = {
  light: {
    wrapBg: "bg-slate-100",
    panelBg: "bg-white",
    panelBorder: "border border-slate-200",
    borderBottom: "border-b border-slate-200",
    activeTab: "text-[#4628F1] border-b-2 border-[#4628F1]",
    activeTabUnderline: "border-[#4628F1]",
    inactiveTab: "text-slate-500 border-b-2 border-transparent",
    contentTitle: "text-slate-900",
    contentText: "text-slate-500",
    pillsListBg: "bg-slate-100",
    pillsActive: "bg-white text-slate-900 shadow-xs",
    pillsInactive: "text-slate-500",
  },
  dark: {
    wrapBg: "bg-[#0d1117]",
    panelBg: "bg-[#161b22]",
    panelBorder: "border border-[#1f2937]",
    borderBottom: "border-b border-[#1f2937]",
    activeTab: "text-[#4628F1] border-b-2 border-[#4628F1]",
    activeTabUnderline: "border-[#4628F1]",
    inactiveTab: "text-slate-500 border-b-2 border-transparent",
    contentTitle: "text-white",
    contentText: "text-slate-400",
    pillsListBg: "bg-[#161b22]",
    pillsActive: "bg-[#0d1117] text-white shadow-xs",
    pillsInactive: "text-slate-500",
  },
};

function ThemedTabsPreview({ theme }: { theme: "light" | "dark" }) {
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
      <div className={`${c.wrapBg} rounded-xl p-6 space-y-6`}>
        {/* Underline variant */}
        <div className={`${c.panelBg} ${c.panelBorder} rounded-xl p-4`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${c.contentText}`}>Underline</p>
          <div className={`flex ${c.borderBottom}`}>
            {["Overview", "Activity", "Settings"].map((tab, i) => (
              <div key={tab} className={`px-4 py-2 text-sm font-medium ${i === 0 ? c.activeTab : c.inactiveTab}`}>
                {tab}
              </div>
            ))}
          </div>
          <div className="pt-4">
            <p className={`text-sm font-semibold ${c.contentTitle}`}>Overview</p>
            <p className={`text-xs mt-1 ${c.contentText}`}>Project summary and key metrics.</p>
          </div>
        </div>

        {/* Pills variant */}
        <div className={`${c.panelBg} ${c.panelBorder} rounded-xl p-4`}>
          <p className={`text-[10px] font-semibold uppercase tracking-wide mb-3 ${c.contentText}`}>Pills</p>
          <div className={`flex gap-1 p-1 rounded-xl w-fit ${c.pillsListBg}`}>
            {["Overview", "Activity", "Settings"].map((tab, i) => (
              <div key={tab} className={`px-4 py-1.5 text-sm font-medium rounded-lg ${i === 0 ? c.pillsActive : c.pillsInactive}`}>
                {tab}
              </div>
            ))}
          </div>
          <div className="pt-4">
            <p className={`text-sm font-semibold ${c.contentTitle}`}>Overview</p>
            <p className={`text-xs mt-1 ${c.contentText}`}>Project summary and key metrics.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Demo content ─────────────────────────────────────────────────────────────

const ACTIVITY_ITEMS = [
  { action: "Pushed 3 commits", repo: "react-principles", time: "2h ago", type: "commit" },
  { action: "Opened pull request #42", repo: "react-principles", time: "5h ago", type: "pr" },
  { action: "Closed issue #38", repo: "react-principles", time: "1d ago", type: "issue" },
  { action: "Pushed 1 commit", repo: "design-system", time: "2d ago", type: "commit" },
];

const METRICS = [
  { label: "Commits", value: "248", change: "+12 this week" },
  { label: "Pull requests", value: "34", change: "6 open" },
  { label: "Issues", value: "18", change: "3 open" },
  { label: "Contributors", value: "7", change: "+2 this month" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TabsDocPage() {
  const [activeVariant, setActiveVariant] = useState<TabsVariant>("underline");
  const [settingsTab, setSettingsTab] = useState("profile");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Navigation</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Tabs</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Tabs
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A context-driven tab set. Supports controlled and uncontrolled modes,
            disabled tabs, and two visual variants.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Controlled", "Uncontrolled", "2 Variants", "Compound"].map((tag) => (
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
            Both variants — underline and pills — rendered with forced light and dark styling.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemedTabsPreview theme="light" />
            <ThemedTabsPreview theme="dark" />
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
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs space-y-8">

            {/* Variant selector */}
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

            {/* Repository tabs */}
            <Tabs.Root defaultValue="overview" variant={activeVariant}>
              <Tabs.List>
                <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                <Tabs.Trigger value="activity">
                  Activity <Badge variant="default" size="sm" className="ml-1.5">{ACTIVITY_ITEMS.length}</Badge>
                </Tabs.Trigger>
                <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                <Tabs.Trigger value="disabled" disabled>Archived</Tabs.Trigger>
              </Tabs.List>

              <Tabs.Content value="overview">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {METRICS.map((m) => (
                    <div key={m.label} className="rounded-xl border border-slate-100 dark:border-[#1f2937] p-4">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{m.value}</p>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{m.label}</p>
                      <p className="text-xs text-primary mt-2">{m.change}</p>
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="activity">
                <div className="divide-y divide-slate-100 dark:divide-[#1f2937]">
                  {ACTIVITY_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-start gap-3 py-3">
                      <div className="mt-0.5 h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none">
                          {item.type === "commit" ? (
                            <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
                          ) : item.type === "pr" ? (
                            <path d="M4 3v7m0 0a2 2 0 1 0 0 3 2 2 0 0 0 0-3zm8-7a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm0 4v4a2 2 0 1 1-4 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                          ) : (
                            <circle cx="8" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                          )}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">{item.action}</p>
                        <p className="text-xs text-slate-400">{item.repo}</p>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{item.time}</span>
                    </div>
                  ))}
                </div>
              </Tabs.Content>

              <Tabs.Content value="settings">
                {/* Nested controlled tabs */}
                <Tabs.Root value={settingsTab} onChange={setSettingsTab} variant="pills">
                  <Tabs.List>
                    <Tabs.Trigger value="profile">Profile</Tabs.Trigger>
                    <Tabs.Trigger value="security">Security</Tabs.Trigger>
                    <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="profile">
                    <div className="space-y-3 py-2">
                      {[
                        { label: "Display name", value: "John Doe" },
                        { label: "Username", value: "@johndoe" },
                        { label: "Email", value: "you@example.com" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b border-slate-100 dark:border-[#1f2937]">
                          <span className="text-sm text-slate-500">{label}</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Tabs.Content>
                  <Tabs.Content value="security">
                    <div className="space-y-3 py-2">
                      {[
                        { label: "Two-factor auth", value: "Enabled" },
                        { label: "Last password change", value: "3 months ago" },
                        { label: "Active sessions", value: "2 devices" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b border-slate-100 dark:border-[#1f2937]">
                          <span className="text-sm text-slate-500">{label}</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Tabs.Content>
                  <Tabs.Content value="billing">
                    <div className="space-y-3 py-2">
                      {[
                        { label: "Plan", value: "Pro" },
                        { label: "Next billing", value: "Mar 1, 2026" },
                        { label: "Payment method", value: "•••• 4242" },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex justify-between py-2 border-b border-slate-100 dark:border-[#1f2937]">
                          <span className="text-sm text-slate-500">{label}</span>
                          <span className="text-sm font-medium text-slate-900 dark:text-white">{value}</span>
                        </div>
                      ))}
                    </div>
                  </Tabs.Content>
                </Tabs.Root>
              </Tabs.Content>
            </Tabs.Root>
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
          <CodeBlock filename="src/ui/Tabs.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Flat exports seperti <code>TabsList</code>, <code>TabsTrigger</code>, dan
            <code>TabsContent</code> tetap didukung untuk migrasi bertahap.
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
            Snippet ini self-contained dan bisa langsung dipakai di project React/Next lain tanpa util tambahan.
          </p>
          <CodeBlock filename="Tabs.tsx" copyText={COPY_PASTE_SNIPPET}>
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
