"use client";

import { useState } from "react";
import { DocsPageLayout, CliInstallBlock } from "@/features/docs/components";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import { Calendar } from "@/ui/Calendar";
import type { CalendarMode, CalendarSelected } from "@/ui/Calendar";

const TOC_ITEMS = [
  { label: "Theme Preview", href: "#comparison" },
  { label: "Live Demo", href: "#demo" },
  { label: "Code Snippet", href: "#snippet" },
  { label: "Copy-Paste", href: "#copy-paste" },
  { label: "Props", href: "#props" },
];

const STORYBOOK_HREF =
  "https://storybook.reactprinciples.dev/?path=/story/ui-calendar--default";

const MODES: Array<{ mode: CalendarMode; label: string }> = [
  { mode: "single", label: "Single" },
  { mode: "range", label: "Range" },
  { mode: "multiple", label: "Multiple" },
];

const today = new Date();
today.setHours(0, 0, 0, 0);

const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 7);

const CODE_SNIPPET = `import { Calendar } from "@/ui/Calendar";

// Single selection
<Calendar
  mode="single"
  selected={selectedDate}
  onSelect={setSelectedDate}
/>

// Range selection
<Calendar
  mode="range"
  selected={dateRange}
  onSelect={setDateRange}
/>

// Multiple selection
<Calendar
  mode="multiple"
  selected={dates}
  onSelect={setDates}
/>

// With disabled dates (weekends)
<Calendar
  disabled={(date) => date.getDay() === 0 || date.getDay() === 6}
/>

// With selectable bounds
<Calendar
  fromDate={new Date(2026, 3, 1)}
  toDate={new Date(2026, 3, 30)}
/>`;

