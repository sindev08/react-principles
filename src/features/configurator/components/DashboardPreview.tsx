"use client";

import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Input } from "@/ui/Input";
import { Badge } from "@/ui/Badge";
import { useWizardStore } from "../stores/useWizardStore";

const TABLE_ROWS = [
  { name: "Ava Thompson", email: "ava@example.com", status: "Active", date: "May 1" },
  { name: "Noah Chen", email: "noah@example.com", status: "Pending", date: "Apr 29" },
  { name: "Mia Rossi", email: "mia@example.com", status: "Active", date: "Apr 28" },
  { name: "Leo Martins", email: "leo@example.com", status: "Paused", date: "Apr 27" },
  { name: "Sara Kim", email: "sara@example.com", status: "Active", date: "Apr 25" },
];

const STATS = [
  { label: "Total Users", value: "24.8k", trend: "+12%" },
  { label: "Revenue", value: "$82.4k", trend: "+8%" },
  { label: "Orders", value: "1,284", trend: "+18%" },
  { label: "Conversion", value: "7.2%", trend: "+3%" },
];

export function DashboardPreview() {
  const { colors, style, components } = useWizardStore();

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Dashboard</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
            Studio Overview
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {capitalize(style)} preset with {components.length} selected components.
          </p>
        </div>
        <Button style={{ backgroundColor: colors.brand, borderColor: colors.brand }}>
          New Report
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
              </div>
              <Badge variant="success">{stat.trend}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
        <Card className="p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Trend</h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">A realistic chart surface without external data.</p>
            </div>
            <span className="rounded-full px-2.5 py-1 text-xs font-bold text-white" style={{ backgroundColor: colors.accent }}>
              Live
            </span>
          </div>
          <div className="relative h-56 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-[#1f2937] dark:bg-[#0d1117]">
            <div className="absolute inset-x-0 bottom-0 h-36 opacity-20" style={{ background: `linear-gradient(to top, ${colors.chart}, transparent)` }} />
            <svg viewBox="0 0 640 220" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path d="M0 166 C80 140 96 94 168 112 C248 132 272 44 344 68 C424 96 448 156 520 118 C584 84 608 54 640 72" fill="none" stroke={colors.chart} strokeWidth="5" />
              <path d="M0 196 C84 170 112 130 176 146 C256 164 272 88 344 104 C424 130 448 178 520 148 C584 118 608 88 640 104" fill="none" stroke={colors.brand} strokeDasharray="10 10" strokeWidth="3" opacity="0.7" />
            </svg>
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Quick Create</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Preview form density and focus states.</p>
          <div className="mt-4 space-y-3">
            <Input label="Project name" placeholder="acme-dashboard" />
            <Input label="Owner email" placeholder="team@example.com" />
            <Button className="w-full" style={{ backgroundColor: colors.brand, borderColor: colors.brand }}>
              Create Workspace
            </Button>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-slate-200 p-4 dark:border-[#1f2937]">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Customers</h3>
        </div>
        <div className="divide-y divide-slate-200 dark:divide-[#1f2937]">
          {TABLE_ROWS.map((row) => (
            <div key={row.email} className="grid grid-cols-[1fr_auto] gap-4 p-4 text-sm sm:grid-cols-[1fr_1fr_auto_auto]">
              <span className="font-semibold text-slate-900 dark:text-white">{row.name}</span>
              <span className="hidden text-slate-500 dark:text-slate-400 sm:block">{row.email}</span>
              <span className="text-slate-500 dark:text-slate-400">{row.date}</span>
              <Badge variant={row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "default"}>{row.status}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
