"use client";

import Link from "next/link";
import { DocsPageLayout } from "@/features/docs/components";
import { UserTable } from "@/features/examples/components/UserTable";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { mockUsers } from "@/lib/mock-data";
import type { User } from "@/shared/types/common";
import { Button } from "@/ui/Button";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Column Config", href: "#columns" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF = "https://storybook.reactprinciples.dev/?path=/story/ui-table--default";

const PREVIEW_ROWS: User[] = mockUsers.slice(0, 5);

const COLUMN_CONFIG_CODE = `const columns = useMemo<ColumnDef<User>[]>(() => [
  {
    accessorKey: "name",
    header: "Name",
    cell: (info) => (
      <span className="font-medium">{info.getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: (info) => (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs
        font-medium capitalize dark:bg-slate-800">
        {info.getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue<string>();
      return (
        <span className={\`rounded-full px-2.5 py-0.5 text-xs font-medium \${
          status === "active"
            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
            : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400"
        }\`}>
          {status}
        </span>
      );
    },
  },
], []);`;

const PROPS_ROWS = [
  { prop: "data", type: "T[]", required: true, description: "Array of row data to display in the table." },
  { prop: "columns", type: "ColumnDef<T>[]", required: true, description: "Column definitions including header, accessor, and optional cell renderer." },
  { prop: "pageSize", type: "number", required: false, description: "Number of rows shown per page. Defaults to 8." },
  { prop: "globalFilter", type: "string", required: false, description: "Text filter applied across all column values simultaneously." },
  { prop: "sorting", type: "SortingState", required: false, description: "Controlled sorting state. Pair with onSortingChange for external control." },
];

// ─── Themed mini-preview ─────────────────────────────────────────────────────

interface ThemedTablePreviewProps {
  theme: "light" | "dark";
}

function ThemedTablePreview({ theme }: ThemedTablePreviewProps) {
  const d = theme === "dark";

  const wrap = d ? "bg-[#0d1117] border-[#1f2937]" : "bg-white border-slate-200";
  const headBg = d ? "bg-[#161b22] border-[#1f2937]" : "bg-slate-50 border-slate-200";
  const headTxt = d ? "text-slate-400" : "text-slate-500";
  const divider = d ? "divide-[#1f2937]" : "divide-slate-100";
  const rowHover = d ? "hover:bg-[#161b22]" : "hover:bg-slate-50";
  const nameTxt = d ? "text-slate-200" : "text-slate-800";
  const emailTxt = d ? "text-slate-400" : "text-slate-500";
  const roleBadge = d ? "bg-[#1f2937] text-slate-300" : "bg-slate-100 text-slate-600";

  return (
    <div className={`overflow-x-auto rounded-xl border ${wrap}`}>
      <table className="w-full text-left text-sm">
        <thead className={`border-b ${headBg}`}>
          <tr>
            {["Name", "Email", "Role", "Status"].map((col) => (
              <th key={col} className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${headTxt}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={`divide-y ${divider}`}>
          {PREVIEW_ROWS.map((user) => (
            <tr key={user.id} className={`transition-colors ${rowHover}`}>
              <td className={`px-4 py-3 font-medium ${nameTxt}`}>{user.name}</td>
              <td className={`px-4 py-3 ${emailTxt}`}>{user.email}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${roleBadge}`}>
                  {user.role}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  user.status === "active"
                    ? d ? "bg-green-900/40 text-green-400" : "bg-green-100 text-green-700"
                    : d ? "bg-red-900/40 text-red-400" : "bg-red-100 text-red-700"
                }`}>
                  {user.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TableDocPage() {
  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="hover:text-primary cursor-pointer transition-colors">Components</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="hover:text-primary cursor-pointer transition-colors">Data Display</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-slate-900 dark:text-white">Table</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Table
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            Headless, sortable, filterable, and paginated data tables powered by TanStack
            Table v8. Full control over styling with zero opinion on markup.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["TanStack Table v8", "TypeScript", "Sortable", "Filterable", "Paginated"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
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
            The table adapts seamlessly to both themes via Tailwind&apos;s class-based dark mode.
            Each variant below is rendered with forced styling — independent of the current app
            theme — so you can compare them side by side.
          </p>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Light */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Light</span>
                <span className="ml-auto text-xs text-slate-400">bg-white · border-slate-200</span>
              </div>
              <ThemedTablePreview theme="light" />
            </div>

            {/* Dark */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Dark</span>
                <span className="ml-auto text-xs text-slate-400">bg-[#0d1117] · border-[#1f2937]</span>
              </div>
              <ThemedTablePreview theme="dark" />
            </div>
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
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
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF4785] opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#FF4785]"></span>
            </span>
            <p className="flex-1 text-xs text-slate-500 dark:text-slate-400">Explore all variants and interactive states in Storybook.</p>
            <span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#FF4785]">
              Open Storybook
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </span>
          </a>
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
            Fully interactive — try sorting columns, filtering rows, and navigating pages.
            The table responds to the current app theme automatically.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
            <UserTable />
          </div>
        </section>

        {/* 03 Column Config */}
        <section id="columns" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Column Config</h2>
          </div>
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
            Define columns with <code className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 text-xs font-mono text-primary">ColumnDef&lt;T&gt;</code>.
            Wrap in <code className="rounded-sm bg-slate-100 dark:bg-[#1f2937] px-1.5 py-0.5 text-xs font-mono text-primary">useMemo</code> to
            prevent re-instantiation on every render.
          </p>
          <CodeBlock filename="components/UserTable.tsx" copyText={COLUMN_CONFIG_CODE}>
            {COLUMN_CONFIG_CODE}
          </CodeBlock>
        </section>

        {/* 04 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Prop", "Type", "Required", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400">{row.type}</code>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        row.required
                          ? "bg-primary/10 text-primary"
                          : "bg-slate-100 dark:bg-[#1f2937] text-slate-500 dark:text-slate-400"
                      }`}>
                        {row.required ? "required" : "optional"}
                      </span>
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
