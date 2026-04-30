"use client";

import { Card } from "@/ui/Card";
import { Search, X, Check } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/ui/Input";
import { useState, useMemo } from "react";

// Component icons mapping (simplified - using first letter or simple indicators)
const getComponentIcon = (name: string) => {
  const firstChar = name.charAt(0);
  return firstChar;
};

const getComponentColor = (name: string) => {
  const colors = [
    "bg-[#4628f1]", "bg-[#8b5cf6]", "bg-[#a78bfa]", "bg-[#a855f7]",
    "bg-[#3b82f6]", "bg-[#ec4899]", "bg-[#10b981]", "bg-[#f97316]"
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

interface ComponentGridProps {
  components: string[];
  selected: string[];
  onToggle: (component: string) => void;
  categories: Record<string, string[]>;
}

export function ComponentGrid({
  components,
  selected,
  onToggle,
  categories,
}: ComponentGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter components by search and category
  const filteredComponents = useMemo(() => {
    let filtered = components;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((c) =>
        categories[selectedCategory]?.includes(c)
      );
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [components, categories, selectedCategory, searchQuery]);

  // Get selected count per category
  const getCategoryCount = (category: string) => {
    return categories[category]?.filter((c) => selected.includes(c)).length || 0;
  };

  const hasActiveFilters = searchQuery || selectedCategory;

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#71717a]" />
        <Input
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={cn(
            "pl-11 pr-10 bg-[#171717] border-[#333333] text-[#ededed]",
            "placeholder:text-[#71717a] focus:border-[#4628f1] transition-colors"
          )}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#71717a] hover:text-[#ededed] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "text-xs px-4 py-2 rounded-full font-medium transition-all duration-300",
            "hover:scale-105 active:scale-95",
            !selectedCategory
              ? "bg-[#4628f1] text-white shadow-lg shadow-[#4628f1]/20"
              : "bg-[#171717] text-[#a1a1aa] border border-[#333333] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
          )}
        >
          All ({components.length})
        </button>
        {Object.entries(categories).map(([category, _comps]) => {
          const count = getCategoryCount(category);
          const isActive = selectedCategory === category;

          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "text-xs px-4 py-2 rounded-full font-medium transition-all duration-300",
                "hover:scale-105 active:scale-95 relative",
                isActive
                  ? "bg-[#8b5cf6] text-white shadow-lg shadow-[#8b5cf6]/20"
                  : "bg-[#171717] text-[#a1a1aa] border border-[#333333] hover:border-[#8b5cf6] hover:text-[#8b5cf6]"
              )}
            >
              {category} ({count})
              {count > 0 && !isActive && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#4628f1] rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Component Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredComponents.map((component, index) => {
          const isSelected = selected.includes(component);
          const iconColor = getComponentColor(component);

          return (
            <button
              key={component}
              onClick={() => onToggle(component)}
              className={cn(
                "group relative transition-all duration-300",
                "hover:scale-[1.03] hover:-translate-y-1"
              )}
              style={{ animationDelay: `${index * 20}ms` }}
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
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#4628f1]/5 via-transparent to-[#8b5cf6]/5" />

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute -top-1.5 -right-1.5 bg-[#4628f1] text-white rounded-full p-1 shadow-lg z-10 animate-scale-in">
                    <Check className="w-3 h-3" />
                  </div>
                )}

                <div className="relative z-10">
                  {/* Icon badge */}
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-all duration-300",
                    iconColor,
                    isSelected ? "ring-2 ring-white/20" : "opacity-70 group-hover:opacity-100"
                  )}>
                    <span className="text-white font-bold text-lg font-['Space_Grotesk']">
                      {getComponentIcon(component)}
                    </span>
                  </div>

                  {/* Component name */}
                  <p className={cn(
                    "font-medium text-sm transition-colors duration-300",
                    isSelected ? "text-[#4628f1]" : "text-[#ededed] group-hover:text-[#8b5cf6]"
                  )}>
                    {component}
                  </p>

                  {/* Selection count badge */}
                  {isSelected && (
                    <span className="inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full bg-[#4628f1]/10 text-[#4628f1] font-medium">
                      Selected
                    </span>
                  )}
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredComponents.length === 0 && (
        <div className="text-center py-16 animate-stagger-1">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#171717] border-2 border-[#333333] mb-4">
            <Search className="h-6 w-6 text-[#71717a]" />
          </div>
          <p className="text-[#a1a1aa] mb-2">No components found</p>
          <p className="text-sm text-[#71717a] mb-4">
            Try adjusting your search or filters
          </p>
          {hasActiveFilters && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
              className="text-sm text-[#4628f1] hover:text-[#ff5252] font-medium transition-colors"
            >
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
