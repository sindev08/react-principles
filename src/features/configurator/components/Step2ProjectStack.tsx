"use client";

import { useState } from "react";
import { Card } from "@/ui/Card";
import { Switch } from "@/ui/Switch";
import { useWizardStore } from "../stores/useWizardStore";
import { cn } from "@/shared/utils/cn";
import {
  Database,
  Server,
  Zap,
  FileText,
  GitBranch,
  Globe,
  Check,
} from "lucide-react";

export function Step2ProjectStack() {
  const {
    framework,
    setFramework,
    toggleStateManagement,
    toggleDataFetching,
    toggleForms,
    toggleMonorepo,
    toggleRtl,
    stateManagement,
    dataFetching,
    forms,
    monorepo,
    rtl,
  } = useWizardStore();

  const [hoveredFramework, setHoveredFramework] = useState<string | null>(null);

  const frameworks = [
    {
      id: "nextjs",
      name: "Next.js",
      description: "React framework with App Router, RSC, and built-in routing",
      icon: Server,
      features: ["App Router", "Server Components", "File-based routing", "API routes"],
      color: "#ffffff",
    },
    {
      id: "vite",
      name: "Vite",
      description: "Fast build tool with React, ideal for SPA development",
      icon: Zap,
      features: ["Lightning fast HMR", "Optimized build", "Framework agnostic", "Rich plugin ecosystem"],
      color: "#646cff",
    },
  ] as const;

  const stackFeatures = [
    {
      id: "stateManagement",
      title: "State Management",
      description: "Zustand for global state management",
      icon: Database,
      checked: stateManagement,
      onChange: toggleStateManagement,
      recommended: true,
      color: "bg-[#3b82f6]",
    },
    {
      id: "dataFetching",
      title: "Data Fetching",
      description: "TanStack Query for server state management",
      icon: Server,
      checked: dataFetching,
      onChange: toggleDataFetching,
      recommended: true,
      color: "bg-[#a855f7]",
    },
    {
      id: "forms",
      title: "Forms",
      description: "React Hook Form + Zod for form validation",
      icon: FileText,
      checked: forms,
      onChange: toggleForms,
      recommended: true,
      color: "bg-[#10b981]",
    },
    {
      id: "monorepo",
      title: "Monorepo",
      description: "Configure for Turborepo/pnpm workspace setup",
      icon: GitBranch,
      checked: monorepo,
      onChange: toggleMonorepo,
      recommended: false,
      color: "bg-[#f97316]",
    },
    {
      id: "rtl",
      title: "RTL Support",
      description: "Add RTL (right-to-left) layout support",
      icon: Globe,
      checked: rtl,
      onChange: toggleRtl,
      recommended: false,
      color: "bg-[#ec4899]",
    },
  ] as const;

  return (
    <div className="space-y-10">
      {/* Framework Picker */}
      <section className="animate-stagger-1">
        <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-[#ededed]">Framework</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {frameworks.map((fw) => {
            const Icon = fw.icon;
            const isSelected = framework === fw.id;
            const isHovered = hoveredFramework === fw.id;

            return (
              <button
                key={fw.id}
                onClick={() => setFramework(fw.id)}
                onMouseEnter={() => setHoveredFramework(fw.id)}
                onMouseLeave={() => setHoveredFramework(null)}
                className={cn(
                  "relative w-full text-left transition-all duration-300 group",
                  "hover:scale-[1.02] hover:-translate-y-1"
                )}
              >
                <Card
                  className={cn(
                    "p-6 border-2 transition-all duration-300 overflow-hidden relative",
                    "bg-[#171717] border-[#333333]",
                    isSelected
                      ? "border-[#4628f1] bg-[#4628f1]/5 ring-2 ring-[#4628f1]/20 shadow-xl"
                      : "hover:border-[#8b5cf6]/50 shadow-lg"
                  )}
                >
                  {/* Animated gradient background */}
                  <div className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300",
                    "bg-gradient-to-br from-[#4628f1]/5 via-transparent to-[#8b5cf6]/5",
                    isHovered && "opacity-100"
                  )} />

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 bg-[#4628f1] text-white rounded-full p-1.5 shadow-lg z-10">
                      <Check className="w-4 h-4" />
                    </div>
                  )}

                  <div className="relative z-10">
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        "p-3 rounded-xl transition-all duration-300",
                        isSelected
                          ? "bg-[#4628f1]/20 ring-2 ring-[#4628f1]/30"
                          : isHovered
                          ? "bg-[#8b5cf6]/20 ring-2 ring-[#8b5cf6]/30"
                          : "bg-[#1f1f1f]"
                      )}>
                        <Icon className={cn(
                          "w-7 h-7 transition-all duration-300",
                          isSelected ? "text-[#4628f1]" : isHovered ? "text-[#8b5cf6]" : "text-[#a1a1aa]"
                        )} />
                      </div>
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-bold text-xl mb-2 font-['Space_Grotesk'] transition-colors duration-300",
                          isSelected ? "text-[#4628f1]" : "text-[#ededed]"
                        )}>
                          {fw.name}
                        </h4>
                        <p className="text-sm text-[#a1a1aa] mb-4 leading-relaxed">
                          {fw.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {fw.features.map((feature, i) => (
                            <span
                              key={feature}
                              className={cn(
                                "text-xs px-2.5 py-1 rounded-full font-medium transition-all duration-300",
                                "bg-[#1f1f1f] text-[#71717a]",
                                "animate-stagger-" + ((i % 5) + 1)
                              )}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </section>

      {/* Stack Features */}
      <section className="animate-stagger-2">
        <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-[#ededed]">Stack Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stackFeatures.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Card
                key={feature.id}
                className={cn(
                  "p-5 border-2 transition-all duration-300 relative overflow-hidden group",
                  "bg-[#171717] border-[#333333]",
                  feature.checked
                    ? "border-[#4628f1] bg-[#4628f1]/5 ring-2 ring-[#4628f1]/20 shadow-lg"
                    : "hover:border-[#8b5cf6]/50"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[#4628f1]/5 via-transparent to-[#8b5cf6]/5" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "p-2.5 rounded-xl transition-all duration-300 flex-shrink-0",
                          feature.checked ? feature.color : "bg-[#1f1f1f]",
                          feature.checked && "ring-2 ring-white/20 shadow-lg"
                        )}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={cn(
                          "font-bold text-base leading-tight transition-colors duration-300",
                          feature.checked ? "text-[#4628f1]" : "text-[#ededed]"
                        )}>
                          {feature.title}
                        </h4>
                        {feature.recommended && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] font-medium uppercase tracking-wide inline-block mt-1">
                            Recommended
                          </span>
                        )}
                        <p className="text-sm text-[#a1a1aa] leading-relaxed mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={feature.checked}
                      onChange={feature.onChange}
                      className="mt-1 flex-shrink-0"
                    />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
