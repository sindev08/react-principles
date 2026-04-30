"use client";

import { useState } from "react";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Check, Copy, Download, Share2, X, Palette, Code, Database, Globe, Layers } from "lucide-react";
import { useWizardStore } from "../stores/useWizardStore";
import { encodePreset } from "../lib";
import { cn } from "@/shared/utils/cn";

export function Step3Generate() {
  const wizardState = useWizardStore();
  const [copied, setCopied] = useState<"cli" | "url" | null>(null);

  // Encode the preset
  const encodedPreset = encodePreset(wizardState.getPresetConfig());

  // Generate CLI command and share URL
  const cliCommand = `npx react-principles create my-app --preset ${encodedPreset}`;
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/create?preset=${encodedPreset}`;

  // Get selections summary
  const selections = {
    style: wizardState.style,
    framework: wizardState.framework,
    stateManagement: wizardState.stateManagement,
    dataFetching: wizardState.dataFetching,
    forms: wizardState.forms,
    monorepo: wizardState.monorepo,
    rtl: wizardState.rtl,
    componentCount: wizardState.components.length,
    iconSet: wizardState.iconSet,
  };

  const copyToClipboard = async (text: string, type: "cli" | "url") => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleStartOver = () => {
    wizardState.resetAll();
    wizardState.setCurrentStep("visual");
  };

  return (
    <div className="space-y-8 animate-stagger-1">
      {/* Configuration Summary */}
      <div className="animate-stagger-1">
        <h3 className="text-2xl font-bold mb-6 font-['Space_Grotesk'] text-[#ededed]">Configuration Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <SummaryCard
            icon={<Palette className="w-4 h-4" />}
            label="Style"
            value={capitalize(selections.style)}
            color="bg-[#4628f1]/10 text-[#4628f1]"
          />
          <SummaryCard
            icon={<Code className="w-4 h-4" />}
            label="Framework"
            value={capitalize(selections.framework)}
            color="bg-[#8b5cf6]/10 text-[#8b5cf6]"
          />
          <SummaryCard
            icon={<Globe className="w-4 h-4" />}
            label="Icon Set"
            value={getIconSetName(selections.iconSet)}
            color="bg-[#a78bfa]/10 text-[#a78bfa]"
          />
          <SummaryCard
            icon={<Layers className="w-4 h-4" />}
            label="Components"
            value={`${selections.componentCount} selected`}
            color="bg-[#a855f7]/10 text-[#a855f7]"
          />
          <SummaryCard
            icon={<Database className="w-4 h-4" />}
            label="State Management"
            value={selections.stateManagement ? "Zustand" : "None"}
            color={selections.stateManagement ? "bg-[#3b82f6]/10 text-[#3b82f6]" : "bg-[#71717a]/10 text-[#71717a]"}
          />
          <SummaryCard
            icon={<Globe className="w-4 h-4" />}
            label="Data Fetching"
            value={selections.dataFetching ? "TanStack Query" : "None"}
            color={selections.dataFetching ? "bg-[#a855f7]/10 text-[#a855f7]" : "bg-[#71717a]/10 text-[#71717a]"}
          />
          <SummaryCard
            icon={<Copy className="w-4 h-4" />}
            label="Forms"
            value={selections.forms ? "RHF + Zod" : "None"}
            color={selections.forms ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#71717a]/10 text-[#71717a]"}
          />
          <SummaryCard
            icon={<Layers className="w-4 h-4" />}
            label="Monorepo"
            value={selections.monorepo ? "Yes" : "No"}
            color={selections.monorepo ? "bg-[#f97316]/10 text-[#f97316]" : "bg-[#71717a]/10 text-[#71717a]"}
          />
        </div>
      </div>

      {/* CLI Command */}
      <Card className={cn(
        "p-6 border-2 bg-[#171717] border-[#333333] transition-all duration-300 animate-stagger-2",
        "hover:border-[#4628f1]/50 hover:shadow-xl"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#ededed] mb-1">CLI Command</h3>
            <p className="text-sm text-[#a1a1aa]">
              Run this command in your terminal to generate your project
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(cliCommand, "cli")}
            className={cn(
              "gap-2 transition-all duration-300",
              "bg-[#1f1f1f] border-[#333333] text-[#ededed]",
              "hover:bg-[#4628f1] hover:border-[#4628f1] hover:text-white"
            )}
          >
            {copied === "cli" ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </Button>
        </div>
        <div className={cn(
          "bg-[#0a0a0a] p-5 rounded-xl font-mono text-sm border-2 transition-all duration-300",
          copied === "cli" ? "border-[#4628f1] shadow-lg shadow-[#4628f1]/20" : "border-[#333333] hover:border-[#4628f1]/50",
          "overflow-x-auto"
        )}>
          <code className="text-[#8b5cf6] break-all">
            <span className="text-[#a855f7]">npx</span> react-principles create <span className="text-[#a78bfa]">my-app</span> --preset {encodedPreset.slice(0, 30)}...
          </code>
        </div>
      </Card>

      {/* Share URL */}
      <Card className={cn(
        "p-6 border-2 bg-[#171717] border-[#333333] transition-all duration-300 animate-stagger-3",
        "hover:border-[#8b5cf6]/50 hover:shadow-xl"
      )}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-[#ededed] mb-1">Share URL</h3>
            <p className="text-sm text-[#a1a1aa]">
              Share this URL to let others generate the same configuration
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => copyToClipboard(shareUrl, "url")}
            className={cn(
              "gap-2 transition-all duration-300",
              "bg-[#1f1f1f] border-[#333333] text-[#ededed]",
              "hover:bg-[#8b5cf6] hover:border-[#8b5cf6] hover:text-white"
            )}
          >
            {copied === "url" ? (
              <>
                <Check className="w-4 h-4" /> Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy
              </>
            )}
          </Button>
        </div>
        <div className={cn(
          "bg-[#0a0a0a] p-5 rounded-xl font-mono text-sm border-2 transition-all duration-300 mb-4",
          copied === "url" ? "border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/20" : "border-[#333333] hover:border-[#8b5cf6]/50",
          "overflow-x-auto"
        )}>
          <code className="text-[#4628f1] break-all">
            {shareUrl}
          </code>
        </div>

        {/* Social Share Buttons */}
        <div className="flex gap-3">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const text = `Check out my React starter configuration!`;
              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`;
              window.open(url, "_blank");
            }}
            className={cn(
              "flex-1 gap-2 transition-all duration-300",
              "bg-[#1f1f1f] border-[#333333] text-[#ededed]",
              "hover:bg-[#000000] hover:border-[#ffffff] hover:text-white"
            )}
          >
            <X className="w-4 h-4" />
            <span>Tweet</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              alert("URL copied to clipboard!");
            }}
            className={cn(
              "flex-1 gap-2 transition-all duration-300",
              "bg-[#1f1f1f] border-[#333333] text-[#ededed]",
              "hover:bg-[#8b5cf6] hover:border-[#8b5cf6] hover:text-white"
            )}
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </Button>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 animate-stagger-4">
        <Button
          variant="destructive"
          onClick={handleStartOver}
          size="lg"
          className={cn(
            "flex-1 transition-all duration-300",
            "bg-[#f43f5e] hover:bg-[#e11d48] text-white font-semibold"
          )}
        >
          Start Over
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            const config = wizardState.getPresetConfig();
            const blob = new Blob([JSON.stringify(config, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `react-principles-config.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          size="lg"
          className={cn(
            "flex-1 gap-2 transition-all duration-300",
            "bg-[#171717] border-[#333333] text-[#ededed]",
            "hover:bg-[#10b981] hover:border-[#10b981] hover:text-white font-semibold"
          )}
        >
          <Download className="w-4 h-4" />
          <span>Download Config</span>
        </Button>
      </div>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}

function SummaryCard({ icon, label, value, color }: SummaryCardProps) {
  return (
    <Card className={cn(
      "p-4 border-2 bg-[#171717] border-[#333333] transition-all duration-300",
      "hover:scale-105 hover:-translate-y-1 hover:shadow-lg",
      "hover:border-[#4628f1]/50 group relative z-10"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg flex-shrink-0", color)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="text-xs text-[#71717a] font-medium uppercase tracking-wide mb-1">
            {label}
          </div>
          <div className="font-semibold text-[#ededed] text-sm truncate group-hover:text-[#4628f1] transition-colors leading-tight">
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function getIconSetName(iconSet: string): string {
  const names: Record<string, string> = {
    "material-symbols": "Material Symbols",
    lucide: "Lucide",
    ph: "Phosphor",
    heroicons: "Heroicons",
    tabler: "Tabler",
    fa: "Font Awesome",
    feather: "Feather",
    flowbite: "Flowbite",
  };
  return names[iconSet] || capitalize(iconSet);
}
