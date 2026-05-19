"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Button } from "@/ui/Button";
import { Dialog } from "@/ui/Dialog";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { cn } from "@/shared/utils/cn";
import { useWizardStore } from "../stores/useWizardStore";
import { decodePreset, getAllIconSets, getPopularFonts } from "../lib";
import type { PresetConfig, RadiusOption } from "../data";

export interface ConfiguratorSidebarProps {
  onOpenCreateModal: () => void;
  className?: string;
}

const STYLE_OPTIONS: Array<{
  value: PresetConfig["style"];
  label: string;
  hint: string;
  previewColor: string;
  previewRadius: string;
}> = [
  { value: "arc",    label: "Arc",    hint: "Rounded", previewColor: "#3b82f6", previewRadius: "0.5rem" },
  { value: "edge",   label: "Edge",   hint: "Sharp",   previewColor: "#0f172a", previewRadius: "0" },
  { value: "soleil", label: "Soleil", hint: "Warm",    previewColor: "#f59e0b", previewRadius: "0.375rem" },
];

const RADIUS_OPTIONS: RadiusOption[] = ["none", "sm", "md", "lg"];

const COLOR_PALETTES = [
  { name: "Ocean",   base: "#0f172a", brand: "#3b82f6", accent: "#8b5cf6", chart: "#10b981" },
  { name: "Sunset",  base: "#111827", brand: "#f97316", accent: "#ec4899", chart: "#06b6d4" },
  { name: "Forest",  base: "#1f2937", brand: "#14b8a6", accent: "#f59e0b", chart: "#6366f1" },
  { name: "Lime",    base: "#18181b", brand: "#84cc16", accent: "#22c55e", chart: "#0ea5e9" },
  { name: "Crimson", base: "#0f172a", brand: "#ef4444", accent: "#f59e0b", chart: "#8b5cf6" },
  { name: "Violet",  base: "#1e1b4b", brand: "#7c3aed", accent: "#ec4899", chart: "#06b6d4" },
  { name: "Sand",    base: "#1c1917", brand: "#d97706", accent: "#b45309", chart: "#65a30d" },
  { name: "Slate",   base: "#0f172a", brand: "#64748b", accent: "#475569", chart: "#22d3ee" },
];

const ALL_COMPONENTS = [
  "Alert",
  "Avatar",
  "Badge",
  "Breadcrumb",
  "Button",
  "Calendar",
  "Card",
  "Carousel",
  "Chart",
  "Checkbox",
  "Collapsible",
  "Command",
  "DataTable",
  "DatePicker",
  "Dialog",
  "Drawer",
  "DropdownMenu",
  "Input",
  "Label",
  "Pagination",
  "Popover",
  "Progress",
  "RadioGroup",
  "Select",
  "Separator",
  "Skeleton",
  "Slider",
  "Spinner",
  "Switch",
  "Tabs",
  "Textarea",
  "Toast",
  "Tooltip",
];

const COMPONENT_CATEGORIES: Record<string, string[]> = {
  Forms: ["Input", "Textarea", "Select", "Checkbox", "RadioGroup", "Switch", "Slider", "Label"],
  Feedback: ["Alert", "Progress", "Skeleton", "Spinner", "Toast"],
  Navigation: ["Tabs", "Pagination", "Breadcrumb", "Command"],
  Overlays: ["Dialog", "Drawer", "Popover", "Tooltip", "DropdownMenu"],
  Data: ["DataTable", "Chart", "Calendar", "DatePicker"],
  Layout: ["Card", "Separator", "Collapsible", "Avatar", "Badge", "Carousel", "Button"],
};

