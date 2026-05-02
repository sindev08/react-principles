"use client";

import { memo, useState } from "react";
import { Card } from "@/ui/Card";
import { Check, Type } from "lucide-react";
import { cn } from "@/shared/utils/cn";

interface FontCardProps {
  family: string;
  category: string;
  selected: boolean;
  onSelect: () => void;
}

export const FontCard = memo(function FontCard({
  family,
  category,
  selected,
  onSelect,
}: FontCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Sample text for preview
  const sampleText = "Aa";

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
            : "hover:border-[#8b5cf6]/50"
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
        {selected && (
          <div className="absolute -top-2 -right-2 bg-[#4628f1] text-white rounded-full p-1.5 shadow-lg z-10">
            <Check className="w-3.5 h-3.5" />
          </div>
        )}

        {/* Hover icon */}
        {!selected && isHovered && (
          <div className="absolute -top-2 -right-2 bg-[#8b5cf6] text-white rounded-full p-1.5 shadow-lg z-10 animate-scale-in">
            <Type className="w-3.5 h-3.5" />
          </div>
        )}

        <div className="relative z-10">
          {/* Large animated character preview */}
          <div className="mb-3 relative overflow-hidden">
            <div
              className={cn(
                "text-5xl font-bold text-[#ededed] transition-all duration-300",
                isHovered && "scale-110"
              )}
              style={{ fontFamily: family }}
            >
              {sampleText}
            </div>
            {/* Animated underline */}
            <div
              className={cn(
                "h-0.5 bg-gradient-to-r from-[#4628f1] to-[#8b5cf6] transition-all duration-300",
                isHovered ? "w-full opacity-100" : "w-0 opacity-0"
              )}
            />
          </div>

          {/* Font name */}
          <p
            className={cn(
              "text-sm font-semibold mb-2 transition-all duration-300",
              isHovered ? "text-[#4628f1] translate-x-1" : "text-[#ededed]"
            )}
            style={{ fontFamily: family }}
          >
            {family}
          </p>

          {/* Sample text - show on hover */}
          <p
            className={cn(
              "text-xs transition-all duration-300 overflow-hidden leading-relaxed",
              isHovered || selected ? "max-h-12 opacity-100 text-[#a1a1aa]" : "max-h-0 opacity-0"
            )}
            style={{ fontFamily: family }}
          >
            The quick brown fox
          </p>

          {/* Category Badge */}
          <div className="inline-block mt-2">
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300",
              "bg-[#1f1f1f] text-[#71717a]",
              isHovered && "bg-[#8b5cf6]/10 text-[#8b5cf6]"
            )}>
              {category}
            </span>
          </div>

          {/* Weight preview - animate on hover */}
          <div
            className={cn(
              "flex gap-1 mt-3 transition-all duration-300 overflow-hidden",
              isHovered || selected ? "max-h-8 opacity-100" : "max-h-0 opacity-0"
            )}
          >
            {['R', 'M', 'B'].map((weight, i) => (
              <span
                key={weight}
                className="w-6 h-6 rounded flex items-center justify-center text-[10px] bg-[#1f1f1f] text-[#a1a1aa] animate-stagger-1"
                style={{
                  fontFamily: family,
                  fontWeight: weight === 'R' ? 400 : weight === 'M' ? 500 : 700,
                  animationDelay: `${i * 50}ms`
                }}
              >
                {weight}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </button>
  );
});
