"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Accordion } from "@/ui/Accordion";
import { Alert } from "@/ui/Alert";
import { Avatar } from "@/ui/Avatar";
import { Badge } from "@/ui/Badge";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Checkbox } from "@/ui/Checkbox";
import { Dialog } from "@/ui/Dialog";
import { DropdownMenu } from "@/ui/DropdownMenu";
import { Input } from "@/ui/Input";
import { Pagination } from "@/ui/Pagination";
import { Popover } from "@/ui/Popover";
import { Progress } from "@/ui/Progress";
import { RadioGroup } from "@/ui/RadioGroup";
import { Select } from "@/ui/Select";
import { Separator } from "@/ui/Separator";
import { Skeleton } from "@/ui/Skeleton";
import { Slider } from "@/ui/Slider";
import { Spinner } from "@/ui/Spinner";
import { Switch } from "@/ui/Switch";
import { Tabs } from "@/ui/Tabs";
import { Textarea } from "@/ui/Textarea";
import { Toggle } from "@/ui/Toggle";
import { Tooltip } from "@/ui/Tooltip";
import { getStyleProperties, loadGoogleFonts, getSampleIcons, getIconSetByPrefix } from "../lib";
import { useWizardStore } from "../stores/useWizardStore";
import { DashboardPreview } from "./DashboardPreview";
import { IconPreview } from "./IconPreview";

