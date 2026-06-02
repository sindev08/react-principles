"use client";

import { useState, type ReactNode } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import {
  ChartContainer,
  ChartTooltip,
  ChartLegend,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
} from "@/ui/Chart";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  Line,
  Area,
  Pie,
} from "recharts";
import { cn } from "@/shared/utils/cn";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF =
  "https://storybook.reactprinciples.dev/?path=/story/ui-chart--bar-chart-story";

const CHART_TYPES = ["Bar", "Line", "Area", "Pie"] as const;

const BAR_DATA = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 278 },
  { month: "Apr", revenue: 2780, orders: 189 },
  { month: "May", revenue: 1890, orders: 148 },
  { month: "Jun", revenue: 2390, orders: 210 },
];

const LINE_DATA = [
  { month: "Jan", users: 400, sessions: 2400 },
  { month: "Feb", users: 300, sessions: 1800 },
  { month: "Mar", users: 520, sessions: 3100 },
  { month: "Apr", users: 780, sessions: 4600 },
  { month: "May", users: 690, sessions: 4100 },
  { month: "Jun", users: 820, sessions: 5200 },
];

const PIE_DATA = [
  { name: "Chrome", value: 400 },
  { name: "Firefox", value: 300 },
  { name: "Safari", value: 200 },
  { name: "Edge", value: 100 },
];

const chartConfig = {
  revenue: { label: "Revenue", color: "#4628F1" },
  orders: { label: "Orders", color: "#06B6D4" },
  users: { label: "Users", color: "#22C55E" },
  sessions: { label: "Sessions", color: "#F59E0B" },
  Chrome: { label: "Chrome", color: "#4628F1" },
  Firefox: { label: "Firefox", color: "#06B6D4" },
  Safari: { label: "Safari", color: "#22C55E" },
  Edge: { label: "Edge", color: "#F59E0B" },
};

function AxisProps() {
  return {
    tick: { fontSize: 12 },
    axisLine: false,
    tickLine: false,
  };
}

const CODE_SNIPPET = `import {
  ChartContainer, ChartTooltip, ChartLegend,
  BarChart, LineChart, AreaChart, PieChart,
} from "@/ui/Chart";
import { CartesianGrid, XAxis, YAxis, Bar, Line, Area, Pie } from "recharts";

const config = {
  revenue: { label: "Revenue", color: "#4628F1" },
  orders: { label: "Orders", color: "#06B6D4" },
};

const data = [
  { month: "Jan", revenue: 4000, orders: 240 },
  { month: "Feb", revenue: 3000, orders: 198 },
  { month: "Mar", revenue: 5000, orders: 278 },
];

<ChartContainer config={config}>
  <BarChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
    <YAxis tick={{ fontSize: 12 }} />
    <ChartTooltip />
    <ChartLegend />
    <Bar dataKey="revenue" fill="#4628F1" radius={[4]} />
  </BarChart>
</ChartContainer>

// Line Chart
<ChartContainer config={config}>
  <LineChart data={data}>
    <Line type="monotone" dataKey="revenue" stroke="#4628F1" strokeWidth={2} />
  </LineChart>
</ChartContainer>

// Pie Chart
<ChartContainer config={config}>
  <PieChart>
    <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={120} />
  </PieChart>
</ChartContainer>`;

const COPY_PASTE_SNIPPET = `"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  ResponsiveContainer, Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart, LineChart, AreaChart, PieChart,
  type TooltipContentProps,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartConfigItem { label: string; color: string; }
export type ChartConfig = Record<string, ChartConfigItem>;

export interface ChartContainerProps {
  config: ChartConfig;
  children: ReactNode;
  className?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChartContext = createContext<ChartConfig>({});
function useChartConfig() { return useContext(ChartContext); }

export const CHART_COLORS = ["#4628F1", "#06B6D4", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"] as const;

// ─── ChartContainer ───────────────────────────────────────────────────────────

export function ChartContainer({ config, children, className }: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div className={cn("h-full w-full", className)}>
        <ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ─── ChartTooltip ─────────────────────────────────────────────────────────────

export function ChartTooltipContent({ active, payload, label }: TooltipContentProps) {
  const config = useChartConfig();

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-[#1f2937] dark:bg-[#0d1117]">
      <p className="mb-1 text-xs font-semibold text-slate-900 dark:text-white">{label}</p>
      {payload.map((entry, i) => {
        const key = String(entry.dataKey ?? i);
        const item = config[key];
        const color = item?.color ?? CHART_COLORS[i % CHART_COLORS.length];
        const entryLabel = item?.label ?? key;
        return (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-600 dark:text-slate-400">{entryLabel}</span>
            </div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {typeof entry.value === "number" ? entry.value.toLocaleString() : String(entry.value ?? "")}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ChartTooltip() {
  return <RechartsTooltip content={ChartTooltipContent} cursor={false} />;
}

// ─── ChartLegend ───────────────────────────────────────────────────────────────

export function ChartLegendContent({
  payload,
}: {
  payload?: ReadonlyArray<{
    value?: string;
    color?: string;
    dataKey?: unknown;
  }>;
}) {
  const config = useChartConfig();

  if (!payload?.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
      {payload.map((entry, i) => {
        const key = String(entry.value ?? i);
        const item = config[key];
        const color = item?.color ?? entry.color ?? CHART_COLORS[i % CHART_COLORS.length];
        const entryLabel = item?.label ?? entry.value ?? key;
        return (
          <div key={key} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-600 dark:text-slate-400">{entryLabel}</span>
          </div>
        );
      })}
    </div>
  );
}

export function ChartLegend() {
  return <RechartsLegend content={<ChartLegendContent />} />;
}

// ─── Re-exports ────────────────────────────────────────────────────────────────

export { BarChart, LineChart, AreaChart, PieChart };`;