const COPY_PASTE_SNIPPET = `"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CalendarMode = "single" | "range" | "multiple";

export interface DateRange {
  from: Date;
  to?: Date;
}

export type CalendarSelected = Date | DateRange | Date[];

type DisabledDate = Date | ((date: Date) => boolean);

export interface CalendarProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> {
  mode?: CalendarMode;
  selected?: CalendarSelected;
  defaultSelected?: CalendarSelected;
  onSelect?: (date: CalendarSelected) => void;
  defaultMonth?: Date;
  disabled?: DisabledDate | DisabledDate[];
  fromDate?: Date;
  toDate?: Date;
  showOutsideDays?: boolean;
}

// ─── Date Utilities ───────────────────────────────────────────────────────────

function normalizeDate(d: Date): Date {
  const result = new Date(d);
  result.setHours(0, 0, 0, 0);
  return result;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isBefore(a: Date, b: Date): boolean {
  return normalizeDate(a).getTime() < normalizeDate(b).getTime();
}

function isAfter(a: Date, b: Date): boolean {
  return isBefore(b, a);
}

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return normalizeDate(result);
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

// ─── Grid Types ───────────────────────────────────────────────────────────────

interface CalendarDay {
  date: Date;
  dayOfMonth: number;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  isDisabled: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
}

type RangeState = "none" | "start" | "end";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

// ─── Grid Builder ─────────────────────────────────────────────────────────────

function buildCalendarGrid(
  viewMonth: Date,
  mode: CalendarMode,
  selected: CalendarSelected | undefined,
  disabledDates: DisabledDate[],
  fromDate: Date | undefined,
  toDate: Date | undefined,
  showOutsideDays: boolean,
): CalendarDay[] {
  const today = normalizeDate(new Date());
  const first = startOfMonth(viewMonth);
  const startDow = first.getDay();

  const gridStart = new Date(first);
  gridStart.setDate(gridStart.getDate() - startDow);

  const days: CalendarDay[] = [];
  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const date = new Date(gridStart);
    date.setDate(date.getDate() + i);
    const normalized = normalizeDate(date);
    const isCurrentMonth =
      date.getMonth() === viewMonth.getMonth() &&
      date.getFullYear() === viewMonth.getFullYear();

    if (!showOutsideDays && !isCurrentMonth) continue;

    let isSelected = false;
    let isInRange = false;
    let isRangeStart = false;
    let isRangeEnd = false;

    if (mode === "single" && selected instanceof Date) {
      isSelected = isSameDay(normalized, selected);
    } else if (
      mode === "range" &&
      selected !== undefined &&
      selected !== null &&
      typeof selected === "object" &&
      "from" in selected
    ) {
      const range = selected;
      const from = normalizeDate(range.from);
      const to = range.to ? normalizeDate(range.to) : undefined;
      isRangeStart = isSameDay(normalized, from);
      isRangeEnd = to !== undefined && isSameDay(normalized, to);
      isSelected = isRangeStart || isRangeEnd;
      if (to !== undefined) {
        isInRange = isAfter(normalized, from) && isBefore(normalized, to);
      }
    } else if (mode === "multiple" && Array.isArray(selected)) {
      isSelected = selected.some((d) => isSameDay(normalized, d));
    }

    let isDisabled = false;
    if (fromDate && isBefore(normalized, fromDate)) isDisabled = true;
    if (toDate && isAfter(normalized, toDate)) isDisabled = true;
    for (const dd of disabledDates) {
      if (typeof dd === "function") {
        if (dd(normalized)) { isDisabled = true; break; }
      } else if (isSameDay(normalized, dd)) {
        isDisabled = true; break;
      }
    }

    days.push({
      date: normalized,
      dayOfMonth: normalized.getDate(),
      isCurrentMonth,
      isSelected,
      isToday: isSameDay(normalized, today),
      isDisabled,
      isInRange,
      isRangeStart,
      isRangeEnd,
    });
  }

  return days;
}

// ─── Selection Handlers ───────────────────────────────────────────────────────

function handleSingleClick(date: Date): Date {
  return date;
}

function handleMultipleClick(date: Date, current: CalendarSelected | undefined): Date[] {
  const arr = Array.isArray(current) ? [...current] : [];
  const idx = arr.findIndex((d) => isSameDay(d, date));
  if (idx >= 0) {
    arr.splice(idx, 1);
  } else {
    arr.push(date);
    arr.sort((a, b) => a.getTime() - b.getTime());
  }
  return arr;
}

function handleRangeClick(
  date: Date,
  current: CalendarSelected | undefined,
  rangeState: RangeState,
): { next: DateRange; newState: RangeState } {
  if (rangeState === "none" || rangeState === "end") {
    return { next: { from: date }, newState: "start" };
  }
  const range = current as DateRange;
  const from = normalizeDate(range.from);
  const to = normalizeDate(date);
  if (isBefore(to, from)) {
    return { next: { from: to, to: from }, newState: "end" };
  }
  return { next: { from, to }, newState: "end" };
}

// ─── Keyboard Navigation ──────────────────────────────────────────────────────

function moveFocus(
  e: React.KeyboardEvent,
  focusedDate: Date,
  viewMonth: Date,
  setFocusedDate: (d: Date) => void,
  setViewMonth: (d: Date) => void,
  handleSelectDay: (day: CalendarDay) => void,
  days: CalendarDay[],
): void {
  let nextDate = new Date(focusedDate);
  let handled = true;

  switch (e.key) {
    case "ArrowRight":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "ArrowLeft":
      nextDate.setDate(nextDate.getDate() - 1);
      break;
    case "ArrowDown":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "ArrowUp":
      nextDate.setDate(nextDate.getDate() - 7);
      break;
    case "PageDown":
      nextDate = addMonths(nextDate, 1);
      setViewMonth(addMonths(viewMonth, 1));
      break;
    case "PageUp":
      nextDate = addMonths(nextDate, -1);
      setViewMonth(addMonths(viewMonth, -1));
      break;
    case "Home":
      nextDate = startOfMonth(viewMonth);
      break;
    case "End":
      nextDate = endOfMonth(viewMonth);
      break;
    case "Enter":
    case " ": {
      e.preventDefault();
      const day = days.find((d) => isSameDay(d.date, focusedDate));
      if (day && !day.isDisabled) handleSelectDay(day);
      return;
    }
    default:
      handled = false;
  }

  if (!handled) return;
  e.preventDefault();

  nextDate = normalizeDate(nextDate);
  setFocusedDate(nextDate);

  if (
    nextDate.getMonth() !== viewMonth.getMonth() ||
    nextDate.getFullYear() !== viewMonth.getFullYear()
  ) {
    setViewMonth(startOfMonth(nextDate));
  }

  const key = \`\${nextDate.getFullYear()}-\${nextDate.getMonth()}-\${nextDate.getDate()}\`;
  const el = document.querySelector<HTMLElement>(\`[data-calendar-day="\${key}"]\`);
  el?.focus();
}

// ─── Calendar Component ───────────────────────────────────────────────────────

export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(
  function Calendar(
    {
      mode = "single",
      selected: controlledSelected,
      defaultSelected,
      onSelect,
      defaultMonth,
      disabled,
      fromDate,
      toDate,
      showOutsideDays = true,
      className,
      ...props
    },
    ref,
  ) {
    const [viewMonth, setViewMonth] = useState<Date>(
      () => (defaultMonth ? normalizeDate(defaultMonth) : normalizeDate(new Date())),
    );
    const [internalSelected, setInternalSelected] = useState<
      CalendarSelected | undefined
    >(defaultSelected);
    const [focusedDate, setFocusedDate] = useState<Date>(
      () => (defaultMonth ? normalizeDate(defaultMonth) : normalizeDate(new Date())),
    );
    const [rangeState, setRangeState] = useState<RangeState>("none");

    const isControlled = controlledSelected !== undefined;
    const currentSelected = isControlled ? controlledSelected : internalSelected;

    const disabledDates: DisabledDate[] = useMemo(() => {
      if (!disabled) return [];
      return Array.isArray(disabled) ? disabled : [disabled];
    }, [disabled]);

    const days = useMemo(
      () =>
        buildCalendarGrid(
          viewMonth, mode, currentSelected, disabledDates, fromDate, toDate, showOutsideDays,
        ),
      [viewMonth, mode, currentSelected, disabledDates, fromDate, toDate, showOutsideDays],
    );

    const prevSelectedRef = useRef(currentSelected);
    useEffect(() => {
      if (prevSelectedRef.current === currentSelected) return;
      prevSelectedRef.current = currentSelected;
      if (mode === "single" && currentSelected instanceof Date) {
        setFocusedDate(normalizeDate(currentSelected));
      }
    }, [currentSelected, mode]);

    const goToPreviousMonth = useCallback(() => {
      setViewMonth((prev) => addMonths(prev, -1));
    }, []);

    const goToNextMonth = useCallback(() => {
      setViewMonth((prev) => addMonths(prev, 1));
    }, []);

    const handleDayClick = useCallback(
      (day: CalendarDay) => {
        if (day.isDisabled) return;

        let next: CalendarSelected;
        if (mode === "single") {
          next = handleSingleClick(day.date);
        } else if (mode === "multiple") {
          next = handleMultipleClick(day.date, currentSelected);
        } else {
          const result = handleRangeClick(day.date, currentSelected, rangeState);
          setRangeState(result.newState);
          next = result.next;
        }

        if (!isControlled) setInternalSelected(next);
        onSelect?.(next);
        setFocusedDate(day.date);
      },
      [mode, currentSelected, rangeState, isControlled, onSelect],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        moveFocus(e, focusedDate, viewMonth, setFocusedDate, setViewMonth, handleDayClick, days);
      },
      [focusedDate, viewMonth, handleDayClick, days],
    );

    const monthLabel = \`\${MONTH_NAMES[viewMonth.getMonth()]} \${viewMonth.getFullYear()}\`;

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex flex-col rounded-xl border border-slate-200 bg-white p-4",
          "dark:border-[#1f2937] dark:bg-[#161b22]",
          className,
        )}
        {...props}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#1f2937]"
            aria-label="Previous month"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="text-sm font-semibold text-slate-900 dark:text-white">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={goToNextMonth}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#1f2937]"
            aria-label="Next month"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>

        {/* Weekday Headers */}
        <div className="mb-2 grid grid-cols-7">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="flex h-8 items-center justify-center text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day Grid */}
        <div role="grid" className="grid grid-cols-7" onKeyDown={handleKeyDown}>
          {days.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              role="gridcell"
              data-calendar-day={\`\${day.date.getFullYear()}-\${day.date.getMonth()}-\${day.date.getDate()}\`}
              tabIndex={isSameDay(day.date, focusedDate) ? 0 : -1}
              disabled={day.isDisabled}
              onClick={() => handleDayClick(day)}
              aria-selected={day.isSelected || day.isInRange || undefined}
              className={cn(
                "relative flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
                !day.isCurrentMonth && !day.isSelected && "text-slate-300 dark:text-slate-600",
                day.isCurrentMonth && !day.isSelected && !day.isInRange && !day.isDisabled
                  && "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#1f2937]",
                day.isToday && !day.isSelected && "font-bold text-primary",
                day.isSelected && "bg-primary text-white hover:bg-primary/90",
                day.isInRange && !day.isSelected && "bg-primary/10 dark:bg-primary/20",
                day.isDisabled && "cursor-not-allowed text-slate-300 opacity-50 dark:text-slate-600",
              )}
            >
              {day.dayOfMonth}
              {day.isToday && !day.isSelected && (
                <span className="absolute bottom-1 left-1/2 h-0.5 w-1 -translate-x-1/2 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  },
);`;