export function LivePreviewPanel() {
  const { style, colors, fonts, radius, iconSet } = useWizardStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [innerTab, setInnerTab] = useState("overview");
  const [selectValue, setSelectValue] = useState("");
  const [sliderValue, setSliderValue] = useState(65);
  const [radioValue, setRadioValue] = useState("pro");
  const [paginationPage, setPaginationPage] = useState(3);
  const [toggleBold, setToggleBold] = useState(false);
  const [toggleItalic, setToggleItalic] = useState(true);
  const [toggleUnderline, setToggleUnderline] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [notifPush, setNotifPush] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSlack, setNotifSlack] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const styleRef = useRef<HTMLStyleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const styleProps = getStyleProperties(style);
  const stylePrimary = styleProps["--color-primary"];

  const sampleIcons = getSampleIcons(iconSet);
  const iconSetName = getIconSetByPrefix(iconSet)?.name ?? iconSet;

  useEffect(() => {
    const nextStyleProps = getStyleProperties(style);
    const radiusValue = getRadiusValue(radius);

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
          --radius: ${radiusValue};
          --font-header: "${fonts.header}";
          --font-body: "${fonts.body}";
          font-family: var(--font-body), sans-serif;
          font-size: var(--font-size-base);
        }
        .preview-container h1,
        .preview-container h2,
        .preview-container h3,
        .preview-container h4,
        .preview-container h5,
        .preview-container h6 {
          font-family: var(--font-header), sans-serif;
          line-height: var(--line-height-tight);
        }
        .preview-container button { border-radius: var(--radius); }
        .preview-container input,
        .preview-container select,
        .preview-container textarea { border-radius: var(--radius); }
        .preview-container .rounded-md { border-radius: var(--radius) !important; }
        .preview-container .rounded-lg { border-radius: calc(var(--radius) * 1.5) !important; }
        .preview-container .rounded-xl { border-radius: calc(var(--radius) * 2) !important; }
        .preview-container .rounded-2xl { border-radius: calc(var(--radius) * 2.5) !important; }
        .preview-container .rounded-full { border-radius: 9999px !important; }
        .preview-container .text-xs { font-size: var(--font-size-xs); }
        .preview-container .text-sm { font-size: var(--font-size-sm); }
        .preview-container .text-base { font-size: var(--font-size-base); }
        .preview-container .text-lg { font-size: var(--font-size-lg); }
        .preview-container .text-xl { font-size: var(--font-size-xl); }
        .preview-container .text-2xl { font-size: var(--font-size-2xl); }
        .preview-container .text-3xl { font-size: var(--font-size-3xl); }
        .preview-container .font-medium { font-weight: var(--font-weight-medium) !important; }
        .preview-container .font-semibold { font-weight: var(--font-weight-semibold) !important; }
        .preview-container .font-bold { font-weight: var(--font-weight-bold) !important; }
        .preview-container .font-black { font-weight: var(--font-weight-bold) !important; }
      `;
    }

    if (containerRef.current) {
      Object.entries(nextStyleProps).forEach(([key, value]) => {
        containerRef.current?.style.setProperty(key, value);
      });
      containerRef.current.style.setProperty("--radius", radiusValue);
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
      <div ref={containerRef} className="preview-container">
        <Tabs value={activeTab} onChange={setActiveTab} variant="pills">
          <div className="mb-6 flex flex-col gap-3 border-b border-slate-200 pb-4 dark:border-[#1f2937] sm:flex-row sm:items-center sm:justify-between">
            <Tabs.List>
              <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>
              <Tabs.Trigger value="components">Components</Tabs.Trigger>
            </Tabs.List>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Live</span>
            </div>
          </div>

          <Tabs.Content value="dashboard" className="mt-0">
            <DashboardPreview />
          </Tabs.Content>

          <Tabs.Content value="components" className="mt-0">
            <div className="grid gap-4 sm:grid-cols-2">

              {/* ── 1. Invite Team ── */}
              <Card className="overflow-hidden">
                <div className="border-b border-slate-200 p-4 dark:border-[#1f2937]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Invite Team</h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Add members to your workspace</p>
                    </div>
                    <Badge variant="outline">2 seats left</Badge>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input placeholder="alex@example.com" />
                    </div>
                    <Select value="" onChange={() => {}} placeholder="Role" options={[{ value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer" }]} />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Input placeholder="sam@example.com" />
                    </div>
                    <Select value="" onChange={() => {}} placeholder="Role" options={[{ value: "editor", label: "Editor" }, { value: "viewer", label: "Viewer" }]} />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-medium" style={{ color: stylePrimary }}>+ Add another</span>
                    <Button size="sm" style={buttonStyle(stylePrimary)}>Send Invites</Button>
                  </div>
                </div>
              </Card>

              {/* ── 2. API Keys ── */}
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f2937]">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">API Keys</h3>
                  <Button size="sm" style={buttonStyle(stylePrimary)}>New Key</Button>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                  {[
                    { name: "Production", key: "sk-prod-••••••••ab3f", status: "Active", variant: "success" as const },
                    { name: "Development", key: "sk-dev-••••••••9c12", status: "Expiring", variant: "warning" as const },
                    { name: "Staging", key: "sk-stg-••••••••4e7a", status: "Inactive", variant: "default" as const },
                  ].map((item) => (
                    <div key={item.name} className="flex items-center justify-between gap-3 px-4 py-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{item.name}</p>
                        <code className="font-mono text-[11px] text-slate-400">{item.key}</code>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <Badge variant={item.variant}>{item.status}</Badge>
                        <Button size="sm" variant="ghost">Copy</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* ── 3. Notifications ── */}
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f2937]">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                  <Badge variant="error">3 unread</Badge>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                  {[
                    { initials: "AT", name: "Ava Thompson", msg: "Commented on your PR #142", time: "2m ago", unread: true },
                    { initials: "NC", name: "Noah Chen", msg: "Assigned issue #42 to you", time: "1h ago", unread: true },
                    { initials: "MR", name: "Mia Rossi", msg: "Merged pull request #89", time: "3h ago", unread: false },
                    { initials: "LM", name: "Leo Martins", msg: "Mentioned you in a comment", time: "5h ago", unread: false },
                  ].map((n, i) => (
                    <div key={n.name} className="flex items-start gap-3 px-4 py-3">
                      <Avatar size="sm">
                        <Avatar.Image src="data:," />
                        <Avatar.Fallback style={{ backgroundColor: i % 2 === 0 ? `${colors.brand}20` : `${colors.accent}20`, color: i % 2 === 0 ? colors.brand : colors.accent }}>{n.initials}</Avatar.Fallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{n.name}</p>
                        <p className="truncate text-[11px] text-slate-500 dark:text-slate-400">{n.msg}</p>
                      </div>
                      <div className="flex shrink-0 flex-col items-end gap-1">
                        <span className="text-[11px] text-slate-400">{n.time}</span>
                        {n.unread && <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.brand }} />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-200 p-3 dark:border-[#1f2937]">
                  <button className="w-full text-center text-xs font-medium" style={{ color: stylePrimary }}>
                    Mark all as read
                  </button>
                </div>
              </Card>

              {/* ── 4. App Settings ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">App Settings</h3>
                <div className="space-y-0">
                  <div className="py-3">
                    <Switch checked={notifPush} onChange={(v) => setNotifPush(v)} label="Push notifications" description="Get notified about activity" />
                  </div>
                  <Separator />
                  <div className="py-3">
                    <Switch checked={notifEmail} onChange={(v) => setNotifEmail(v)} label="Email digest" description="Weekly summary of your projects" />
                  </div>
                  <Separator />
                  <div className="py-3">
                    <Switch checked={notifSlack} onChange={(v) => setNotifSlack(v)} label="Slack integration" description="Connect to your workspace" />
                  </div>
                  <Separator />
                  <div className="py-3">
                    <Switch defaultChecked label="Auto-save" description="Save changes automatically" disabled />
                  </div>
                </div>
              </Card>

              {/* ── 5. Onboarding Checklist ── */}
              <Card className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Getting Started</h3>
                  <Badge variant="success">3 / 5</Badge>
                </div>
                <Progress value={60} className="mb-4" />
                <div className="space-y-3">
                  <Checkbox defaultChecked label="Create your account" />
                  <Checkbox defaultChecked label="Set up workspace" />
                  <Checkbox defaultChecked label="Invite team members" />
                  <Checkbox label="Connect your repository" />
                  <Checkbox label="Deploy first project" />
                </div>
                <Button size="sm" className="mt-4 w-full" style={buttonStyle(stylePrimary)}>Continue Setup</Button>
              </Card>

              {/* ── 6. File Upload ── */}
              <Card className="p-4">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">File Upload</h3>
                <div className="mb-4 flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 dark:border-[#1f2937] dark:bg-[#0d1117]">
                  <div className="rounded-full p-3" style={{ backgroundColor: `${colors.brand}15` }}>
                    <span className="material-symbols-outlined text-[28px]" style={{ color: colors.brand }}>cloud_upload</span>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Drop files here</p>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">PNG, JPG, PDF up to 10MB</p>
                  </div>
                  <Button size="sm" variant="outline">Browse Files</Button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 dark:text-slate-300">report-q4.pdf</span>
                    <span className="text-slate-400">2.4 MB</span>
                  </div>
                  <Progress value={sliderValue} />
                  <div className="flex items-center justify-between">
                    <Badge variant="warning">Uploading</Badge>
                    <span className="text-xs text-slate-400">{sliderValue}%</span>
                  </div>
                </div>
              </Card>

              {/* ── 7. Feedback Form ── */}
              <Card className="p-4">
                <h3 className="mb-1 text-sm font-bold text-slate-900 dark:text-white">Send Feedback</h3>
                <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Help us improve the product</p>
                {feedbackSent ? (
                  <div className="space-y-3">
                    <Alert variant="success">Thanks! We received your feedback.</Alert>
                    <Button size="sm" variant="outline" onClick={() => setFeedbackSent(false)}>Send another</Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Select
                      value={selectValue}
                      onChange={(e) => setSelectValue(e.currentTarget.value)}
                      placeholder="Category"
                      options={[
                        { value: "bug", label: "Bug report" },
                        { value: "feature", label: "Feature request" },
                        { value: "other", label: "Other" },
                      ]}
                    />
                    <Textarea placeholder="Describe your feedback..." rows={3} />
                    <Button className="w-full" size="sm" style={buttonStyle(stylePrimary)} onClick={() => setFeedbackSent(true)}>
                      Submit Feedback
                    </Button>
                  </div>
                )}
              </Card>

              {/* ── 8. Loading States ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Loading States</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circle" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="line" className="w-3/4" />
                      <Skeleton variant="line" className="w-1/2" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Skeleton variant="circle" />
                    <div className="flex-1 space-y-2">
                      <Skeleton variant="line" className="w-2/3" />
                      <Skeleton variant="line" className="w-1/3" />
                    </div>
                  </div>
                  <Skeleton variant="rect" className="h-24 w-full" />
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500 dark:text-slate-400">Spinners</span>
                    <div className="flex items-center gap-3">
                      <Spinner size="sm" />
                      <Spinner size="md" />
                      <Spinner size="lg" />
                      <Spinner size="md" variant="muted" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* ── 9. Search ── */}
              <Card className="p-4">
                <h3 className="mb-3 text-sm font-bold text-slate-900 dark:text-white">Search Components</h3>
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.currentTarget.value)}
                />
                <div className="mt-3 divide-y divide-slate-200 dark:divide-[#1f2937]">
                  {[
                    { name: "Button", cat: "UI", desc: "Interactive action element" },
                    { name: "Input", cat: "Form", desc: "Text entry field" },
                    { name: "Dialog", cat: "Overlay", desc: "Modal window" },
                    { name: "Accordion", cat: "UI", desc: "Collapsible content" },
                    { name: "Badge", cat: "UI", desc: "Status indicator" },
                  ]
                    .filter((r) => !searchQuery || r.name.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((r) => (
                      <div key={r.name} className="flex items-center gap-3 py-2.5">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{r.name}</p>
                          <p className="text-[11px] text-slate-400">{r.desc}</p>
                        </div>
                        <Badge variant="outline">{r.cat}</Badge>
                      </div>
                    ))}
                </div>
              </Card>

              {/* ── 10. Book Appointment ── */}
              <Card className="p-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Book Appointment</h3>
                <p className="mb-4 mt-0.5 text-xs text-slate-500 dark:text-slate-400">Dr. Sarah Chen — Cardiology</p>
                <p className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">Available — March 18, 2026</p>
                <div className="grid grid-cols-4 gap-2">
                  {["9:00 AM", "10:30 AM", "11:00 AM", "1:30 PM", "2:00 PM", "3:30 PM", "4:00 PM", "4:30 PM"].map((slot, i) => (
                    <Button
                      key={slot}
                      size="sm"
                      variant={i === 2 ? "primary" : "outline"}
                      style={i === 2 ? buttonStyle(stylePrimary) : undefined}
                      className="text-[11px]"
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
                <Separator className="my-4" />
                <Checkbox label="New patient? Please arrive 15 minutes early." />
                <Button className="mt-3 w-full" size="sm" style={buttonStyle(stylePrimary)}>Book Appointment</Button>
              </Card>

              {/* ── 11. Edit Profile ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Edit Profile</h3>
                <div className="mb-4 flex items-center gap-3">
                  <Avatar size="lg">
                    <Avatar.Image src="data:," />
                    <Avatar.Fallback style={{ backgroundColor: `${colors.brand}20`, color: colors.brand }}>JD</Avatar.Fallback>
                  </Avatar>
                  <div>
                    <Button size="sm" variant="outline">Change photo</Button>
                    <p className="mt-1 text-[11px] text-slate-400">PNG, JPG max 2MB</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Input label="Full name" placeholder="Jane Doe" />
                  <Input label="Username" placeholder="janedoe" />
                  <Textarea label="Bio" placeholder="Tell us about yourself..." rows={2} />
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">Cancel</Button>
                    <Button size="sm" style={buttonStyle(stylePrimary)}>Save Changes</Button>
                  </div>
                </div>
              </Card>

              {/* ── 12. Team Members ── */}
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f2937]">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Team Members</h3>
                  <Button size="sm" variant="outline">Manage</Button>
                </div>
                <div className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                  {[
                    { initials: "AT", name: "Ava Thompson", role: "Admin", online: true },
                    { initials: "NC", name: "Noah Chen", role: "Editor", online: true },
                    { initials: "MR", name: "Mia Rossi", role: "Viewer", online: false },
                    { initials: "LM", name: "Leo Martins", role: "Editor", online: false },
                  ].map((m) => (
                    <div key={m.name} className="flex items-center gap-3 px-4 py-3">
                      <div className="relative">
                        <Avatar size="sm">
                          <Avatar.Image src="data:," />
                          <Avatar.Fallback style={{ backgroundColor: `${colors.brand}20`, color: colors.brand }}>{m.initials}</Avatar.Fallback>
                        </Avatar>
                        {m.online && (
                          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500 dark:border-[#161b22]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white">{m.name}</p>
                        <p className="text-[11px] text-slate-400">{m.online ? "Online" : "Offline"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={m.role === "Admin" ? "success" : m.role === "Editor" ? "warning" : "default"}>{m.role}</Badge>
                        <DropdownMenu>
                          <DropdownMenu.Trigger className="h-7 w-7 justify-center p-0">
                            <span className="material-symbols-outlined text-[16px]">more_vert</span>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item>Change role</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>Remove</DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* ── 13. Overlays (Tooltip + Popover + Dialog) ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Overlays</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tooltip</p>
                    <div className="flex flex-wrap gap-2">
                      {(["top", "bottom", "left", "right"] as const).map((side) => (
                        <Tooltip key={side} side={side}>
                          <Tooltip.Trigger>
                            <Button variant="outline" size="sm">{side}</Button>
                          </Tooltip.Trigger>
                          <Tooltip.Content>Tooltip on {side}</Tooltip.Content>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Popover</p>
                    <Popover>
                      <Popover.Trigger>Open Popover</Popover.Trigger>
                      <Popover.Content className="w-64 p-4">
                        <p className="mb-1 text-sm font-semibold text-slate-900 dark:text-white">Quick info</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Popovers surface supplemental content on demand.</p>
                        <div className="mt-3">
                          <Popover.Close style={buttonStyle(stylePrimary)}>Got it</Popover.Close>
                        </div>
                      </Popover.Content>
                    </Popover>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Dialog</p>
                    <Button variant="outline" size="sm" onClick={() => setDialogOpen(true)}>Open Dialog</Button>
                    <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                      <Dialog.Header>
                        <Dialog.Title>Confirm action</Dialog.Title>
                        <Dialog.Description>This dialog follows the selected visual preset.</Dialog.Description>
                      </Dialog.Header>
                      <Dialog.Content>
                        <p className="text-sm text-slate-600 dark:text-slate-300">Verify overlay density, borders, and contrast across Arc, Edge, and Soleil presets.</p>
                      </Dialog.Content>
                      <Dialog.Footer>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                        <Button onClick={() => setDialogOpen(false)} style={buttonStyle(stylePrimary)}>Confirm</Button>
                      </Dialog.Footer>
                    </Dialog>
                  </div>
                </div>
              </Card>

              {/* ── 14. Controls (Slider + Progress) ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Controls</h3>
                <div className="space-y-5">
                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Slider</p>
                    <Slider label="Volume" value={sliderValue} onValueChange={setSliderValue} showValue />
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Progress</p>
                    <div className="space-y-3">
                      {[
                        { label: "Storage used", value: 72 },
                        { label: "Upload", value: sliderValue },
                        { label: "Profile strength", value: 90 },
                      ].map(({ label, value }) => (
                        <div key={label}>
                          <div className="mb-1 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{label}</span>
                            <span>{value}%</span>
                          </div>
                          <Progress value={value} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>

              {/* ── 15. Form Controls (Checkbox + Radio + Select) ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Form Controls</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Checkbox</p>
                    <div className="space-y-2">
                      <Checkbox defaultChecked label="Accept terms and conditions" />
                      <Checkbox label="Subscribe to newsletter" />
                      <Checkbox indeterminate label="Select all (indeterminate)" />
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Radio Group</p>
                    <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                      <RadioGroup.Item value="starter" label="Starter" description="Free — up to 5 projects" />
                      <RadioGroup.Item value="pro" label="Pro" description="$12/mo — unlimited projects" />
                      <RadioGroup.Item value="enterprise" label="Enterprise" description="Custom — dedicated support" />
                    </RadioGroup>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Select</p>
                    <Select
                      value={selectValue}
                      onChange={(e) => setSelectValue(e.currentTarget.value)}
                      placeholder="Choose framework..."
                      options={[
                        { value: "nextjs", label: "Next.js" },
                        { value: "vite", label: "Vite" },
                        { value: "remix", label: "Remix" },
                      ]}
                    />
                  </div>
                </div>
              </Card>

              {/* ── 16. Status & Feedback (Badge + Alert) ── */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Status & Feedback</h3>
                <div className="space-y-4">
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Badges</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white" style={{ backgroundColor: stylePrimary }}>Primary</span>
                      <Badge variant="success">Active</Badge>
                      <Badge variant="warning">Pending</Badge>
                      <Badge variant="error">Failed</Badge>
                      <Badge variant="default">Paused</Badge>
                      <Badge variant="outline">Draft</Badge>
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Alerts</p>
                    <div className="space-y-2">
                      <Alert variant="info">Trial ends in 7 days.</Alert>
                      <Alert variant="success">Deployment completed.</Alert>
                      <Alert variant="warning">Storage at 84%.</Alert>
                      <Alert variant="error">Auth token expired.</Alert>
                    </div>
                  </div>
                </div>
              </Card>

              {/* ── 17. Build Pipeline ── full width */}
              <div className="sm:col-span-2">
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f2937]">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Build Pipeline</h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">deploy/main → production</p>
                    </div>
                    <Badge variant="warning">In Progress</Badge>
                  </div>
                  <div className="p-4">
                    <div className="mb-4 flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Elapsed: 2m 14s</span>
                      <span className="text-slate-400">72%</span>
                    </div>
                    <Progress value={72} className="mb-5" />
                    <div className="grid gap-3 sm:grid-cols-4">
                      {[
                        { step: "Build", status: "done", duration: "48s" },
                        { step: "Test", status: "done", duration: "1m 02s" },
                        { step: "Lint", status: "running", duration: "—" },
                        { step: "Deploy", status: "waiting", duration: "—" },
                      ].map((s) => (
                        <div key={s.step} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3 dark:border-[#1f2937]">
                          {s.status === "done" ? (
                            <span className="material-symbols-outlined text-[18px] text-green-500">check_circle</span>
                          ) : s.status === "running" ? (
                            <Spinner size="sm" />
                          ) : (
                            <span className="h-4 w-4 rounded-full border-2 border-slate-200 dark:border-[#1f2937]" />
                          )}
                          <div>
                            <p className="text-xs font-semibold text-slate-900 dark:text-white">{s.step}</p>
                            <p className="text-[11px] text-slate-400">{s.duration}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 border-t border-slate-200 p-3 dark:border-[#1f2937]">
                    <Button size="sm" variant="outline">View Logs</Button>
                    <Button size="sm" variant="outline">Cancel</Button>
                    <Button size="sm" style={buttonStyle(stylePrimary)}>Redeploy</Button>
                  </div>
                </Card>
              </div>

              {/* ── 18. Content Editor Toolbar ── full width */}
              <div className="sm:col-span-2">
                <Card className="overflow-hidden">
                  <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 p-2 dark:border-[#1f2937]">
                    <Tooltip side="top">
                      <Tooltip.Trigger>
                        <Toggle pressed={toggleBold} onPressedChange={setToggleBold} size="sm" aria-label="Bold"><strong>B</strong></Toggle>
                      </Tooltip.Trigger>
                      <Tooltip.Content>Bold</Tooltip.Content>
                    </Tooltip>
                    <Tooltip side="top">
                      <Tooltip.Trigger>
                        <Toggle pressed={toggleItalic} onPressedChange={setToggleItalic} size="sm" aria-label="Italic"><em>I</em></Toggle>
                      </Tooltip.Trigger>
                      <Tooltip.Content>Italic</Tooltip.Content>
                    </Tooltip>
                    <Tooltip side="top">
                      <Tooltip.Trigger>
                        <Toggle pressed={toggleUnderline} onPressedChange={setToggleUnderline} size="sm" aria-label="Underline"><span className="underline">U</span></Toggle>
                      </Tooltip.Trigger>
                      <Tooltip.Content>Underline</Tooltip.Content>
                    </Tooltip>
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <Toggle variant="outline" size="sm">H1</Toggle>
                    <Toggle variant="outline" size="sm">H2</Toggle>
                    <Toggle variant="outline" size="sm" defaultPressed>Normal</Toggle>
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <Toggle variant="outline" size="sm">Link</Toggle>
                    <Toggle variant="outline" size="sm">Code</Toggle>
                    <Toggle variant="outline" size="sm">Quote</Toggle>
                    <Separator orientation="vertical" className="mx-1 h-5" />
                    <Toggle variant="outline" size="sm">List</Toggle>
                    <Toggle variant="outline" size="sm">Ordered</Toggle>
                  </div>
                  <Textarea
                    placeholder="Start writing your content here. The toolbar above previews Toggle, Tooltip, and Separator in a real editor context..."
                    rows={4}
                  />
                </Card>
              </div>

              {/* ── 19. Environment Variables ── full width */}
              <div className="sm:col-span-2">
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f2937]">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white">Environment Variables</h3>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Production · 3 variables</p>
                    </div>
                    <Button size="sm" style={buttonStyle(stylePrimary)}>Add Variable</Button>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                    {[
                      { key: "DATABASE_URL", value: "postgresql://user:••••••••@db.example.com/prod", secret: true },
                      { key: "NEXT_PUBLIC_API_URL", value: "https://api.example.com", secret: false },
                      { key: "STRIPE_SECRET_KEY", value: "sk_live_••••••••••••••••••••••••", secret: true },
                    ].map((v) => (
                      <div key={v.key} className="grid grid-cols-[1fr_auto] items-center gap-3 p-4 sm:grid-cols-[220px_1fr_auto]">
                        <code className="text-xs font-semibold text-slate-900 dark:text-white">{v.key}</code>
                        <code className="hidden truncate font-mono text-[11px] text-slate-400 sm:block">{v.value}</code>
                        <div className="flex items-center gap-2">
                          <Badge variant={v.secret ? "error" : "success"}>{v.secret ? "Secret" : "Public"}</Badge>
                          <Button size="sm" variant="ghost">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* ── 20. Navigation Suite ── full width */}
              <div className="sm:col-span-2">
                <Card className="p-4">
                  <h3 className="mb-4 text-sm font-bold text-slate-900 dark:text-white">Navigation Components</h3>
                  <div className="space-y-5">
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Breadcrumb</p>
                      <Breadcrumb>
                        <Breadcrumb.List>
                          <Breadcrumb.Item><Breadcrumb.Link href="#">Home</Breadcrumb.Link></Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item><Breadcrumb.Link href="#">Docs</Breadcrumb.Link></Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item><Breadcrumb.Link href="#">Components</Breadcrumb.Link></Breadcrumb.Item>
                          <Breadcrumb.Separator />
                          <Breadcrumb.Item><Breadcrumb.Page>Button</Breadcrumb.Page></Breadcrumb.Item>
                        </Breadcrumb.List>
                      </Breadcrumb>
                    </div>
                    <Separator />
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Tabs</p>
                      <Tabs value={innerTab} onChange={setInnerTab}>
                        <Tabs.List>
                          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
                          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
                          <Tabs.Trigger value="billing">Billing</Tabs.Trigger>
                        </Tabs.List>
                        <Tabs.Content value="overview"><p className="text-sm text-slate-500 dark:text-slate-400">Overview content — active tab reflects preset color.</p></Tabs.Content>
                        <Tabs.Content value="settings"><p className="text-sm text-slate-500 dark:text-slate-400">Settings content area.</p></Tabs.Content>
                        <Tabs.Content value="billing"><p className="text-sm text-slate-500 dark:text-slate-400">Billing content area.</p></Tabs.Content>
                      </Tabs>
                    </div>
                    <Separator />
                    <div>
                      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">Pagination</p>
                      <Pagination page={paginationPage} totalPages={10} onPageChange={setPaginationPage} />
                    </div>
                  </div>
                </Card>
              </div>

              {/* ── 21. Data Table ── full width */}
              <div className="sm:col-span-2">
                <Card className="overflow-hidden">
                  <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-[#1f2937]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Users</h3>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Filter</Button>
                      <Button size="sm" style={buttonStyle(stylePrimary)}>Export</Button>
                    </div>
                  </div>
                  <div className="divide-y divide-slate-200 dark:divide-[#1f2937]">
                    {[
                      { initials: "AT", name: "Ava Thompson", email: "ava@example.com", role: "Admin", status: "Active", date: "May 1" },
                      { initials: "NC", name: "Noah Chen", email: "noah@example.com", role: "Editor", status: "Pending", date: "Apr 29" },
                      { initials: "MR", name: "Mia Rossi", email: "mia@example.com", role: "Viewer", status: "Active", date: "Apr 28" },
                      { initials: "LM", name: "Leo Martins", email: "leo@example.com", role: "Editor", status: "Inactive", date: "Apr 27" },
                      { initials: "SK", name: "Sara Kim", email: "sara@example.com", role: "Viewer", status: "Active", date: "Apr 25" },
                    ].map((u, i) => (
                      <div key={u.email} className="flex items-center gap-3 px-4 py-3">
                        <Avatar size="sm">
                          <Avatar.Image src="data:," />
                          <Avatar.Fallback style={{ backgroundColor: i % 2 === 0 ? `${colors.brand}20` : `${colors.accent}20`, color: i % 2 === 0 ? colors.brand : colors.accent }}>{u.initials}</Avatar.Fallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="truncate text-[11px] text-slate-400">{u.email}</p>
                        </div>
                        <span className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">{u.date}</span>
                        <Badge variant={u.role === "Admin" ? "success" : "outline"}>{u.role}</Badge>
                        <Badge variant={u.status === "Active" ? "success" : u.status === "Pending" ? "warning" : "default"}>{u.status}</Badge>
                        <DropdownMenu>
                          <DropdownMenu.Trigger className="h-7 w-7 justify-center p-0">
                            <span className="material-symbols-outlined text-[16px]">more_vert</span>
                          </DropdownMenu.Trigger>
                          <DropdownMenu.Content>
                            <DropdownMenu.Item>View profile</DropdownMenu.Item>
                            <DropdownMenu.Item>Edit</DropdownMenu.Item>
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item>Deactivate</DropdownMenu.Item>
                          </DropdownMenu.Content>
                        </DropdownMenu>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-slate-200 p-3 dark:border-[#1f2937]">
                    <Pagination page={paginationPage} totalPages={10} onPageChange={setPaginationPage} />
                  </div>
                </Card>
              </div>

              {/* ── 22. FAQ Accordion ── full width */}
              <div className="sm:col-span-2">
                <Card className="overflow-hidden">
                  <div className="border-b border-slate-200 p-4 dark:border-[#1f2937]">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
                  </div>
                  <div className="p-4">
                    <Accordion type="single" defaultValue="faq-1" collapsible>
                      <Accordion.Item value="faq-1">
                        <Accordion.Trigger>What is React Principles?</Accordion.Trigger>
                        <Accordion.Content>
                          A living cookbook and UI kit for modern React development — production-grade patterns with a reusable component library.
                        </Accordion.Content>
                      </Accordion.Item>
                      <Accordion.Item value="faq-2">
                        <Accordion.Trigger>How do I add components to my project?</Accordion.Trigger>
                        <Accordion.Content>
                          Run <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs dark:bg-[#0d1117]">npx react-principles add Button</code> to copy any component directly into your codebase.
                        </Accordion.Content>
                      </Accordion.Item>
                      <Accordion.Item value="faq-3">
                        <Accordion.Trigger>Is it compatible with my stack?</Accordion.Trigger>
                        <Accordion.Content>
                          Yes — supports Next.js, Vite, and Remix with optional Zustand, TanStack Query, and React Hook Form integration.
                        </Accordion.Content>
                      </Accordion.Item>
                      <Accordion.Item value="faq-4">
                        <Accordion.Trigger>Can I customize the components?</Accordion.Trigger>
                        <Accordion.Content>
                          Yes — components are copied into your project, so you own the code completely. No design system lock-in.
                        </Accordion.Content>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                </Card>
              </div>

              {/* ── 23. Icon Gallery ── full width */}
              <div className="sm:col-span-2">
                <Card className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Icon Set — {iconSetName}</h3>
                    <Badge variant="outline">{sampleIcons.length * 2} icons</Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {sampleIcons.map((name) => (
                      <div key={`brand-${name}`} className="flex flex-col items-center gap-1.5">
                        <div className="rounded-lg p-2.5" style={{ backgroundColor: `${colors.brand}15` }}>
                          <IconPreview iconSet={iconSet} name={name} size={22} color={colors.brand} />
                        </div>
                        <span className="max-w-[60px] truncate text-center text-[10px] text-slate-400">{name}</span>
                      </div>
                    ))}
                    {sampleIcons.map((name) => (
                      <div key={`accent-${name}`} className="flex flex-col items-center gap-1.5">
                        <div className="rounded-lg p-2.5" style={{ backgroundColor: `${colors.accent}15` }}>
                          <IconPreview iconSet={iconSet} name={name} size={22} color={colors.accent} />
                        </div>
                        <span className="max-w-[60px] truncate text-center text-[10px] text-slate-400">{name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

            </div>
          </Tabs.Content>
        </Tabs>
      </div>
    </>
  );
}

function getRadiusValue(radius: string): string {
  const radii: Record<string, string> = {
    none: "0px",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
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
