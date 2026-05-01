"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Alert } from "@/ui/Alert";
import { Badge } from "@/ui/Badge";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Dialog } from "@/ui/Dialog";
import { Input } from "@/ui/Input";
import { Select } from "@/ui/Select";
import { Tabs } from "@/ui/Tabs";
import { getStyleProperties, loadGoogleFonts } from "../lib";
import { useWizardStore } from "../stores/useWizardStore";
import { DashboardPreview } from "./DashboardPreview";

export function LivePreviewPanel() {
  const { style, colors, fonts, radius } = useWizardStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [innerTab, setInnerTab] = useState("overview");
  const [selectValue, setSelectValue] = useState("");
  const styleRef = useRef<HTMLStyleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const styleProps = getStyleProperties(style);
  const stylePrimary = styleProps["--color-primary"];
  const styleSecondary = styleProps["--color-secondary"];

  useEffect(() => {
    const nextStyleProps = getStyleProperties(style);
    if (styleRef.current) {
      styleRef.current.innerHTML = `
        .preview-container {
          --style-primary: ${nextStyleProps["--color-primary"]};
          --style-secondary: ${nextStyleProps["--color-secondary"]};
          --style-accent: ${nextStyleProps["--color-accent"]};
          --wizard-brand: ${colors.brand};
          --wizard-accent: ${colors.accent};
          --wizard-chart: ${colors.chart};
          --wizard-base: ${colors.base};
          --color-primary: ${nextStyleProps["--color-primary"]};
          --radius: ${getRadiusValue(radius)};
          --font-header: "${fonts.header}";
          --font-body: "${fonts.body}";
          font-family: var(--font-body), sans-serif;
        }
        .preview-container h1,
        .preview-container h2,
        .preview-container h3,
        .preview-container h4,
        .preview-container h5,
        .preview-container h6 {
          font-family: var(--font-header), sans-serif;
        }
      `;
    }

    if (containerRef.current) {
      Object.entries(nextStyleProps).forEach(([key, value]) => {
        containerRef.current?.style.setProperty(key, value);
      });
      containerRef.current.style.setProperty("--wizard-brand", colors.brand);
      containerRef.current.style.setProperty("--wizard-accent", colors.accent);
      containerRef.current.style.setProperty("--wizard-chart", colors.chart);
      containerRef.current.style.setProperty("--wizard-base", colors.base);
      containerRef.current.style.setProperty("--font-header", fonts.header);
      containerRef.current.style.setProperty("--font-body", fonts.body);
    }
  }, [style, colors, fonts, radius]);

  useEffect(() => {
    loadGoogleFonts(fonts.header, fonts.body);
  }, [fonts]);

  return (
    <>
      <style ref={styleRef} />
      <div
        ref={containerRef}
        className="preview-container rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm dark:border-[#1f2937] dark:bg-[#0d1117] sm:p-6"
      >
        <Tabs value={activeTab} onChange={setActiveTab} variant="pills">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs.List>
              <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="components">Components</Tabs.Trigger>
            </Tabs.List>
            <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-500 dark:border-[#1f2937] dark:bg-[#161b22] dark:text-slate-400">
              Real-time preview
            </span>
          </div>

          <Tabs.Content value="dashboard" className="mt-0">
            <DashboardPreview />
          </Tabs.Content>

          <Tabs.Content value="components" className="mt-0">
            <div className="grid gap-5 xl:grid-cols-2">
              <PreviewSection title="Buttons">
                <div className="flex flex-wrap gap-3">
                  <Button style={buttonStyle(stylePrimary)}>Primary</Button>
                  <Button variant="secondary" style={buttonStyle(styleSecondary)}>Secondary</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                </div>
              </PreviewSection>

              <PreviewSection title="Inputs">
                <div className="space-y-3">
                  <Input placeholder="Enter text..." />
                  <Input placeholder="Disabled" disabled />
                </div>
              </PreviewSection>

              <PreviewSection title="Badges">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: stylePrimary }}>
                    Default
                  </span>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="outline">Outline</Badge>
                  <Badge variant="error">Error</Badge>
                </div>
              </PreviewSection>

              <PreviewSection title="Alerts">
                <div className="space-y-3">
                  <Alert variant="info">Info alert with important information.</Alert>
                  <Alert variant="success">Success alert confirming action completed.</Alert>
                </div>
              </PreviewSection>

              <PreviewSection title="Dialog">
                <Button variant="outline" onClick={() => setDialogOpen(true)}>
                  Open Dialog
                </Button>
                <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                  <Dialog.Header>
                    <Dialog.Title>Preview Dialog</Dialog.Title>
                    <Dialog.Description>This dialog follows the selected visual preset.</Dialog.Description>
                  </Dialog.Header>
                  <Dialog.Content>
                    <p className="text-sm text-slate-600 dark:text-slate-300">Use this to verify overlay density, borders, and theme contrast.</p>
                  </Dialog.Content>
                  <Dialog.Footer>
                    <Button onClick={() => setDialogOpen(false)} style={buttonStyle(stylePrimary)}>
                      Close
                    </Button>
                  </Dialog.Footer>
                </Dialog>
              </PreviewSection>

              <PreviewSection title="Select">
                <Select
                  value={selectValue}
                  onChange={(event) => setSelectValue(event.currentTarget.value)}
                  placeholder="Choose option..."
                  options={[
                    { value: "1", label: "Option 1" },
                    { value: "2", label: "Option 2" },
                    { value: "3", label: "Option 3" },
                  ]}
                />
              </PreviewSection>

              <PreviewSection title="Tabs">
                <Tabs value={innerTab} onChange={setInnerTab}>
                  <Tabs.List>
                    <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                    <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="overview">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Overview content uses muted copy and active tab color.</p>
                  </Tabs.Content>
                  <Tabs.Content value="settings">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Settings content checks secondary tab state.</p>
                  </Tabs.Content>
                </Tabs>
              </PreviewSection>

              <PreviewSection title="Card">
                <Card className="p-4">
                  <h4 className="font-bold text-slate-900 dark:text-white" style={{ color: stylePrimary }}>Card Title</h4>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Cards group related content with the selected radius and border treatment.</p>
                </Card>
              </PreviewSection>
            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </>
  );
}

interface PreviewSectionProps {
  title: string;
  children: ReactNode;
}

function PreviewSection({ title, children }: PreviewSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-[#1f2937] dark:bg-[#161b22]">
      <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
      {children}
    </section>
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

function buttonStyle(color: string): CSSProperties {
  return {
    backgroundColor: color,
    borderColor: color,
    color: shouldUseWhiteText(color) ? "white" : "#0f172a",
  };
}

function shouldUseWhiteText(hexColor: string): boolean {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}
