"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { DatePicker } from "@/ui/DatePicker";

const TOC_ITEMS = [
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF =
  "https://storybook.reactprinciples.dev/?path=/story/ui-date-picker--default";

const CODE_SNIPPET = `import { DatePicker } from "@/ui/DatePicker";

<DatePicker
  label="Launch date"
  description="Select the deployment day."
  onChange={(value) => console.log(value)}
/>

// Range mode
<DatePicker
  label="Date range"
  mode="range"
  onChange={(value) => console.log(value)}
/>`;

const COPY_PASTE_SNIPPET = `"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type InputHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "./Calendar";
import type { CalendarMode, CalendarSelected } from "./Calendar";

export interface DatePickerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "value" | "onChange" | "defaultValue"
  > {
  label?: string;
  description?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  mode?: CalendarMode;
  placeholder?: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toDate(dateStr: string): Date {
  const parts = dateStr.split("-").map(Number);
  const y = parts[0] ?? 0;
  const m = parts[1] ?? 1;
  const d = parts[2] ?? 1;
  return new Date(y, m - 1, d);
}

function dateToString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return \`\${y}-\${m}-\${d}\`;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePickerRoot(
    {
      label,
      description,
      error,
      value,
      defaultValue,
      onChange,
      mode = "single",
      placeholder = "Pick a date",
      className,
      id,
      ...props
    },
    ref,
  ) {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const containerRef = useRef<HTMLDivElement>(null);

    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const calendarSelected: CalendarSelected | undefined = currentValue
      ? toDate(currentValue)
      : undefined;

    const handleSelect = useCallback(
      (selected: CalendarSelected) => {
        let dateStr = "";

        if (mode === "single" && selected instanceof Date) {
          dateStr = dateToString(selected);
        } else if (
          mode === "range" &&
          selected !== null &&
          typeof selected === "object" &&
          "from" in selected
        ) {
          const range = selected as { from: Date; to?: Date };
          if (range.to) {
            dateStr = \`\${dateToString(range.from)} → \${dateToString(range.to)}\`;
          } else {
            dateStr = dateToString(range.from);
          }
        } else if (mode === "multiple" && Array.isArray(selected)) {
          dateStr = selected.map(dateToString).join(", ");
        }

        if (!isControlled) setInternalValue(dateStr);
        onChange?.(dateStr);
        if (mode === "single") setOpen(false);
      },
      [mode, isControlled, onChange],
    );

    useEffect(() => {
      if (!open) return;
      const onPointerDown = (event: MouseEvent) => {
        if (!containerRef.current?.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      window.addEventListener("mousedown", onPointerDown);
      return () => window.removeEventListener("mousedown", onPointerDown);
    }, [open]);

    const inputId =
      id ?? (label ? label.toLowerCase().replace(/\\s+/g, "-") : undefined);

    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
          </label>
        )}
        <div ref={containerRef} className="relative">
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-left text-sm text-slate-900 outline-hidden transition-all",
              "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
              "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600",
              error &&
                "border-red-400 focus:border-red-400 focus:ring-red-400/20 dark:border-red-500",
              !currentValue && "text-slate-400 dark:text-slate-500",
            )}
          >
            <span className="flex items-center justify-between gap-2">
              {currentValue ? formatDate(currentValue) : placeholder}
              <span className="material-symbols-outlined text-[18px] text-slate-400">
                calendar_month
              </span>
            </span>
          </button>

          <input
            ref={ref}
            id={inputId}
            type="hidden"
            value={currentValue}
            name={props.name}
          />

          {open && (
            <div className="absolute z-40 mt-2 left-0 w-full">
              <Calendar
                mode={mode}
                selected={calendarSelected}
                onSelect={handleSelect}
                className="w-full"
              />
            </div>
          )}
        </div>
        {description && !error && (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  },
);`;

const PROPS_ROWS = [
  { prop: "label", type: "string", default: "—", description: "Optional label displayed above the date picker." },
  { prop: "description", type: "string", default: "—", description: "Helper text shown below the field when there is no error." },
  { prop: "error", type: "string", default: "—", description: "Error message that replaces the helper text and applies error styling." },
  { prop: "value", type: "string", default: "—", description: "Controlled value as an ISO date string (YYYY-MM-DD)." },
  { prop: "defaultValue", type: "string", default: "—", description: "Initial value for uncontrolled usage." },
  { prop: "onChange", type: "(value: string) => void", default: "—", description: "Callback fired when a date is selected. Receives the formatted date string." },
  { prop: "mode", type: '"single" | "range" | "multiple"', default: '"single"', description: "Selection mode passed to the underlying Calendar." },
  { prop: "placeholder", type: "string", default: '"Pick a date"', description: "Placeholder text shown when no date is selected." },
  { prop: "className", type: "string", default: "—", description: "Additional classes merged into the root wrapper." },
];

export default function DatePickerDocPage() {
  const [value, setValue] = useState("2026-04-10");

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-slate-500">
          <span className="cursor-pointer transition-colors hover:text-primary">
            Components
          </span>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="cursor-pointer transition-colors hover:text-primary">
            Form
          </span>
          <span className="material-symbols-outlined text-[16px]">
            chevron_right
          </span>
          <span className="text-slate-900 dark:text-white">Date Picker</span>
        </nav>

        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Date Picker
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A date input field that combines a text trigger with a Calendar popover
            dropdown. Supports single, range, and multiple selection modes with
            built-in label, helper text, and validation messaging.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Accessible", "Dark Mode", "Popover", "3 Modes"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="date-picker" />

        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Live Demo
            </h2>
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
              <span className="material-symbols-outlined text-[13px]">
                open_in_new
              </span>
            </span>
          </a>
          <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6 shadow-xs dark:border-[#1f2937] dark:bg-[#161b22]">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Single mode
                </p>
                <DatePicker
                  label="Launch date"
                  description="Select the deployment day."
                  value={value}
                  onChange={setValue}
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Error state
                </p>
                <DatePicker
                  label="Publish window"
                  error="Please choose a valid date in the future."
                />
              </div>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Range mode
                </p>
                <DatePicker
                  label="Date range"
                  mode="range"
                  placeholder="Select a range"
                />
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Placeholder
                </p>
                <DatePicker
                  label="Due date"
                  placeholder="Choose a due date"
                />
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Selected value: {value}
            </p>
          </div>
        </section>

        <section id="snippet" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Code Snippet
            </h2>
          </div>
          <CodeBlock
            filename="src/ui/DatePicker.tsx"
            copyText={CODE_SNIPPET}
          >
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="copy-paste" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Copy-Paste (Single File)
            </h2>
          </div>
          <CodeBlock
            filename="DatePicker.tsx"
            copyText={COPY_PASTE_SNIPPET}
          >
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        <section id="props" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Props
            </h2>
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
                      <code className="font-mono text-xs font-semibold text-primary">
                        {row.prop}
                      </code>
                    </td>
                    <td className="max-w-[240px] px-4 py-3">
                      <code className="wrap-break-word font-mono text-xs text-slate-600 dark:text-slate-400">
                        {row.type}
                      </code>
                    </td>
                    <td className="px-4 py-3">
                      <code className="font-mono text-xs text-slate-500 dark:text-slate-400">
                        {row.default}
                      </code>
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
