"use client";

import { memo, useState } from "react";
import { Card } from "@/ui/Card";
import { Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import type { StylePreset } from "@/features/configurator/data";

interface StyleCardProps {
  preset: StylePreset;
  selected: boolean;
  onSelect: () => void;
}

export const StyleCard = memo(function StyleCard({
  preset,
  selected,
  onSelect,
}: StyleCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const config = {
    arc: {
      name: "Arc",
      description: "Rounded, friendly, generous spacing",
      colors: ["#3b82f6", "#8b5cf6", "#10b981"],
      borderRadius: "0.5rem",
      previewComponents: ["Button", "Card", "Input"],
    },
    edge: {
      name: "Edge",
      description: "Sharp, high-contrast, minimal decoration",
      colors: ["#0f172a", "#3b82f6", "#6366f1"],
      borderRadius: "0rem",
      previewComponents: ["Button", "Card", "Badge"],
    },
    soleil: {
      name: "Soleil",
      description: "Warm, editorial, expressive",
      colors: ["#a78bfa", "#ec4899", "#8b5cf6"],
      borderRadius: "0.375rem",
      previewComponents: ["Button", "Card", "Alert"],
    },
  };

  const style = config[preset];

  return (
    <button
      onClick={onSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "relative w-full text-left transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.03] hover:-translate-y-1",
        selected && "scale-[1.02] -translate-y-1"
      )}
    >
      <Card
        className={cn(
          "p-5 border-2 transition-all duration-300 overflow-hidden relative",
          "bg-[#171717] border-[#333333]",
          selected
            ? "border-[#4628f1] bg-[#4628f1]/5 ring-2 ring-[#4628f1]/20 shadow-lg"
            : "hover:border-[#4628f1]/50"
        )}
      >
        {/* Animated background gradient on hover */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-300",
            "bg-gradient-to-br from-[#4628f1]/5 via-transparent to-[#8b5cf6]/5",
            isHovered && "opacity-100"
          )}
        />

        {selected && (
          <div className="absolute -top-2 -right-2 bg-[#4628f1] text-white rounded-full p-1.5 shadow-lg z-10 animate-scale-in">
            <Check className="w-3.5 h-3.5" />
          </div>
        )}

        <div className="relative z-10">
          <h3 className="font-bold text-xl mb-2 font-['Space_Grotesk'] text-[#ededed]">
            {style.name}
          </h3>
          <p className="text-sm text-[#a1a1aa] mb-4 leading-relaxed">
            {style.description}
          </p>

          {/* Preview colors */}
          <div className="flex gap-2 mb-4">
            {style.colors.map((color, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-[#333333] shadow-md transition-transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  transform: isHovered ? `translateY(${(i - 1) * -4}px)` : 'translateY(0)',
                  transition: 'transform 0.3s ease'
                }}
              />
            ))}
          </div>

          {/* Hover reveal: Mini UI preview */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              isHovered || selected ? "max-h-24 opacity-100 mt-4" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex items-center gap-2 text-xs text-[#71717a] mb-2">
              <span className="font-semibold uppercase tracking-wider">Preview</span>
              <div className="flex-1 h-px bg-[#333333]" />
            </div>
            <div className="flex gap-2">
              {style.previewComponents.map((component, i) => (
                <span
                  key={component}
                  className={cn(
                    "px-2 py-1 rounded-md text-xs font-medium bg-[#1f1f1f] text-[#a1a1aa]",
                    "animate-stagger-" + ((i % 5) + 1)
                  )}
                  style={{ borderRadius: style.borderRadius }}
                >
                  {component}
                </span>
              ))}
            </div>
          </div>

          {/* Border radius preview */}
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xs text-[#71717a] font-medium">Radius:</span>
            <div
              className="w-16 h-10 bg-[#1f1f1f] border-2 border-[#333333] transition-all duration-300"
              style={{ borderRadius: style.borderRadius }}
            />
          </div>
        </div>
      </Card>
    </button>
  );
});
