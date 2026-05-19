"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { cn } from "@/shared/utils/cn";

export interface ComboboxOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  label?: string;
  description?: string;
  className?: string;
}

export function Combobox({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "Search...",
  emptyText = "No results",
  label,
  description,
  className,
}: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const inputId = useId();
  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(q) || option.description?.toLowerCase().includes(q)
    );
  }, [options, query]);

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

  useEffect(() => {
    if (selectedOption && !open) {
      setQuery(selectedOption.label);
    }
  }, [selectedOption, open]);

  const selectValue = (nextValue: string) => {
    if (!isControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    const nextOption = options.find((option) => option.value === nextValue);
    setQuery(nextOption?.label ?? "");
    setOpen(false);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>}

      <div ref={containerRef} className="relative">
        <input
          id={inputId}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-activedescendant={open ? `${listboxId}-option-${highlightedIndex}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(event) => {
            if (!open && event.key === "ArrowDown") {
              setOpen(true);
              return;
            }
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setHighlightedIndex((index) => Math.min(index + 1, filtered.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setHighlightedIndex((index) => Math.max(index - 1, 0));
            }
            if (event.key === "Enter") {
              event.preventDefault();
              const option = filtered[highlightedIndex];
              if (option && !option.disabled) selectValue(option.value);
            }
            if (event.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "h-10 w-full rounded-lg border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-hidden transition-all",
            "hover:border-slate-300 focus:border-primary focus:ring-2 focus:ring-primary/20",
            "dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white dark:hover:border-slate-600"
          )}
        />
        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
          {open ? "expand_less" : "expand_more"}
        </span>

        {open && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute z-40 mt-2 max-h-64 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-lg dark:border-[#1f2937] dark:bg-[#161b22]"
          >
            {filtered.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-500 dark:text-slate-400">{emptyText}</p>
            )}
            {filtered.map((option, index) => {
              const isSelected = selectedValue === option.value;
              const isHighlighted = index === highlightedIndex;
              return (
                <button
                  key={option.value}
                  id={`${listboxId}-option-${index}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected || undefined}
                  disabled={option.disabled}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onClick={() => !option.disabled && selectValue(option.value)}
                  className={cn(
                    "flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left transition-colors",
                    isHighlighted && "bg-primary/10",
                    !isHighlighted && "hover:bg-slate-50 dark:hover:bg-[#0d1117]",
                    option.disabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <span
                    className={cn(
                      "mt-0.5 material-symbols-outlined text-[16px]",
                      isSelected ? "text-primary" : "text-transparent"
                    )}
                  >
                    check
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm text-slate-900 dark:text-white">{option.label}</span>
                    {option.description && (
                      <span className="mt-0.5 block truncate text-xs text-slate-500 dark:text-slate-400">
                        {option.description}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {description && <p className="text-xs text-slate-500 dark:text-slate-400">{description}</p>}
    </div>
  );
}