const PROPS_ROWS = [
  { prop: "config", type: "ChartConfig", required: true, default: "—", description: "Mapping of data keys to label and color for tooltip and legend." },
  { prop: "children", type: "ReactNode", required: true, default: "—", description: "Recharts chart component (BarChart, LineChart, etc.)." },
  { prop: "className", type: "string", required: false, default: "—", description: "Additional classes merged into the root wrapper." },
];

// ─── Shared demo helpers ───────────────────────────────────────────────────────

function BarChartDemo() {
  return (
    <BarChart data={BAR_DATA}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="month" {...AxisProps()} />
      <YAxis {...AxisProps()} />
      <ChartTooltip />
      <ChartLegend />
      <Bar dataKey="revenue" fill="#4628F1" radius={4} />
      <Bar dataKey="orders" fill="#06B6D4" radius={4} />
    </BarChart>
  );
}

function LineChartDemo() {
  return (
    <LineChart data={LINE_DATA}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="month" {...AxisProps()} />
      <YAxis {...AxisProps()} />
      <ChartTooltip />
      <ChartLegend />
      <Line type="monotone" dataKey="users" stroke="#22C55E" strokeWidth={2} dot={false} />
      <Line type="monotone" dataKey="sessions" stroke="#F59E0B" strokeWidth={2} dot={false} />
    </LineChart>
  );
}

function AreaChartDemo() {
  return (
    <AreaChart data={LINE_DATA}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
      <XAxis dataKey="month" {...AxisProps()} />
      <YAxis {...AxisProps()} />
      <ChartTooltip />
      <ChartLegend />
      <Area type="monotone" dataKey="users" fill="#22C55E" fillOpacity={0.2} stroke="#22C55E" strokeWidth={2} />
      <Area type="monotone" dataKey="sessions" fill="#F59E0B" fillOpacity={0.2} stroke="#F59E0B" strokeWidth={2} />
    </AreaChart>
  );
}

function PieChartDemo() {
  return (
    <PieChart>
      <ChartTooltip />
      <ChartLegend />
      <Pie
        data={PIE_DATA}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={120}
        paddingAngle={2}
        dataKey="value"
      />
    </PieChart>
  );
}

const CHART_COMPONENTS: Record<string, () => ReactNode> = {
  Bar: BarChartDemo,
  Line: LineChartDemo,
  Area: AreaChartDemo,
  Pie: PieChartDemo,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ChartDocPage() {
  const [activeType, setActiveType] = useState<string>("Bar");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="cursor-pointer transition-colors hover:text-primary">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="cursor-pointer transition-colors hover:text-primary">Data Display</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Chart</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Chart
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Chart primitives built on Recharts with consistent theming, responsive containers,
            styled tooltips, and legends. Supports Bar, Line, Area, and Pie chart types.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Responsive", "Dark Mode", "4 Chart Types", "Recharts"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="chart" />

        {/* 01 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Live Demo</h2>
          </div>
          <a
            href={STORYBOOK_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-fade-in mb-4 flex w-full items-center gap-3 rounded-lg border border-[#FF4785]/20 bg-[#FF4785]/5 px-4 py-3 transition-opacity hover:opacity-80"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]" />
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">
              Explore all variants and interactive states in Storybook.
            </p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                Chart Type
              </span>
              <div className="flex gap-2">
                {CHART_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={cn(
                      "rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                      activeType === type
                        ? "bg-primary text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2937] dark:text-slate-400 dark:hover:bg-[#2d3748]",
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[350px]">
              <ChartContainer config={chartConfig}>
                {CHART_COMPONENTS[activeType]?.()}
              </ChartContainer>
            </div>
          </div>
        </section>

        {/* 02 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Chart.tsx" copyText={CODE_SNIPPET}>
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 03 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Chart.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-[#1f2937] dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Default", "Description"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white dark:divide-[#1f2937] dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr
                    key={row.prop}
                    className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]"
                  >
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="max-w-[240px] px-4 py-3">
                      <code className="wrap-break-word font-mono text-xs text-slate-600 dark:text-slate-400">{row.type}</code>
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