export function ConfiguratorSidebar({ onOpenCreateModal, className }: ConfiguratorSidebarProps) {
  const [presetDialogOpen, setPresetDialogOpen] = useState(false);
  const [presetInput, setPresetInput] = useState("");
  const [presetError, setPresetError] = useState("");
  const [componentCategory, setComponentCategory] = useState("All");

  const {
    style,
    setStyle,
    colors,
    setColors,
    fonts,
    setFonts,
    iconSet,
    setIconSet,
    radius,
    setRadius,
    components,
    toggleComponent,
    hydrateFromPreset,
  } = useWizardStore();

  const fontOptions = useMemo(
    () => getPopularFonts().map((font) => ({ value: font.family, label: font.family })),
    [],
  );
  const iconOptions = useMemo(
    () => getAllIconSets().map((set) => ({ value: set.prefix, label: set.name })),
    [],
  );
  const visibleComponents = componentCategory === "All" ? ALL_COMPONENTS : COMPONENT_CATEGORIES[componentCategory] ?? [];

  const shuffleVisualConfig = () => {
    const nextStyle = pickRandom(STYLE_OPTIONS).value;
    const nextColors = pickRandom(COLOR_PALETTES);
    const nextHeaderFont = pickRandom(fontOptions).value;
    const nextBodyFont = pickRandom(fontOptions).value;
    const nextIconSet = pickRandom(iconOptions).value;
    const nextRadius = pickRandom(RADIUS_OPTIONS);

    setStyle(nextStyle);
    setColors(nextColors);
    setFonts({ header: nextHeaderFont, body: nextBodyFont });
    setIconSet(nextIconSet);
    setRadius(nextRadius);
  };

  const applyPresetInput = () => {
    const trimmed = presetInput.trim();
    if (!trimmed) {
      setPresetError("Paste an encoded preset first.");
      return;
    }

    hydrateFromPreset(decodePreset(trimmed));
    setPresetError("");
    setPresetInput("");
    setPresetDialogOpen(false);
  };

  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-r border-slate-200 bg-white dark:border-[#1f2937] dark:bg-[#0b0e14]",
        className,
      )}
    >
      <div className="flex-1 overflow-y-auto p-5">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Configurator</p>
          <h2 className="mt-1 text-lg font-black tracking-tight text-slate-900 dark:text-white">Visual System</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Tweak the preset and watch the preview update instantly.</p>
        </div>

        <div className="space-y-6">
          <SidebarSection title="Style">
            <div className="grid grid-cols-3 gap-2">
              {STYLE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setStyle(option.value)}
                  className={cn(
                    "flex flex-col items-start gap-2.5 rounded-xl border p-3 transition-colors",
                    style === option.value
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:bg-slate-50 dark:border-[#1f2937] dark:hover:bg-[#161b22]",
                  )}
                >
                  <div
                    className="h-9 w-full border"
                    style={{
                      borderRadius: option.previewRadius === "0" ? "0" : `calc(${option.previewRadius} * 1.5)`,
                      backgroundColor: option.previewColor + "15",
                      borderColor: option.previewColor + "35",
                    }}
                  >
                    <div
                      className="mx-2 mt-2 h-1.5"
                      style={{ borderRadius: option.previewRadius, backgroundColor: option.previewColor, opacity: 0.85 }}
                    />
                    <div
                      className="mx-2 mt-1.5 h-1.5 w-2/3"
                      style={{ borderRadius: option.previewRadius, backgroundColor: option.previewColor, opacity: 0.35 }}
                    />
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold", style === option.value ? "text-primary" : "text-slate-700 dark:text-slate-300")}>
                      {option.label}
                    </p>
                    <p className="text-[10px] text-slate-400">{option.hint}</p>
                  </div>
                </button>
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title="Colors">
            <div className="mb-4 grid grid-cols-4 gap-1.5">
              {COLOR_PALETTES.map((palette) => {
                const isActive = colors.brand === palette.brand && colors.accent === palette.accent;
                return (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => setColors(palette)}
                    title={palette.name}
                    className={cn(
                      "flex flex-col gap-1.5 rounded-lg border p-1.5 transition-colors",
                      isActive
                        ? "border-primary ring-1 ring-primary/20"
                        : "border-slate-200 hover:border-slate-300 dark:border-[#1f2937] dark:hover:border-[#374151]",
                    )}
                  >
                    <div className="flex h-5 w-full overflow-hidden rounded-sm">
                      <div className="flex-1" style={{ backgroundColor: palette.brand }} />
                      <div className="flex-1" style={{ backgroundColor: palette.accent }} />
                      <div className="flex-1" style={{ backgroundColor: palette.chart }} />
                    </div>
                    <span className="block text-center text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                      {palette.name}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              <ColorControl label="Base" value={colors.base} onChange={(base) => setColors({ ...colors, base })} />
              <ColorControl label="Brand" value={colors.brand} onChange={(brand) => setColors({ ...colors, brand })} />
              <ColorControl label="Accent" value={colors.accent} onChange={(accent) => setColors({ ...colors, accent })} />
              <ColorControl label="Chart" value={colors.chart} onChange={(chart) => setColors({ ...colors, chart })} />
            </div>
          </SidebarSection>

          <SidebarSection title="Typography">
            <div className="space-y-3">
              <Select
                label="Header Font"
                size="sm"
                value={fonts.header}
                onChange={(event) => setFonts({ ...fonts, header: event.currentTarget.value })}
                options={fontOptions}
              />
              <Select
                label="Body Font"
                size="sm"
                value={fonts.body}
                onChange={(event) => setFonts({ ...fonts, body: event.currentTarget.value })}
                options={fontOptions}
              />
            </div>
          </SidebarSection>

          <SidebarSection title="Icon Library">
            <Select
              size="sm"
              value={iconSet}
              onChange={(event) => setIconSet(event.currentTarget.value)}
              options={iconOptions}
            />
          </SidebarSection>

          <SidebarSection title="Radius">
            <div className="grid grid-cols-5 gap-1">
              {RADIUS_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setRadius(option)}
                  className={cn(
                    "rounded-md border px-2 py-1.5 text-[11px] font-bold uppercase transition-colors",
                    radius === option
                      ? "border-primary bg-primary text-white"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-300 dark:hover:bg-[#161b22]",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
          </SidebarSection>

          <details className="group border-t border-slate-200 pt-5 dark:border-[#1f2937]">
            <summary className="flex cursor-pointer list-none items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Components ({components.length})
              <span className="material-symbols-outlined text-[18px] transition-transform group-open:rotate-180">expand_more</span>
            </summary>
            <div className="mt-4 space-y-3">
              <div className="flex flex-wrap gap-1.5">
                {["All", ...Object.keys(COMPONENT_CATEGORIES)].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setComponentCategory(category)}
                    className={cn(
                      "rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors",
                      componentCategory === category
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-400 dark:hover:bg-[#161b22]",
                    )}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {visibleComponents.map((component) => {
                  const selected = components.includes(component);
                  return (
                    <button
                      key={component}
                      type="button"
                      onClick={() => toggleComponent(component)}
                      className={cn(
                        "rounded-lg border px-2.5 py-2 text-left text-xs font-semibold transition-colors",
                        selected
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-[#1f2937] dark:text-slate-300 dark:hover:bg-[#161b22]",
                      )}
                    >
                      {component}
                    </button>
                  );
                })}
              </div>
            </div>
          </details>

          <SidebarSection title="Actions">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={shuffleVisualConfig} className="gap-1.5">
                <span className="material-symbols-outlined text-[16px]">shuffle</span>
                Shuffle
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPresetDialogOpen(true)} className="gap-1.5">
                <span className="material-symbols-outlined text-[16px]">upload</span>
                Open Preset
              </Button>
            </div>
          </SidebarSection>
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-5 dark:border-[#1f2937] dark:bg-[#0b0e14]">
        <Button className="w-full" onClick={onOpenCreateModal}>
          Create Project
        </Button>
      </div>

      <Dialog open={presetDialogOpen} onClose={() => setPresetDialogOpen(false)} size="md">
        <Dialog.Header>
          <Dialog.Title>Open Preset</Dialog.Title>
          <Dialog.Description>Paste an encoded preset string to hydrate the configurator.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Content>
          <textarea
            value={presetInput}
            onChange={(event) => {
              setPresetInput(event.currentTarget.value);
              setPresetError("");
            }}
            placeholder="eyJ..."
            className="min-h-32 w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-hidden transition-all placeholder:text-slate-400 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-[#1f2937] dark:bg-[#0d1117] dark:text-white"
          />
          {presetError && <p className="mt-2 text-xs text-red-500 dark:text-red-400">{presetError}</p>}
        </Dialog.Content>
        <Dialog.Footer>
          <Button variant="ghost" onClick={() => setPresetDialogOpen(false)}>Cancel</Button>
          <Button onClick={applyPresetInput}>Apply Preset</Button>
        </Dialog.Footer>
      </Dialog>
    </aside>
  );
}

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
}

function SidebarSection({ title, children }: SidebarSectionProps) {
  return (
    <section className="border-t border-slate-200 pt-5 dark:border-[#1f2937]">
      <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</h3>
      {children}
    </section>
  );
}

interface ColorControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorControl({ label, value, onChange }: ColorControlProps) {
  return (
    <label className="grid grid-cols-[64px_32px_1fr] items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
      <span>{label}</span>
      <input
        type="color"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="h-8 w-8 cursor-pointer rounded-md border border-slate-200 bg-transparent p-0.5 dark:border-[#1f2937]"
        aria-label={`${label} color`}
      />
      <Input
        size="sm"
        value={value}
        onChange={(event) => onChange(event.currentTarget.value)}
        className="min-w-0"
      />
    </label>
  );
}

function pickRandom<T>(items: T[]): T {
  const item = items[Math.floor(Math.random() * items.length)];
  if (item === undefined) {
    throw new Error("Cannot pick from an empty list");
  }
  return item;
}