const PROPS_ROWS = [
  {
    prop: "mode",
    type: '"single" | "range" | "multiple"',
    required: false,
    default: '"single"',
    description: "Controls the selection behavior.",
  },
  {
    prop: "selected",
    type: "Date | DateRange | Date[]",
    required: false,
    default: "—",
    description: "Controlled selected date(s). Use with onSelect.",
  },
  {
    prop: "defaultSelected",
    type: "Date | DateRange | Date[]",
    required: false,
    default: "—",
    description: "Initial selection for uncontrolled usage.",
  },
  {
    prop: "onSelect",
    type: "(date: CalendarSelected) => void",
    required: false,
    default: "—",
    description: "Callback fired when a date is selected.",
  },
  {
    prop: "defaultMonth",
    type: "Date",
    required: false,
    default: "Today",
    description: "The month to display on initial render.",
  },
  {
    prop: "disabled",
    type: "Date | ((date: Date) => boolean) | Array",
    required: false,
    default: "—",
    description: "Dates to disable. Can be a date, a function, or an array of either.",
  },
  {
    prop: "fromDate",
    type: "Date",
    required: false,
    default: "—",
    description: "Earliest selectable date.",
  },
  {
    prop: "toDate",
    type: "Date",
    required: false,
    default: "—",
    description: "Latest selectable date.",
  },
  {
    prop: "showOutsideDays",
    type: "boolean",
    required: false,
    default: "true",
    description: "Whether to show days from adjacent months.",
  },
  {
    prop: "className",
    type: "string",
    required: false,
    default: "—",
    description: "Additional classes merged into the root container.",
  },
];

