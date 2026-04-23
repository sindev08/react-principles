"use client";

import { createContext, useContext, type ReactNode } from "react";
import { cn } from "@/shared/utils/cn";
import {
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  BarChart,
  LineChart,
  AreaChart,
  PieChart,
  type TooltipContentProps,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChartConfigItem {
  label: string;
  color: string;
}

export type ChartConfig = Record<string, ChartConfigItem>;

export interface ChartContainerProps {
  config: ChartConfig;
  children: ReactNode;
  className?: string;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ChartContext = createContext<ChartConfig>({});

function useChartConfig(): ChartConfig {
  return useContext(ChartContext);
}

// ─── Default Colors ───────────────────────────────────────────────────────────

export const CHART_COLORS = [
  "#4628F1",
  "#06B6D4",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
] as const;

// ─── ChartContainer ───────────────────────────────────────────────────────────

export function ChartContainer({
  config,
  children,
  className,
}: ChartContainerProps) {
  return (
    <ChartContext.Provider value={config}>
      <div className={cn("h-full w-full", className)}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
}

// ─── ChartTooltip ─────────────────────────────────────────────────────────────

export function ChartTooltipContent({
  active,
  payload,
  label,
}: TooltipContentProps) {
  const config = useChartConfig();

  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg dark:border-[#1f2937] dark:bg-[#0d1117]">
      <p className="mb-1 text-xs font-semibold text-slate-900 dark:text-white">
        {label}
      </p>
      {payload.map((entry, i) => {
        const key = String(entry.dataKey ?? i);
        const item = config[key];
        const color = item?.color ?? CHART_COLORS[i % CHART_COLORS.length];
        const entryLabel = item?.label ?? key;

        return (
          <div key={key} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {entryLabel}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-900 dark:text-white">
              {typeof entry.value === "number"
                ? entry.value.toLocaleString()
                : String(entry.value ?? "")}
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
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-slate-600 dark:text-slate-400">
              {entryLabel}
            </span>
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

export { BarChart, LineChart, AreaChart, PieChart };
