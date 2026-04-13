import type { RecipeDetail } from "../types";

export const dataVisualization: RecipeDetail = {
  slug: "data-visualization",
  title: "Data Visualization",
  breadcrumbCategory: "Data Viz",
  description:
    "Composable chart components using Recharts with responsive containers, custom tooltips, and clean data transformation patterns.",
  principle: {
    text: "Charts are pure functions of data. Keep transformation logic outside components — map raw API responses to the exact shape your chart library expects before they reach the JSX. This keeps components declarative and makes the data pipeline independently testable.",
    tip: "Always wrap charts in a ResponsiveContainer from Recharts. Hard-coded pixel widths break on resize and cause layout shifts on mobile.",
  },
  rules: [
    { title: "Transform Before Render", description: "Derive chart-ready data with useMemo. Never transform inside JSX or inside the chart component itself." },
    { title: "ResponsiveContainer Always", description: "Every chart must be wrapped in <ResponsiveContainer width='100%' height={300}>. Never pass fixed pixel widths." },
    { title: "Custom Tooltip Component", description: "Build a typed CustomTooltip component instead of using Recharts' default. Gives full styling control and type safety." },
    { title: "Skeleton on Loading", description: "Show a pulse skeleton at the same dimensions as the chart. Avoid layout shift when data loads." },
  ],
  pattern: {
    filename: "hooks/useChartData.ts",
    code: `import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

type ChartPoint = { month: string; revenue: number; orders: number };

export function useRevenueChart(range: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['metrics', 'revenue', range],
    queryFn: () => fetchRevenue(range),
    staleTime: 1000 * 60 * 5,
  });

  const chartData = useMemo<ChartPoint[]>(() => {
    if (!data) return [];
    return data.map((d) => ({
      month: formatMonth(d.date),
      revenue: d.total_revenue,
      orders: d.order_count,
    }));
  }, [data]);

  return { chartData, isLoading, isError };
}`,
  },
  implementation: {
    nextjs: {
      description:
        "In Next.js App Router, import Recharts components only inside Client Components. Use dynamic import with ssr: false to prevent hydration mismatches from window-dependent chart code.",
      filename: "components/charts/RevenueChart.tsx",
      code: `'use client';

import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useRevenueChart } from '@/hooks/useChartData';

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border bg-white p-3 shadow-lg text-sm">
      <p className="font-semibold text-slate-900">{label}</p>
      <p className="text-primary">\${payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
}

export function RevenueChart({ range }: { range: string }) {
  const { chartData, isLoading } = useRevenueChart(range);

  if (isLoading) return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="revenue" stroke="#4628F1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}`,
    },
    vite: {
      description:
        "In Vite, Recharts works out of the box with no SSR concerns. The same pattern applies — transform data with useMemo, wrap in ResponsiveContainer.",
      filename: "components/charts/RevenueChart.tsx",
      code: `import {
  ResponsiveContainer, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { useRevenueChart } from '@/hooks/useChartData';

export function RevenueChart({ range }: { range: string }) {
  const { chartData, isLoading } = useRevenueChart(range);

  if (isLoading) return <div className="h-[300px] animate-pulse rounded-xl bg-slate-100" />;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Line type="monotone" dataKey="revenue" stroke="#4628F1" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
};
