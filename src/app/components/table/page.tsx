"use client";

import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { UserTable } from "@/features/examples/components/UserTable";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Table } from "@/ui/Table";
import { mockUsers } from "@/lib/mock-data";
import type { User } from "@/shared/types/common";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Styled Primitives", href: "#primitives" },
  { label: "Live Demo", href: "#demo" },
  { label: "Column Config", href: "#columns" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
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

const PRIMITIVE_SNIPPET = `import { Table } from "@/ui/Table";

<Table>
  <Table.Caption>Invoice list</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Invoice</Table.Head>
      <Table.Head>Status</Table.Head>
      <Table.Head>Method</Table.Head>
      <Table.Head className="text-right">Amount</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell className="font-medium">INV001</Table.Cell>
      <Table.Cell>Paid</Table.Cell>
      <Table.Cell>Credit Card</Table.Cell>
      <Table.Cell className="text-right">$250.00</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell colSpan={3}>Total</Table.Cell>
      <Table.Cell className="text-right">$250.00</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table>`;

const COPY_PASTE_SNIPPET = `import {
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TableProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableFooterProps extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export interface TableHeadProps {
  children?: ReactNode;
  className?: string;
}

export interface TableCellProps {
  children?: ReactNode;
  className?: string;
}

export interface TableCaptionProps extends HTMLAttributes<HTMLTableCaptionElement> {
  children?: ReactNode;
}

// ─── Table ───────────────────────────────────────────────────────────────────

export function Table({ className, children, ...props }: TableProps) {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]",
        className,
      )}
      {...props}
    >
      <table className="w-full caption-top text-left text-sm">
        {children}
      </table>
    </div>
  );
}

Table.Header = function TableHeader({ className, children, ...props }: TableHeaderProps) {
  return (
    <thead
      className={cn(
        "border-b border-slate-200 bg-slate-50 dark:border-[#1f2937] dark:bg-[#161b22]",
        className,
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

Table.Body = function TableBody({ className, children, ...props }: TableBodyProps) {
  return (
    <tbody
      className={cn(
        "divide-y divide-slate-100 dark:divide-[#1f2937]",
        className,
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

Table.Footer = function TableFooter({ className, children, ...props }: TableFooterProps) {
  return (
    <tfoot
      className={cn(
        "border-t border-slate-200 bg-slate-50 font-medium dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-300",
        className,
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
};

Table.Row = function TableRow({ className, children, ...props }: TableRowProps) {
  return (
    <tr
      className={cn(
        "transition-colors border-b border-transparent last:border-b-0",
        "hover:bg-slate-50 dark:hover:bg-slate-800/50",
        className,
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

Table.Head = function TableHead({ className, children, ...props }: TableHeadProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
};

Table.Cell = function TableCell({ className, children, ...props }: TableCellProps) {
  return (
    <td className={cn("px-4 py-3", className)} {...props}>
      {children}
    </td>
  );
};

Table.Caption = function TableCaption({ className, children, ...props }: TableCaptionProps) {
  return (
    <caption className={cn("px-4 py-3 text-sm text-slate-500 dark:text-slate-400", className)} {...props}>
      {children}
    </caption>
  );
}`;

const PRIMITIVE_PROPS_ROWS = [
  { prop: "Table", type: "HTMLAttributes<HTMLDivElement>", description: "Root wrapper with overflow-x-auto and border. Accepts className." },
  { prop: "Table.Header", type: "HTMLAttributes<HTMLTableSectionElement>", description: "Renders <thead> with border-b and background styling." },
  { prop: "Table.Body", type: "HTMLAttributes<HTMLTableSectionElement>", description: "Renders <tbody> with divide-y row separators." },
  { prop: "Table.Footer", type: "HTMLAttributes<HTMLTableSectionElement>", description: "Renders <tfoot> with border-t and background styling." },
  { prop: "Table.Row", type: "HTMLAttributes<HTMLTableRowElement>", description: "Renders <tr> with hover state transition." },
  { prop: "Table.Head", type: "ThHTMLAttributes<HTMLTableCellElement>", description: "Renders <th> with uppercase tracking-wide styling." },
  { prop: "Table.Cell", type: "TdHTMLAttributes<HTMLTableCellElement>", description: "Renders <td> with default padding." },
  { prop: "Table.Caption", type: "HTMLAttributes<HTMLTableCaptionElement>", description: "Renders <caption> positioned at top." },
];

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
            Styled HTML table primitives for building data tables. Includes
            responsive overflow, row hover states, and dark mode support. Use as
            a foundation for TanStack Table integrations.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {["Accessible", "Dark Mode", "Responsive", "Styled Primitives", "TanStack Table v8"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22] px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="table" />

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

        {/* 02 Styled Primitives */}
        <section id="primitives" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Styled Primitives</h2>
          </div>
          <p className="mb-6 leading-relaxed text-slate-600 dark:text-slate-400">
            The Table component provides styled sub-components that render correct HTML
            elements. Each extends native HTML attributes for full flexibility.
          </p>
          <div className="rounded-xl border border-slate-200 dark:border-[#1f2937] bg-white dark:bg-[#161b22] p-6 shadow-xs">
            <Table>
              <Table.Caption>Invoice list</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Invoice</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head>Method</Table.Head>
                  <Table.Head className="text-right">Amount</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell className="font-medium">INV001</Table.Cell>
                  <Table.Cell>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">Paid</span>
                  </Table.Cell>
                  <Table.Cell>Credit Card</Table.Cell>
                  <Table.Cell className="text-right">$250.00</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="font-medium">INV002</Table.Cell>
                  <Table.Cell>
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">Pending</span>
                  </Table.Cell>
                  <Table.Cell>Bank Transfer</Table.Cell>
                  <Table.Cell className="text-right">$150.00</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell className="font-medium">INV003</Table.Cell>
                  <Table.Cell>
                    <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-400">Unpaid</span>
                  </Table.Cell>
                  <Table.Cell>PayPal</Table.Cell>
                  <Table.Cell className="text-right">$350.00</Table.Cell>
                </Table.Row>
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.Cell colSpan={3}>Total</Table.Cell>
                  <Table.Cell className="text-right">$750.00</Table.Cell>
                </Table.Row>
              </Table.Footer>
            </Table>
          </div>
        </section>

        {/* 03 Live Demo (TanStack Table) */}
        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">TanStack Table Integration</h2>
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

        {/* 04 Column Config */}
        <section id="columns" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
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

        {/* 05 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Code Snippet</h2>
          </div>
          <CodeBlock filename="src/ui/Table.tsx" copyText={PRIMITIVE_SNIPPET}>
            {PRIMITIVE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 06 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">06</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Copy-Paste (Single File)</h2>
          </div>
          <CodeBlock filename="Table.tsx" copyText={COPY_PASTE_SNIPPET}>
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 07 Props */}
        <section id="props" className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">07</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Props</h2>
          </div>
          <p className="mb-6 text-sm text-slate-600 dark:text-slate-400">
            Each sub-component extends its corresponding native HTML element attributes.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-[#1f2937]">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 dark:border-[#1f2937] bg-slate-50 dark:bg-[#161b22]">
                <tr>
                  {["Component", "Type", "Description"].map((h) => (
                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#1f2937] bg-white dark:bg-[#0d1117]">
                {PRIMITIVE_PROPS_ROWS.map((row) => (
                  <tr key={row.prop} className="transition-colors hover:bg-slate-50 dark:hover:bg-[#161b22]">
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono font-semibold text-primary">{row.prop}</code>
                    </td>
                    <td className="px-4 py-3 max-w-[250px]">
                      <code className="text-xs font-mono text-slate-600 dark:text-slate-400">{row.type}</code>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                      {row.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 className="mt-10 mb-4 text-lg font-semibold text-slate-900 dark:text-white">UserTable (TanStack Table)</h3>
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
