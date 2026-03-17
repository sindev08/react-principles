"use client";

import { SectionHeading } from "../SectionHeading";
import { UserList } from "@/features/examples/components/UserList";
import { UserForm } from "@/features/examples/components/UserForm";
import { UserTable } from "@/features/examples/components/UserTable";
import { useAppStore } from "@/shared/stores/useAppStore";
import { useFilterStore } from "@/shared/stores/useFilterStore";
import type { DemoKey } from "../../data/detail-data";

interface SectionLiveDemoProps {
  number: number;
  demoKey: DemoKey;
}

export function SectionLiveDemo({ number, demoKey }: SectionLiveDemoProps) {
  return (
    <section className="mb-16" id="demo">
      <SectionHeading number={number} title="Live Demo" />
      <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
        <LiveDemo demoKey={demoKey} />
      </div>
    </section>
  );
}

function LiveDemo({ demoKey }: { demoKey: DemoKey }) {
  if (demoKey === "react-query") return <UserList />;
  if (demoKey === "zustand") return <ZustandDemo />;
  if (demoKey === "forms") return <UserForm />;
  if (demoKey === "table") return <UserTable />;
  return null;
}

function ZustandDemo() {
  const { theme, toggleTheme } = useAppStore();
  const { search, role, status, setSearch, setRole, setStatus, reset } = useFilterStore();

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">App Store</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Theme</span>
            <span className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-2 py-0.5 text-xs font-mono text-slate-700 dark:text-slate-300">
              {theme}
            </span>
          </div>
          <button
            onClick={toggleTheme}
            className="w-full rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
          >
            Toggle Theme
          </button>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] p-5">
        <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Filter Store</h3>
        <div className="space-y-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          />
          <select
            value={role ?? ""}
            onChange={(e) =>
              setRole((e.target.value || null) as "admin" | "editor" | "viewer" | null)
            }
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          >
            <option value="">All roles</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer</option>
          </select>
          <select
            value={status ?? ""}
            onChange={(e) =>
              setStatus((e.target.value || null) as "active" | "inactive" | null)
            }
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#0d1117] px-3 py-2 text-sm focus:outline-hidden focus:ring-2 focus:ring-primary/40"
          >
            <option value="">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={reset}
            className="w-full rounded-lg border border-slate-200 dark:border-[#1f2937] px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
}
