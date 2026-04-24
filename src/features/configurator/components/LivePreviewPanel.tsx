"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/ui/Card";
import { Button } from "@/ui/Button";
import { Input } from "@/ui/Input";
import { Badge } from "@/ui/Badge";
import { Alert } from "@/ui/Alert";
import { Dialog } from "@/ui/Dialog";
import { Select } from "@/ui/Select";
import { Tabs } from "@/ui/Tabs";
import { Moon, Sun, Monitor, Smartphone, Sparkles } from "lucide-react";
import { useWizardStore } from "../stores/useWizardStore";
import {
  getStyleProperties,
  loadGoogleFonts,
} from "../lib";
import { cn } from "@/shared/utils/cn";

export function LivePreviewPanel() {
  const { style, colors, fonts, radius } = useWizardStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tabValue, setTabValue] = useState("tab1");
  const [selectValue, setSelectValue] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const styleRef = useRef<HTMLStyleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get style preset colors for button styling
  const styleProps = getStyleProperties(style);
  const stylePrimary = styleProps["--color-primary"];
  const styleSecondary = styleProps["--color-secondary"];
  const styleAccent = styleProps["--color-accent"];

  // Apply style properties and fonts
  useEffect(() => {
    const styleProps = getStyleProperties(style);

    if (styleRef.current) {
      const css = `
        .preview-container {
          /* Use style preset colors for components */
          --style-primary: ${styleProps["--color-primary"]};
          --style-secondary: ${styleProps["--color-secondary"]};
          --style-accent: ${styleProps["--color-accent"]};

          /* Map wizard colors to CSS variables */
          --wizard-brand: ${colors.brand};
          --wizard-accent: ${colors.accent};
          --wizard-chart: ${colors.chart};
          --wizard-base: ${colors.base};
          --color-primary: ${styleProps["--color-primary"]};
          --radius: ${getRadiusValue(radius)};
          --font-header: "${fonts.header}";
          --font-body: "${fonts.body}";
          font-family: var(--font-body), sans-serif;
        }
        .preview-container h1, .preview-container h2,
        .preview-container h3, .preview-container h4,
        .preview-container h5, .preview-container h6 {
          font-family: var(--font-header), sans-serif;
        }
        ${!darkMode ? `
          .preview-container {
            background: #ffffff;
            color: #0f172a;
            border-color: #e2e8f0;
          }
          .preview-container button[variant="primary"],
          .preview-container button.bg-primary {
            color: white !important;
          }
        ` : ""}
      `;
      styleRef.current.innerHTML = css;
    }

    if (containerRef.current) {
      // Apply style properties (spacing, typography, colors, etc.)
      Object.entries(styleProps).forEach(([key, value]) => {
        containerRef.current!.style.setProperty(key, value);
      });

      // Set custom color variables
      containerRef.current.style.setProperty("--wizard-brand", colors.brand);
      containerRef.current.style.setProperty("--wizard-accent", colors.accent);
      containerRef.current.style.setProperty("--style-primary", styleProps["--color-primary"]);
      containerRef.current.style.setProperty("--style-secondary", styleProps["--color-secondary"]);
      containerRef.current.style.setProperty("--style-accent", styleProps["--color-accent"]);
      containerRef.current.style.setProperty("--font-header", fonts.header);
      containerRef.current.style.setProperty("--font-body", fonts.body);
    }
  }, [style, colors, fonts, radius, darkMode]);

  // Load fonts
  useEffect(() => {
    loadGoogleFonts(fonts.header, fonts.body);
  }, [fonts]);

  return (
    <>
      <style ref={styleRef} />

      {/* Preview Controls */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={darkMode ? "primary" : "outline"}
            onClick={() => setDarkMode(!darkMode)}
            className={cn(
              "gap-2 transition-all duration-300",
              darkMode
                ? "bg-[#4628f1] hover:bg-[#ff5252] text-white"
                : "bg-[#171717] border-[#333333] text-[#ededed] hover:bg-[#1f1f1f]"
            )}
          >
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            {darkMode ? "Dark" : "Light"}
          </Button>
          <Button
            size="sm"
            variant={device === "desktop" ? "primary" : "outline"}
            onClick={() => setDevice(device === "desktop" ? "mobile" : "desktop")}
            className={cn(
              "gap-2 transition-all duration-300",
              device === "desktop"
                ? "bg-[#8b5cf6] hover:bg-[#0d9488] text-white"
                : "bg-[#171717] border-[#333333] text-[#ededed] hover:bg-[#1f1f1f]"
            )}
          >
            {device === "desktop" ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            {device === "desktop" ? "Desktop" : "Mobile"}
          </Button>
        </div>
        <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-[#8b5cf6]/10 text-[#8b5cf6] font-medium border border-[#8b5cf6]/20">
          <Sparkles className="w-3 h-3 animate-pulse" />
          Live
        </span>
      </div>

      {/* Preview Container - Glassmorphism */}
      <div
        ref={containerRef}
        className={cn(
          "preview-container rounded-2xl p-6 border-2 transition-all duration-500 relative overflow-hidden",
          "backdrop-blur-xl bg-opacity-80",
          darkMode
            ? "bg-[#0a0a0a]/90 border-[#333333] shadow-2xl"
            : "bg-white/90 border-gray-200 shadow-xl"
        )}
      >
        {/* Animated gradient mesh background */}
        <div className={cn(
          "absolute inset-0 transition-opacity duration-300",
          darkMode ? "opacity-30" : "opacity-10"
        )}>
          <div className="absolute inset-0 bg-gradient-to-br from-[#4628f1]/10 via-transparent to-[#8b5cf6]/10 animate-float" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#a78bfa]/5 via-transparent to-[#8b5cf6]/5 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        {/* Content scaled based on device */}
        <div className={cn(
          "relative z-10 transition-all duration-300",
          device === "mobile" && "max-w-sm mx-auto"
        )}>
          {/* Button Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Buttons</h4>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                className="relative overflow-hidden"
                style={{
                  backgroundColor: darkMode ? stylePrimary : adjustColorForLight(stylePrimary),
                  borderColor: darkMode ? stylePrimary : adjustColorForLight(stylePrimary),
                  color: shouldUseWhiteText(stylePrimary) ? 'white' : darkMode ? 'white' : '#0f172a'
                } as React.CSSProperties}
              >
                Primary
              </Button>
              <Button
                variant="secondary"
                style={{
                  backgroundColor: darkMode ? styleSecondary : adjustColorForLight(styleSecondary),
                  color: shouldUseWhiteText(styleSecondary) ? 'white' : darkMode ? 'white' : '#0f172a'
                } as React.CSSProperties}
              >
                Secondary
              </Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          {/* Input Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Inputs</h4>
            <div className="space-y-3">
              <Input
                placeholder="Enter text..."
                style={{
                  '--tw-ring-color': stylePrimary,
                  '--tw-ring-opacity': '0.2'
                } as React.CSSProperties}
                className="focus:border-primary focus:ring-primary/20"
              />
              <Input placeholder="Disabled" disabled />
            </div>
          </div>

          {/* Badge Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Badges</h4>
            <div className="flex flex-wrap gap-3">
              <div style={{ backgroundColor: stylePrimary, color: 'white' }} className="inline-flex items-center font-medium rounded-full text-xs px-2.5 py-0.5">
                Default
              </div>
              <Badge variant="success">Success</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="error">Error</Badge>
            </div>
          </div>

          {/* Alert Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Alerts</h4>
            <div className="space-y-3">
              <div
                role="alert"
                className="rounded-xl border p-4"
                style={{
                  backgroundColor: darkMode ? stylePrimary + '/20' : adjustColorForLight(stylePrimary) + '/20',
                  borderColor: stylePrimary,
                  color: darkMode ? stylePrimary : adjustColorForLight(stylePrimary)
                } as React.CSSProperties}
              >
                Info alert with important information.
              </div>
              <Alert variant="success">Success alert confirming action completed.</Alert>
            </div>
          </div>

          {/* Dialog Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Dialog</h4>
            <Button variant="outline" onClick={() => setDialogOpen(true)}>
              Open Dialog
            </Button>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
              <Dialog.Header>
                <Dialog.Title>Preview Dialog</Dialog.Title>
              </Dialog.Header>
              <Dialog.Content>
                <Dialog.Description>
                  This is a preview of how dialogs will look with your selected
                  style.
                </Dialog.Description>
              </Dialog.Content>
              <div className="px-6 py-4">
                <p className="text-sm">
                  Dialogs are modal overlays that require user interaction.
                </p>
                <Button
                  onClick={() => setDialogOpen(false)}
                  className="mt-4"
                  style={{
                    backgroundColor: stylePrimary,
                    borderColor: stylePrimary
                  } as React.CSSProperties}
                >
                  Close
                </Button>
              </div>
            </Dialog>
          </div>

          {/* Select Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Select</h4>
            <Select
              value={selectValue}
              onChange={(e) => setSelectValue((e.target as HTMLSelectElement).value)}
              placeholder="Choose option..."
              style={{
                '--tw-ring-color': stylePrimary,
                '--tw-ring-opacity': '0.2'
              } as React.CSSProperties}
              className="focus:border-primary focus:ring-primary/20"
              options={[
                { value: "1", label: "Option 1" },
                { value: "2", label: "Option 2" },
                { value: "3", label: "Option 3" },
              ]}
            />
          </div>

          {/* Tabs Preview */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-3 opacity-70">Tabs</h4>
            <Tabs value={tabValue} onChange={setTabValue}>
              <Tabs.List className="border-b-2" style={{ borderColor: stylePrimary + '/30' } as React.CSSProperties}>
                <div className="flex gap-4">
                  <button
                    onClick={() => setTabValue("tab1")}
                    className="text-sm font-medium transition-all px-4 py-2.5 -mb-px border-b-2"
                    style={{
                      borderColor: tabValue === "tab1" ? stylePrimary : 'transparent',
                      color: tabValue === "tab1" ? stylePrimary : 'inherit',
                      opacity: tabValue === "tab1" ? '1' : '0.6'
                    } as React.CSSProperties}
                  >
                    Tab 1
                  </button>
                  <button
                    onClick={() => setTabValue("tab2")}
                    className="text-sm font-medium transition-all px-4 py-2.5 -mb-px border-b-2"
                    style={{
                      borderColor: tabValue === "tab2" ? stylePrimary : 'transparent',
                      color: tabValue === "tab2" ? stylePrimary : 'inherit',
                      opacity: tabValue === "tab2" ? '1' : '0.6'
                    } as React.CSSProperties}
                  >
                    Tab 2
                  </button>
                  <button
                    onClick={() => setTabValue("tab3")}
                    className="text-sm font-medium transition-all px-4 py-2.5 -mb-px border-b-2"
                    style={{
                      borderColor: tabValue === "tab3" ? stylePrimary : 'transparent',
                      color: tabValue === "tab3" ? stylePrimary : 'inherit',
                      opacity: tabValue === "tab3" ? '1' : '0.6'
                    } as React.CSSProperties}
                  >
                    Tab 3
                  </button>
                </div>
              </Tabs.List>
              <Tabs.Content value={tabValue} className="mt-4">
                <p className="text-sm">Content for {tabValue}</p>
              </Tabs.Content>
            </Tabs>
          </div>

          {/* Card Preview */}
          <div>
            <h4 className="text-sm font-medium mb-3 opacity-70">Cards</h4>
            <Card
              className="p-4"
              style={{
                borderColor: stylePrimary + '/30',
                backgroundColor: darkMode ? '' : '#ffffff'
              } as React.CSSProperties}
            >
              <h5 className="font-semibold mb-2" style={{ color: stylePrimary }}>Card Title</h5>
              <p className="text-sm opacity-70">
                Cards are versatile containers for grouping related content.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

function getRadiusValue(radius: string): string {
  const radii: Record<string, string> = {
    none: "0",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  };
  return radii[radius] ?? "0.5rem";
}

// Helper function to determine if a color should use white text
function shouldUseWhiteText(hexColor: string): boolean {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}

// Helper function to adjust color for light mode (add transparency or darken)
function adjustColorForLight(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // If color is already dark, keep it as is for light mode
  if (luminance < 0.5) {
    return hexColor;
  }

  // If color is light, darken it for better contrast on white background
  const factor = 0.8;
  const newR = Math.floor(r * factor);
  const newG = Math.floor(g * factor);
  const newB = Math.floor(b * factor);

  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}
