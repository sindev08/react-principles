"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
} from "react";
import { cn } from "@/shared/utils/cn";

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
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
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
  const totalCells = 42; // 6 rows × 7 cols for consistent height

  for (let i = 0; i < totalCells; i++) {
    const date = new Date(gridStart);
    date.setDate(date.getDate() + i);
    const normalized = normalizeDate(date);
    const isCurrentMonth =
      date.getMonth() === viewMonth.getMonth() &&
      date.getFullYear() === viewMonth.getFullYear();

    if (!showOutsideDays && !isCurrentMonth) continue;

    // Selection state
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

    // Disabled state
    let isDisabled = false;
    if (fromDate && isBefore(normalized, fromDate)) isDisabled = true;
    if (toDate && isAfter(normalized, toDate)) isDisabled = true;
    for (const dd of disabledDates) {
      if (typeof dd === "function") {
        if (dd(normalized)) {
          isDisabled = true;
          break;
        }
      } else if (isSameDay(normalized, dd)) {
        isDisabled = true;
        break;
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

function handleMultipleClick(
  date: Date,
  current: CalendarSelected | undefined,
): Date[] {
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
  // Completing the range
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

  // If focus moved outside the current view month, update the view
  if (
    nextDate.getMonth() !== viewMonth.getMonth() ||
    nextDate.getFullYear() !== viewMonth.getFullYear()
  ) {
    setViewMonth(startOfMonth(nextDate));
  }

  // Focus the new day cell
  const key = `${nextDate.getFullYear()}-${nextDate.getMonth()}-${nextDate.getDate()}`;
  const el = document.querySelector<HTMLElement>(
    `[data-calendar-day="${key}"]`,
  );
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
          viewMonth,
          mode,
          currentSelected,
          disabledDates,
          fromDate,
          toDate,
          showOutsideDays,
        ),
      [viewMonth, mode, currentSelected, disabledDates, fromDate, toDate, showOutsideDays],
    );

    // Sync focused date when selected changes externally
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
        moveFocus(
          e,
          focusedDate,
          viewMonth,
          setFocusedDate,
          setViewMonth,
          handleDayClick,
          days,
        );
      },
      [focusedDate, viewMonth, handleDayClick, days],
    );

    const monthLabel = `${MONTH_NAMES[viewMonth.getMonth()]} ${viewMonth.getFullYear()}`;

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
        {/* Header: Month/Year + Navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goToPreviousMonth}
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-[#1f2937]"
            aria-label="Previous month"
          >
            <span className="material-symbols-outlined text-[20px]">
              chevron_left
            </span>
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
            <span className="material-symbols-outlined text-[20px]">
              chevron_right
            </span>
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
        <div
          role="grid"
          className="grid grid-cols-7"
          onKeyDown={handleKeyDown}
        >
          {days.map((day) => (
            <button
              key={day.date.toISOString()}
              type="button"
              role="gridcell"
              data-calendar-day={`${day.date.getFullYear()}-${day.date.getMonth()}-${day.date.getDate()}`}
              tabIndex={isSameDay(day.date, focusedDate) ? 0 : -1}
              disabled={day.isDisabled}
              onClick={() => handleDayClick(day)}
              aria-selected={day.isSelected || day.isInRange || undefined}
              className={cn(
                "relative flex h-9 w-full items-center justify-center rounded-lg text-sm font-medium transition-colors",
                "focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary/40",
                // Outside days
                !day.isCurrentMonth &&
                  !day.isSelected &&
                  "text-slate-300 dark:text-slate-600",
                // Normal days
                day.isCurrentMonth &&
                  !day.isSelected &&
                  !day.isInRange &&
                  !day.isDisabled &&
                  "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-[#1f2937]",
                // Today
                day.isToday &&
                  !day.isSelected &&
                  "font-bold text-primary",
                // Selected (single / range endpoints)
                day.isSelected &&
                  "bg-primary text-white hover:bg-primary/90",
                // Range in-between
                day.isInRange &&
                  !day.isSelected &&
                  "bg-primary/10 dark:bg-primary/20",
                // Disabled
                day.isDisabled &&
                  "cursor-not-allowed text-slate-300 opacity-50 dark:text-slate-600",
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
);