// ─── Forced-theme preview ─────────────────────────────────────────────────────

function ThemedCalendarPreview({ theme }: { theme: "light" | "dark" }) {
  const isDark = theme === "dark";
  const wrapper = isDark
    ? "bg-[#0d1117] text-white"
    : "bg-white text-slate-900";

  // Build a simplified calendar header for theme preview
  const monthLabel = "April 2026";
  const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const sampleDays = [
    { day: 13, type: "normal" as const },
    { day: 14, type: "normal" as const },
    { day: 15, type: "selected" as const },
    { day: 16, type: "range" as const },
    { day: 17, type: "selected" as const },
    { day: 18, type: "normal" as const },
    { day: 19, type: "normal" as const },
  ];

  const dayClasses = (type: "normal" | "selected" | "range" | "today") => {
    if (type === "selected")
      return "bg-primary text-white rounded-lg";
    if (type === "range")
      return isDark
        ? "bg-primary/20 text-slate-300"
        : "bg-primary/10 text-slate-700";
    return isDark ? "text-slate-300" : "text-slate-700";
  };

  return (
    <div
      className={`rounded-xl border p-4 ${wrapper} ${isDark ? "border-[#1f2937]" : "border-slate-200"}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className={`rounded-lg p-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <span className="material-symbols-outlined text-[20px]">chevron_left</span>
        </div>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <div className={`rounded-lg p-1 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </div>
      </div>
      <div className="mb-2 grid grid-cols-7">
        {weekdays.map((d) => (
          <div
            key={d}
            className={`flex h-7 items-center justify-center text-xs font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {sampleDays.map((d) => (
          <div
            key={d.day}
            className={`flex h-8 items-center justify-center rounded-lg text-xs font-medium ${dayClasses(d.type)}`}
          >
            {d.day}
          </div>
        ))}
      </div>
      <p className={`mt-3 text-center text-[10px] font-medium ${isDark ? "text-slate-500" : "text-slate-400"}`}>
        Range selection preview
      </p>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarDocPage() {
  const [activeMode, setActiveMode] = useState<CalendarMode>("single");
  const [showOutsideDays, setShowOutsideDays] = useState(true);
  const [disableWeekends, setDisableWeekends] = useState(false);
  const [selected, setSelected] = useState<CalendarSelected | undefined>(
    undefined,
  );

  return (
    <DocsPageLayout tocItems={TOC_ITEMS}>
      <div className="max-w-4xl">
        {/* Breadcrumb */}
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
          <span className="text-slate-900 dark:text-white">Calendar</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
            Calendar
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            A standalone visual calendar for date selection. Supports single, range,
            and multiple selection modes with keyboard navigation and disabled date
            support.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              "Accessible",
              "Dark Mode",
              "Keyboard Nav",
              "3 Modes",
            ].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <CliInstallBlock name="calendar" />

        {/* 01 Theme Preview */}
        <section id="comparison" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">01</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Theme Preview
            </h2>
          </div>
          <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
            Range selection preview across both themes — rendered with forced
            styling so the comparison is accurate regardless of the current app
            theme.
          </p>
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-amber-400 shadow-xs shadow-amber-300" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Light
                </span>
              </div>
              <ThemedCalendarPreview theme="light" />
            </div>
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-indigo-500 shadow-xs shadow-indigo-400" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Dark
                </span>
              </div>
              <ThemedCalendarPreview theme="dark" />
            </div>
          </div>
        </section>

        {/* 02 Live Demo */}
        <section id="demo" className="mb-16">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">02</span>
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
            {/* Mode selector */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Mode
                </span>
                <div className="flex gap-2">
                  {MODES.map((m) => (
                    <button
                      key={m.mode}
                      onClick={() => {
                        setActiveMode(m.mode);
                        setSelected(undefined);
                      }}
                      className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${activeMode === m.mode
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2937] dark:text-slate-400 dark:hover:bg-[#2d3748]"
                        }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold tracking-wide uppercase text-slate-500 dark:text-slate-400">
                  Options
                </span>
                <button
                  onClick={() => setShowOutsideDays(!showOutsideDays)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${showOutsideDays
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2937] dark:text-slate-400 dark:hover:bg-[#2d3748]"
                    }`}
                >
                  Outside days
                </button>
                <button
                  onClick={() => setDisableWeekends(!disableWeekends)}
                  className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${disableWeekends
                    ? "bg-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-[#1f2937] dark:text-slate-400 dark:hover:bg-[#2d3748]"
                    }`}
                >
                  No weekends
                </button>
              </div>
            </div>

            {/* Calendar */}
            <Calendar
              mode={activeMode}
              selected={selected}
              onSelect={setSelected}
              showOutsideDays={showOutsideDays}
              disabled={
                disableWeekends
                  ? [(d: Date) => d.getDay() === 0 || d.getDay() === 6]
                  : undefined
              }
              className="w-full"
            />

            {/* Selection display */}
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Selected:{" "}
              {selected === undefined
                ? "None"
                : selected instanceof Date
                  ? selected.toLocaleDateString()
                  : Array.isArray(selected)
                    ? selected.map((d) => d.toLocaleDateString()).join(", ")
                    : `${(selected as { from: Date }).from.toLocaleDateString()}${(selected as { from: Date; to?: Date }).to ? ` → ${(selected as { from: Date; to?: Date }).to?.toLocaleDateString() ?? ""}` : ""}`}
            </div>
          </div>
        </section>

        {/* 03 Code Snippet */}
        <section id="snippet" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">03</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Code Snippet
            </h2>
          </div>
          <CodeBlock
            filename="src/ui/Calendar.tsx"
            copyText={CODE_SNIPPET}
          >
            {CODE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 04 Copy-Paste */}
        <section id="copy-paste" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">04</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Copy-Paste (Single File)
            </h2>
          </div>
          <CodeBlock
            filename="Calendar.tsx"
            copyText={COPY_PASTE_SNIPPET}
          >
            {COPY_PASTE_SNIPPET}
          </CodeBlock>
        </section>

        {/* 05 Props */}
        <section id="props" className="mb-16">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary/10 text-primary">
              <span className="text-sm font-bold">05</span>
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
