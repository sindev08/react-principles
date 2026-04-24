"use client";

import { useState } from "react";
import { Card } from "@/ui/Card";
import { Check, Palette } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { PresetColors } from "@/features/configurator/data";

interface ColorPaletteGridProps {
  colors: PresetColors;
  onChange: (colors: PresetColors) => void;
}

const CURATED_PALETTES: Array<{
  name: string;
  colors: PresetColors;
  description: string;
}> = [
  {
    name: "Ocean",
    description: "Calm blues and greens",
    colors: {
      base: "#0f172a",
      brand: "#3b82f6",
      accent: "#06b6d4",
      chart: "#10b981",
    },
  },
  {
    name: "Sunset",
    description: "Warm oranges and pinks",
    colors: {
      base: "#1c1917",
      brand: "#f97316",
      accent: "#ec4899",
      chart: "#8b5cf6",
    },
  },
  {
    name: "Forest",
    description: "Natural greens and teals",
    colors: {
      base: "#14532d",
      brand: "#22c55e",
      accent: "#84cc16",
      chart: "#8b5cf6",
    },
  },
  {
    name: "Berry",
    description: "Rich purples and reds",
    colors: {
      base: "#2e1065",
      brand: "#a855f7",
      accent: "#ec4899",
      chart: "#f43f5e",
    },
  },
  {
    name: "Monochrome",
    description: "Clean grayscale",
    colors: {
      base: "#09090b",
      brand: "#525252",
      accent: "#a3a3a3",
      chart: "#404040",
    },
  },
  {
    name: "Corporate",
    description: "Professional blues",
    colors: {
      base: "#172554",
      brand: "#1e40af",
      accent: "#1d4ed8",
      chart: "#0891b2",
    },
  },
];

export function ColorPaletteGrid({
  colors,
  onChange,
}: ColorPaletteGridProps) {
  const [hoveredPalette, setHoveredPalette] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {CURATED_PALETTES.map((palette) => {
        const isSelected =
          colors.base === palette.colors.base &&
          colors.brand === palette.colors.brand &&
          colors.accent === palette.colors.accent &&
          colors.chart === palette.colors.chart;

        const isHovered = hoveredPalette === palette.name;

        return (
          <button
            key={palette.name}
            onClick={() => onChange(palette.colors)}
            onMouseEnter={() => setHoveredPalette(palette.name)}
            onMouseLeave={() => setHoveredPalette(null)}
            className={cn(
              "group relative",
              "transition-all duration-300",
              "hover:scale-[1.03] hover:-translate-y-1"
            )}
          >
            <Card
              className={cn(
                "p-4 border-2 transition-all duration-300 overflow-hidden relative",
                "bg-[#171717] border-[#333333]",
                isSelected
                  ? "border-[#4628f1] bg-[#4628f1]/5 ring-2 ring-[#4628f1]/20 shadow-lg"
                  : "hover:border-[#8b5cf6]/50 shadow-md"
              )}
            >
              {/* Animated gradient background */}
              <div
                className={cn(
                  "absolute inset-0 opacity-0 transition-opacity duration-300",
                  "bg-gradient-to-br from-[#4628f1]/5 via-transparent to-[#8b5cf6]/5",
                  isHovered && "opacity-100"
                )}
              />

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute -top-2 -right-2 bg-[#4628f1] text-white rounded-full p-1.5 shadow-lg z-10">
                  <Check className="w-3 h-3" />
                </div>
              )}

              {/* Hover: Palette icon */}
              {!isSelected && isHovered && (
                <div className="absolute -top-2 -right-2 bg-[#8b5cf6] text-white rounded-full p-1.5 shadow-lg z-10 animate-scale-in">
                  <Palette className="w-3 h-3" />
                </div>
              )}

              <div className="relative z-10">
                {/* Color swatches - expand on hover */}
                <div className="flex gap-1.5 mb-3">
                  {Object.values(palette.colors).map((color, i) => (
                    <div
                      key={i}
                      className="relative transition-all duration-300"
                      style={{
                        width: isHovered || isSelected ? '28px' : '20px',
                        height: isHovered || isSelected ? '28px' : '20px',
                      }}
                    >
                      <div
                        className={cn(
                          "rounded-full border-2 border-[#333333] shadow-md",
                          "transition-all duration-300 hover:scale-110"
                        )}
                        style={{
                          backgroundColor: color,
                          transform: isHovered ? `translateY(${(i % 2 === 0 ? -2 : 2)}px)` : 'translateY(0)',
                        }}
                      />
                      {/* Glow effect on hover */}
                      {isHovered && (
                        <div
                          className="absolute inset-0 rounded-full opacity-50 blur-md"
                          style={{ backgroundColor: color }}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Palette name */}
                <p className="text-sm font-bold font-['Space_Grotesk'] text-[#ededed] mb-1">
                  {palette.name}
                </p>

                {/* Description - show on hover */}
                <p
                  className={cn(
                    "text-xs transition-all duration-300 overflow-hidden",
                    isHovered || isSelected ? "max-h-6 opacity-100 text-[#a1a1aa]" : "max-h-0 opacity-0"
                  )}
                >
                  {palette.description}
                </p>
              </div>

              {/* Animated border glow */}
              {isHovered && !isSelected && (
                <div className="absolute inset-0 rounded-lg animate-glow-pulse pointer-events-none" />
              )}
            </Card>
          </button>
        );
      })}
    </div>
  );
}
