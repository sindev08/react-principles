"use client";

import { Card } from "@/ui/Card";
import { Label } from "@/ui/Label";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { useWizardStore } from "../stores/useWizardStore";
import { getPopularFonts, getAllIconSets } from "../lib";
import { StyleCard } from "./StyleCard";
import { ColorPaletteGrid } from "./ColorPaletteGrid";
import { FontCard } from "./FontCard";
import { RadiusSelector } from "./RadiusSelector";
import { ComponentGrid } from "./ComponentGrid";

export function Step1VisualPreset() {
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
  } = useWizardStore();

  // Get available fonts and icon sets
  const popularFonts = getPopularFonts();
  const iconSets = getAllIconSets();

  // Available components
  const allComponents = [
    "Alert",
    "Avatar",
    "Badge",
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
    "Dropdown",
    "Input",
    "Label",
    "Pagination",
    "Popover",
    "Progress",
    "Radio",
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

  // Component categories
  const componentCategories: Record<string, string[]> = {
    Forms: ["Input", "Textarea", "Select", "Checkbox", "Radio", "Switch", "Slider", "Label"],
    Feedback: ["Alert", "Progress", "Skeleton", "Spinner", "Toast"],
    Navigation: ["Tabs", "Pagination", "Breadcrumb", "Command"],
    Overlays: ["Dialog", "Drawer", "Popover", "Tooltip", "Dropdown"],
    Data: ["DataTable", "Chart", "Calendar", "DatePicker"],
    Layout: ["Card", "Separator", "Collapsible", "Avatar", "Badge", "Carousel", "Button"],
  };

  return (
    <div className="space-y-8">
      {/* Style Preset Selection */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Style Preset</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(["arc", "edge", "soleil"] as const).map((preset) => (
            <StyleCard
              key={preset}
              preset={preset}
              selected={style === preset}
              onSelect={() => setStyle(preset)}
            />
          ))}
        </div>
      </section>

      {/* Colors */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Color Palette</h3>
          <span className="text-sm text-muted-foreground">
            {components.length} components selected
          </span>
        </div>

        {/* Curated Palettes */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-3">
            Quick presets
          </p>
          <ColorPaletteGrid colors={colors} onChange={setColors} />
        </div>

        {/* Custom Colors */}
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Custom colors
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorInput
              label="Base"
              value={colors.base}
              onChange={(value) => setColors({ ...colors, base: value })}
            />
            <ColorInput
              label="Brand"
              value={colors.brand}
              onChange={(value) => setColors({ ...colors, brand: value })}
            />
            <ColorInput
              label="Accent"
              value={colors.accent}
              onChange={(value) => setColors({ ...colors, accent: value })}
            />
            <ColorInput
              label="Chart"
              value={colors.chart}
              onChange={(value) => setColors({ ...colors, chart: value })}
            />
          </div>
        </div>
      </section>

      {/* Fonts */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Typography</h3>

        {/* Header Font */}
        <div className="mb-6">
          <Label className="text-sm font-medium mb-3">Header Font</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularFonts.map((font) => (
              <FontCard
                key={font.family}
                family={font.family}
                category={font.category}
                selected={fonts.header === font.family}
                onSelect={() => setFonts({ ...fonts, header: font.family })}
              />
            ))}
          </div>
        </div>

        {/* Body Font */}
        <div>
          <Label className="text-sm font-medium mb-3">Body Font</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {popularFonts.map((font) => (
              <FontCard
                key={font.family}
                family={font.family}
                category={font.category}
                selected={fonts.body === font.family}
                onSelect={() => setFonts({ ...fonts, body: font.family })}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Icon Set */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Icon Set</h3>
        <Select
          value={iconSet}
          onChange={(e) => setIconSet((e.target as HTMLSelectElement).value)}
          placeholder="Select icon set"
          options={iconSets.map((set) => ({ value: set.prefix, label: set.name }))}
        />
      </section>

      {/* Border Radius */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Border Radius</h3>
        <RadiusSelector value={radius} onChange={(val) => setRadius(val as any)} />
      </section>

      {/* Components */}
      <section>
        <h3 className="text-lg font-semibold mb-4">
          Components ({components.length} selected)
        </h3>
        <ComponentGrid
          components={allComponents}
          selected={components}
          onToggle={toggleComponent}
          categories={componentCategories}
        />
      </section>
    </div>
  );
}

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-10 rounded-lg cursor-pointer border-2 border-border transition-colors hover:border-primary/50"
        />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className="flex-1"
        />
      </div>
    </div>
  );
}
