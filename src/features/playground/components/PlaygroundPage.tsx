"use client";

import Link from "next/link";
import {
  startTransition,
  type CSSProperties,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CodeBlock } from "@/features/cookbook/components/CodeBlock";
import {
  CliInstallBlock,
  DocsHeader,
  MobileNav,
} from "@/features/docs/components";
import { cn } from "@/shared/utils/cn";
import { AlertDialog } from "@/ui/AlertDialog";
import { Alert } from "@/ui/Alert";
import { Accordion } from "@/ui/Accordion";
import { Avatar } from "@/ui/Avatar";
import { Badge } from "@/ui/Badge";
import { Breadcrumb } from "@/ui/Breadcrumb";
import { Button } from "@/ui/Button";
import { Card } from "@/ui/Card";
import { Checkbox } from "@/ui/Checkbox";
import { Combobox } from "@/ui/Combobox";
import { Command } from "@/ui/Command";
import { DatePicker } from "@/ui/DatePicker";
import { Dialog } from "@/ui/Dialog";
import { Drawer } from "@/ui/Drawer";
import { DropdownMenu } from "@/ui/DropdownMenu";
import { Input } from "@/ui/Input";
import { Pagination } from "@/ui/Pagination";
import { PageProgress } from "@/ui/PageProgress";
import { Popover } from "@/ui/Popover";
import { Progress } from "@/ui/Progress";
import { RadioGroup } from "@/ui/RadioGroup";
import { Select } from "@/ui/Select";
import { SearchDialog } from "@/ui/SearchDialog";
import { Separator } from "@/ui/Separator";
import { Skeleton } from "@/ui/Skeleton";
import { Slider } from "@/ui/Slider";
import { Switch } from "@/ui/Switch";
import { Tabs } from "@/ui/Tabs";
import { Textarea } from "@/ui/Textarea";
import { Toast } from "@/ui/Toast";
import { Tooltip } from "@/ui/Tooltip";
import {
  buildUsageSnippet,
  type PlaygroundColorScheme,
  getDefaultPlaygroundEntry,
  getPlaygroundEntries,
  type PlaygroundControlDefinition,
  type PlaygroundControlState,
  type PlaygroundEntry,
  type PlaygroundFramework,
  type PlaygroundTheme,
} from "../data/registry";

type CodePanelTab = "usage" | "source";
type PreviewTab = "quick" | "storybook";

const FRAMEWORK_OPTIONS = [
  { label: "Next.js", value: "nextjs" },
  { label: "Vite", value: "vitejs" },
];

const PREVIEW_THEME_OPTIONS = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
];

const COLOR_SCHEME_OPTIONS = [
  { label: "Indigo", value: "indigo" },
  { label: "Emerald", value: "emerald" },
  { label: "Amber", value: "amber" },
  { label: "Rose", value: "rose" },
];

const COLOR_SCHEME_VALUE: Record<PlaygroundColorScheme, string> = {
  indigo: "#4628f1",
  emerald: "#059669",
  amber: "#d97706",
  rose: "#e11d48",
};

const SELECT_SAMPLE_OPTIONS = [
  { label: "Next.js", value: "nextjs" },
  { label: "Vite", value: "vitejs" },
  { label: "Storybook", value: "storybook" },
];

function getStringControl(state: PlaygroundControlState, id: string, fallback: string) {
  const value = state[id];
  return typeof value === "string" ? value : fallback;
}

function getBooleanControl(state: PlaygroundControlState, id: string, fallback = false) {
  const value = state[id];
  return typeof value === "boolean" ? value : fallback;
}

function PlaygroundPreview({
  entry,
  state,
  theme,
  colorScheme,
}: {
  entry: PlaygroundEntry;
  state: PlaygroundControlState;
  theme: PlaygroundTheme;
  colorScheme: PlaygroundColorScheme;
}) {
  const isDark = theme === "dark";
  const shellClassName = isDark ? "dark" : "";
  const previewStyle = {
    ["--color-primary" as const]: COLOR_SCHEME_VALUE[colorScheme],
  } as CSSProperties;

  return (
    <div className={shellClassName} style={previewStyle}>
      <div className="min-h-[280px] rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 dark:border-white/10 dark:bg-[#0b0e14] dark:shadow-black/20">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Quick preview
            </p>
            <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
              {entry.name}
            </h3>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
            {theme} mode
          </span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-950">
          {entry.slug === "accordion" && (
            <Accordion
              type={getStringControl(state, "type", "single") as "single" | "multiple"}
              defaultValue={
                getStringControl(state, "type", "single") === "multiple"
                  ? (getBooleanControl(state, "openSecond") ? ["item-2"] : [])
                  : (getBooleanControl(state, "openSecond") ? "item-2" : "")
              }
            >
              <Accordion.Item value="item-1">
                <Accordion.Trigger>What does the playground solve?</Accordion.Trigger>
                <Accordion.Content>
                  It lets you browse, configure, and copy component usage without leaving the docs site.
                </Accordion.Content>
              </Accordion.Item>
              <Accordion.Item value="item-2">
                <Accordion.Trigger>How does it stay aligned with the CLI?</Accordion.Trigger>
                <Accordion.Content>
                  Both surfaces read from the same internal registry metadata.
                </Accordion.Content>
              </Accordion.Item>
            </Accordion>
          )}

          {entry.slug === "alert" && (
            <Alert variant={getStringControl(state, "variant", "default") as "default" | "success" | "warning" | "error" | "info"}>
              <Alert.Title>{getStringControl(state, "title", "Deployment status")}</Alert.Title>
              <Alert.Description>
                {getStringControl(state, "description", "Everything shipped successfully.")}
              </Alert.Description>
              {getBooleanControl(state, "showAction") && (
                <Alert.Footer>
                  <Alert.Action>Review changes</Alert.Action>
                </Alert.Footer>
              )}
            </Alert>
          )}

          {entry.slug === "alert-dialog" && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-white/10">
              <AlertDialog
                open={getBooleanControl(state, "open")}
                onClose={() => {}}
                onConfirm={() => {}}
                variant={getStringControl(state, "variant", "default") as "default" | "warning" | "destructive"}
                isLoading={getBooleanControl(state, "isLoading")}
                title="Delete component preset?"
                description="This removes the saved playground preset from your workspace."
                confirmLabel="Delete preset"
              />
            </div>
          )}

          {entry.slug === "badge" && (
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant={getStringControl(state, "variant", "default") as "default" | "success" | "warning" | "error" | "info" | "outline"}
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
              >
                {getStringControl(state, "label", "Early access")}
              </Badge>
            </div>
          )}

          {entry.slug === "avatar" && (
            <Avatar size={getStringControl(state, "size", "md") as "sm" | "md" | "lg" | "xl"}>
              {getBooleanControl(state, "showImage") && (
                <Avatar.Image src="https://i.pravatar.cc/160?img=12" alt="Profile" />
              )}
              <Avatar.Fallback>{getStringControl(state, "fallback", "RP")}</Avatar.Fallback>
            </Avatar>
          )}

          {entry.slug === "button" && (
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={getStringControl(state, "variant", "primary") as "primary" | "secondary" | "ghost" | "destructive" | "outline"}
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
                isLoading={getBooleanControl(state, "isLoading")}
                disabled={getBooleanControl(state, "disabled")}
              >
                {getStringControl(state, "label", "Create recipe")}
              </Button>
            </div>
          )}

          {entry.slug === "card" && (
            <Card
              variant={getStringControl(state, "variant", "default") as "default" | "elevated" | "flat"}
              className="max-w-xl"
            >
              <Card.Header>
                <Card.Title>{getStringControl(state, "title", "Conversion snapshot")}</Card.Title>
                <Card.Description>
                  {getStringControl(state, "description", "Weekly signups are ahead of target.")}
                </Card.Description>
              </Card.Header>
              <Card.Content>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-primary/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      MRR
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      $48.2k
                    </p>
                  </div>
                  <div className="rounded-xl bg-emerald-500/10 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                      Conversion
                    </p>
                    <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                      6.8%
                    </p>
                  </div>
                </div>
              </Card.Content>
              {getBooleanControl(state, "showFooter") && (
                <Card.Footer>
                  <Button size="sm">Review</Button>
                  <Button size="sm" variant="ghost">
                    Dismiss
                  </Button>
                </Card.Footer>
              )}
            </Card>
          )}

          {entry.slug === "breadcrumb" && (
            <Breadcrumb>
              <Breadcrumb.List>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>
                  {getStringControl(state, "separator", "/")}
                </Breadcrumb.Separator>
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="#">Playground</Breadcrumb.Link>
                </Breadcrumb.Item>
                <Breadcrumb.Separator>
                  {getStringControl(state, "separator", "/")}
                </Breadcrumb.Separator>
                <Breadcrumb.Item>
                  <Breadcrumb.Page>Button</Breadcrumb.Page>
                </Breadcrumb.Item>
              </Breadcrumb.List>
            </Breadcrumb>
          )}

          {entry.slug === "checkbox" && (
            <Checkbox
              checked={getBooleanControl(state, "checked")}
              indeterminate={getBooleanControl(state, "indeterminate")}
              size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
              label={getStringControl(state, "label", "Ship docs examples")}
              description={getStringControl(
                state,
                "description",
                "Enable polished examples in the docs site.",
              )}
              onChange={() => {}}
            />
          )}

          {entry.slug === "combobox" && (
            <div className="max-w-md">
              <Combobox
                label={getStringControl(state, "label", "Stack")}
                value={getStringControl(state, "value", "nextjs")}
                onValueChange={() => {}}
                options={[
                  { label: "Next.js", value: "nextjs", description: "App Router and server rendering." },
                  { label: "Vite", value: "vitejs", description: "Fast local iteration for SPA workflows." },
                  { label: "Storybook", value: "storybook", description: "Visual review and component development." },
                ]}
              />
            </div>
          )}

          {entry.slug === "command" && (
            <div className="max-w-md">
              <Command initialQuery={getStringControl(state, "query", "docs")}>
                <Command.Input
                  placeholder="Search docs, patterns, components..."
                />
                <Command.List>
                  <Command.Group>
                    <Command.Label>Docs</Command.Label>
                    <Command.Item value="button" keywords={["action", "cta"]}>
                      Button
                    </Command.Item>
                    <Command.Item value="dialog" keywords={["modal", "overlay"]}>
                      Dialog
                    </Command.Item>
                  </Command.Group>
                </Command.List>
              </Command>
            </div>
          )}

          {entry.slug === "date-picker" && (
            <div className="max-w-md">
              <DatePicker
                label={getStringControl(state, "label", "Publish date")}
                value={getStringControl(state, "value", "2026-04-14")}
                description="Used to schedule the component release."
                error={getBooleanControl(state, "showError") ? "Choose a valid publication date." : undefined}
                onChange={() => {}}
              />
            </div>
          )}

          {entry.slug === "dialog" && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-white/10">
              <Dialog
                open={getBooleanControl(state, "open")}
                onClose={() => {}}
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg" | "xl"}
              >
                <Dialog.Header>
                  <Dialog.Title>Review generated output</Dialog.Title>
                  <Dialog.Description>
                    Check the snippet before you copy it into your project.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Content>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Dialogs work well for focused confirmation and detail-heavy tasks.
                  </p>
                </Dialog.Content>
                <Dialog.Footer>
                  <Button size="sm" variant="ghost">Cancel</Button>
                  <Button size="sm">Continue</Button>
                </Dialog.Footer>
              </Dialog>
            </div>
          )}

          {entry.slug === "drawer" && (
            <div className="rounded-xl border border-dashed border-slate-300 p-4 dark:border-white/10">
              <Drawer
                open={getBooleanControl(state, "open")}
                onClose={() => {}}
                side={getStringControl(state, "side", "right") as "right" | "left"}
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg" | "full"}
              >
                <Drawer.Header>
                  <Drawer.Title>Component settings</Drawer.Title>
                  <Drawer.Description>
                    Adjust visual options without leaving the current page.
                  </Drawer.Description>
                </Drawer.Header>
                <Drawer.Content>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Drawers work well for side-by-side editing flows.
                  </p>
                </Drawer.Content>
                <Drawer.Footer>
                  <Button size="sm" variant="ghost">Close</Button>
                </Drawer.Footer>
              </Drawer>
            </div>
          )}

          {entry.slug === "dropdown-menu" && (
            <DropdownMenu open={getBooleanControl(state, "open")} onOpenChange={() => {}}>
              <DropdownMenu.Trigger>Open menu</DropdownMenu.Trigger>
              <DropdownMenu.Content>
                {getBooleanControl(state, "showLabel") && (
                  <DropdownMenu.Label>Actions</DropdownMenu.Label>
                )}
                <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Archive</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          )}

          {entry.slug === "input" && (
            <div className="max-w-md">
              <Input
                variant={getStringControl(state, "variant", "default") as "default" | "filled" | "ghost"}
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
                label={getStringControl(state, "label", "Email address")}
                placeholder={getStringControl(state, "placeholder", "name@company.com")}
                description="We only use this for product updates."
                error={getBooleanControl(state, "showError") ? "Enter a valid email address." : undefined}
              />
            </div>
          )}

          {entry.slug === "pagination" && (
            <Pagination
              page={Number(getStringControl(state, "page", "3"))}
              totalPages={Number(getStringControl(state, "totalPages", "8"))}
              siblingCount={Number(getStringControl(state, "siblingCount", "1"))}
              onPageChange={() => {}}
            />
          )}

          {entry.slug === "page-progress" && (
            <div className="relative h-12 w-full rounded-xl border border-dashed border-slate-300 bg-white dark:border-white/10 dark:bg-slate-900">
              <PageProgress
                progress={Number(getStringControl(state, "progress", "45"))}
                visible={getBooleanControl(state, "visible")}
              />
              <div className="px-4 pt-5 text-xs text-slate-500 dark:text-slate-400">
                Simulated top navigation progress
              </div>
            </div>
          )}

          {entry.slug === "popover" && (
            <Popover
              open={getBooleanControl(state, "open")}
              onOpenChange={() => {}}
              side={getStringControl(state, "side", "bottom") as "top" | "bottom"}
              align={getStringControl(state, "align", "start") as "start" | "center" | "end"}
            >
              <Popover.Trigger>Open settings</Popover.Trigger>
              <Popover.Content>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Tune component options without leaving the current page.
                </p>
                <div className="mt-3">
                  <Popover.Close>Done</Popover.Close>
                </div>
              </Popover.Content>
            </Popover>
          )}

          {entry.slug === "progress" && (
            <div className="max-w-md">
              <div className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                Upload progress
              </div>
              <Progress
                value={Number(getStringControl(state, "value", "60"))}
                max={Number(getStringControl(state, "max", "100"))}
              />
            </div>
          )}

          {entry.slug === "radio-group" && (
            <div className="max-w-xl">
              <RadioGroup
                value={getStringControl(state, "value", "nextjs")}
                onValueChange={() => {}}
              >
                <RadioGroup.Item
                  value="nextjs"
                  label="Next.js"
                  description={
                    getBooleanControl(state, "showDescriptions")
                      ? "App Router, server rendering, and integrated routing."
                      : undefined
                  }
                />
                <RadioGroup.Item
                  value="vitejs"
                  label="Vite"
                  description={
                    getBooleanControl(state, "showDescriptions")
                      ? "Lean client-side tooling with fast local iteration."
                      : undefined
                  }
                />
                <RadioGroup.Item
                  value="remix"
                  label="Remix"
                  description={
                    getBooleanControl(state, "showDescriptions")
                      ? "Nested routes with server-first data workflows."
                      : undefined
                  }
                />
              </RadioGroup>
            </div>
          )}

          {entry.slug === "select" && (
            <div className="max-w-md">
              <Select
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
                label={getStringControl(state, "label", "Framework")}
                placeholder={getStringControl(state, "placeholder", "Choose framework")}
                description={
                  getBooleanControl(state, "showDescription")
                    ? "Keep generated examples aligned with your app shell."
                    : undefined
                }
                options={SELECT_SAMPLE_OPTIONS}
                defaultValue="nextjs"
              />
            </div>
          )}

          {entry.slug === "search-dialog" && (
            <div className="relative h-[440px] w-full overflow-hidden rounded-xl border border-dashed border-slate-300 dark:border-white/10">
              <SearchDialog
                open={getBooleanControl(state, "open")}
                initialQuery={getStringControl(state, "query", "button")}
                items={[
                  { title: "Button", href: "/docs/button", group: "Docs", section: "Components" },
                  { title: "Dialog", href: "/docs/dialog", group: "Docs", section: "Components" },
                  {
                    title: "Form Validation",
                    href: "/nextjs/cookbook/form-validation",
                    group: "Cookbook",
                    description: "Schema-first forms with React Hook Form",
                  },
                ]}
                onClose={() => {}}
                onNavigate={() => {}}
              />
            </div>
          )}

          {entry.slug === "separator" && (
            <div
              className={cn(
                "flex items-center justify-center rounded-xl border border-dashed border-slate-300 p-6 dark:border-white/10",
                getStringControl(state, "orientation", "horizontal") === "horizontal"
                  ? "w-full"
                  : "h-40",
              )}
            >
              <Separator
                orientation={getStringControl(state, "orientation", "horizontal") as "horizontal" | "vertical"}
              />
            </div>
          )}

          {entry.slug === "skeleton" && (
            <div className="flex items-center gap-4">
              <Skeleton
                variant={getStringControl(state, "variant", "line") as "line" | "rect" | "circle"}
                width={Number(getStringControl(state, "width", "160"))}
              />
            </div>
          )}

          {entry.slug === "slider" && (
            <div className="max-w-md">
              <Slider
                label={getStringControl(state, "label", "Volume")}
                value={Number(getStringControl(state, "value", "50"))}
                showValue={getBooleanControl(state, "showValue", true)}
                onValueChange={() => {}}
              />
            </div>
          )}

          {entry.slug === "switch" && (
            <Switch
              size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
              label={getStringControl(state, "label", "Enable notifications")}
              description={getStringControl(
                state,
                "description",
                "Ship product alerts to the current workspace.",
              )}
              checked={getBooleanControl(state, "checked")}
              onChange={() => {}}
            />
          )}

          {entry.slug === "tabs" && (
            <div className="max-w-xl">
              <Tabs
                defaultValue="overview"
                variant={getStringControl(state, "variant", "underline") as "underline" | "pills"}
              >
                <Tabs.List>
                  <Tabs.Trigger value="overview">
                    {getStringControl(state, "firstLabel", "Overview")}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="api">
                    {getStringControl(state, "secondLabel", "API")}
                  </Tabs.Trigger>
                  <Tabs.Trigger value="examples">
                    {getStringControl(state, "thirdLabel", "Examples")}
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="overview">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Start with intent, constraints, and the mental model for the component.
                  </p>
                </Tabs.Content>
                <Tabs.Content value="api">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Document props, variants, and safe defaults for production usage.
                  </p>
                </Tabs.Content>
                <Tabs.Content value="examples">
                  <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Show real combinations that match the generated usage snippet.
                  </p>
                </Tabs.Content>
              </Tabs>
            </div>
          )}

          {entry.slug === "textarea" && (
            <div className="max-w-xl">
              <Textarea
                variant={getStringControl(state, "variant", "default") as "default" | "filled" | "ghost"}
                size={getStringControl(state, "size", "md") as "sm" | "md" | "lg"}
                label={getStringControl(state, "label", "Release notes")}
                placeholder={getStringControl(
                  state,
                  "placeholder",
                  "Summarize what changed in this release...",
                )}
                description="This summary appears in changelog emails and product updates."
                error={getBooleanControl(state, "showError") ? "Please add enough detail before publishing." : undefined}
              />
            </div>
          )}

          {entry.slug === "toast" && (
            <div className="max-w-md">
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
                <Toast
                  open
                  onOpenChange={() => {}}
                  duration={0}
                  variant={getStringControl(state, "variant", "default") as "default" | "success" | "warning" | "error"}
                  position={getStringControl(state, "position", "top-right") as "top-right" | "bottom-right" | "top-left" | "bottom-left"}
                  className="relative inset-auto translate-y-0 opacity-100 shadow-none"
                >
                  <Toast.Title>{getStringControl(state, "title", "Changes saved")}</Toast.Title>
                  <Toast.Description>
                    {getStringControl(state, "description", "Your component settings are ready to ship.")}
                  </Toast.Description>
                  <Toast.Footer>
                    <Toast.Close />
                  </Toast.Footer>
                </Toast>
              </div>
            </div>
          )}

          {entry.slug === "tooltip" && (
            <Tooltip
              side={getStringControl(state, "side", "top") as "top" | "bottom" | "left" | "right"}
              defaultOpen={getBooleanControl(state, "defaultOpen")}
            >
              <Tooltip.Trigger>
                <Button variant="outline" size="sm">Hover target</Button>
              </Tooltip.Trigger>
              <Tooltip.Content>
                {getStringControl(state, "label", "Copy install command")}
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
      </div>
    </div>
  );
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: PlaygroundControlDefinition;
  value: string | boolean | undefined;
  onChange: (value: string | boolean) => void;
}) {
  if (control.type === "boolean") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-900">
        <Checkbox
          checked={Boolean(value)}
          label={control.label}
          description={control.helperText}
          onChange={onChange}
        />
      </div>
    );
  }

  if (control.type === "select") {
    return (
      <Select
        label={control.label}
        options={control.options}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <Input
      label={control.label}
      value={typeof value === "string" ? value : ""}
      placeholder={control.placeholder}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export function PlaygroundPage() {
  const entries = useMemo(() => getPlaygroundEntries(), []);
  const defaultEntry = useMemo(() => getDefaultPlaygroundEntry(), []);
  const [framework, setFramework] = useState<PlaygroundFramework>("nextjs");
  const [previewTheme, setPreviewTheme] = useState<PlaygroundTheme>("dark");
  const [colorScheme, setColorScheme] = useState<PlaygroundColorScheme>("indigo");
  const [codeTab, setCodeTab] = useState<CodePanelTab>("usage");
  const [previewTab, setPreviewTab] = useState<PreviewTab>("quick");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(defaultEntry?.slug ?? "");
  const [controlStates, setControlStates] = useState<Record<string, PlaygroundControlState>>(
    () =>
      Object.fromEntries(entries.map((entry) => [entry.slug, { ...entry.initialState }])),
  );
  const deferredSearch = useDeferredValue(searchQuery);

  const filteredEntries = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    if (!normalizedQuery) return entries;

    return entries.filter((entry) => {
      const haystack = [
        entry.name,
        entry.slug,
        entry.category,
        entry.description,
        ...entry.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [deferredSearch, entries]);

  useEffect(() => {
    if (!filteredEntries.length) return;

    const selectedStillVisible = filteredEntries.some((entry) => entry.slug === selectedSlug);
    if (!selectedStillVisible) {
      setSelectedSlug(filteredEntries[0]?.slug ?? "");
    }
  }, [filteredEntries, selectedSlug]);

  const selectedEntry = useMemo(
    () =>
      filteredEntries.find((entry) => entry.slug === selectedSlug)
      ?? entries.find((entry) => entry.slug === selectedSlug)
      ?? defaultEntry,
    [defaultEntry, entries, filteredEntries, selectedSlug],
  );

  const currentState = selectedEntry
    ? controlStates[selectedEntry.slug] ?? selectedEntry.initialState
    : {};

  const usageSnippet = selectedEntry
    ? buildUsageSnippet(selectedEntry, framework, currentState)
    : "";

  function updateControl(entry: PlaygroundEntry, controlId: string, value: string | boolean) {
    setControlStates((previousState) => ({
      ...previousState,
      [entry.slug]: {
        ...entry.initialState,
        ...previousState[entry.slug],
        [controlId]: value,
      },
    }));
  }

  return (
    <div className="font-display min-h-screen overflow-x-hidden bg-white text-slate-900 antialiased dark:bg-[#0b0e14] dark:text-[#e2e8f0]">
      <DocsHeader />
      <main className="mx-auto w-full max-w-[1680px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mx-auto min-w-0 max-w-[1540px]">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-sm font-semibold text-primary">
              <span className="material-symbols-outlined text-base">deployed_code</span>
              Component playground
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Configure components before you copy a single line.
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              Browse the full UI catalog, preview components, tune the common props, and
              generate usage code that stays aligned with the registry behind the CLI.
            </p>
          </div>

          <div className="grid w-full min-w-0 gap-3 rounded-3xl border border-slate-200 bg-slate-50/90 p-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 lg:grid-cols-3">
            <Select
              label="Framework"
              options={FRAMEWORK_OPTIONS}
              value={framework}
              onChange={(event) => setFramework(event.target.value as PlaygroundFramework)}
              description="Mengubah bentuk snippet yang digenerate untuk konteks Next.js atau Vite."
            />
            <Select
              label="Preview theme"
              options={PREVIEW_THEME_OPTIONS}
              value={previewTheme}
              onChange={(event) => setPreviewTheme(event.target.value as PlaygroundTheme)}
              description="Quick preview respects the selected surface theme."
            />
            <Select
              label="Color scheme"
              options={COLOR_SCHEME_OPTIONS}
              value={colorScheme}
              onChange={(event) => setColorScheme(event.target.value as PlaygroundColorScheme)}
              description="Mengubah aksen warna preview playground."
            />
          </div>
        </div>

        <div className="grid min-w-0 gap-6 2xl:grid-cols-[320px_minmax(0,1fr)]">
          <section className="min-w-0 space-y-4 xl:sticky xl:top-20 xl:self-start">
            <div className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
              <Input
                label="Search components"
                placeholder="Button, overlay, forms..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
              />
              <div className="mt-4 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
                <span>Catalog</span>
                <span>{filteredEntries.length} items</span>
              </div>
            </div>

            <div className="grid min-w-0 gap-3 md:grid-cols-2 2xl:grid-cols-1 2xl:max-h-[calc(100vh-15rem)] 2xl:overflow-y-auto 2xl:pr-1">
              {filteredEntries.map((entry) => {
                const isActive = selectedEntry?.slug === entry.slug;

                return (
                  <button
                    key={entry.slug}
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        setSelectedSlug(entry.slug);
                        setCodeTab("usage");
                        setPreviewTab(entry.supportsQuickPreview ? "quick" : "storybook");
                      });
                    }}
                    className={cn(
                      "w-full min-w-0 rounded-3xl border p-4 text-left transition-all",
                      isActive
                        ? "border-primary bg-primary/6 shadow-lg shadow-primary/10"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-300 dark:border-white/10 dark:bg-slate-950 dark:hover:border-white/20",
                    )}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="break-words text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          {entry.category}
                        </p>
                        <h2 className="mt-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                          {entry.name}
                        </h2>
                      </div>
                      {entry.supportsQuickPreview && (
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400">
                          Configurable
                        </span>
                      )}
                    </div>
                    <p className="mt-3 break-words text-sm leading-6 text-slate-600 dark:text-slate-400">
                      {entry.description}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {entry.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}

              {!filteredEntries.length && (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-slate-950 dark:text-slate-400">
                  No components match that query. Try a component name like `button`, a category such as `forms`, or a tag like `overlay`.
                </div>
              )}
            </div>
          </section>

          {selectedEntry && (
            <div className="min-w-0 space-y-8">
              <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4">
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline">{selectedEntry.category}</Badge>
                          <Badge variant="info">{selectedEntry.slug}</Badge>
                        </div>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                          {selectedEntry.name}
                        </h2>
                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                          {selectedEntry.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 xl:max-w-[420px] xl:justify-end">
                        {selectedEntry.supportsQuickPreview && (
                          <div className="inline-flex rounded-full border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-slate-900">
                            <button
                              type="button"
                              onClick={() => setPreviewTab("quick")}
                              className={cn(
                                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                                previewTab === "quick"
                                  ? "bg-primary text-white"
                                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                              )}
                            >
                              Quick preview
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreviewTab("storybook")}
                              className={cn(
                                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                                previewTab === "storybook"
                                  ? "bg-primary text-white"
                                  : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                              )}
                            >
                              Storybook
                            </button>
                          </div>
                        )}

                        <Link
                          href={selectedEntry.docsHref}
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                        >
                          Docs
                          <span className="material-symbols-outlined text-base">arrow_outward</span>
                        </Link>
                        <Link
                          href={selectedEntry.storybookHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-white/10 dark:bg-slate-900 dark:text-slate-300"
                        >
                          Storybook
                          <span className="material-symbols-outlined text-base">open_in_new</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {previewTab === "quick" && selectedEntry.supportsQuickPreview ? (
                    <PlaygroundPreview
                      entry={selectedEntry}
                      state={currentState}
                      theme={previewTheme}
                      colorScheme={colorScheme}
                    />
                  ) : (
                    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-lg shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950 dark:shadow-black/20">
                      <div className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-white/10">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                            Storybook preview
                          </p>
                          <h3 className="mt-2 text-xl font-black tracking-tight text-slate-900 dark:text-white">
                            {selectedEntry.name}
                          </h3>
                        </div>
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-900 dark:text-slate-300">
                          External preview
                        </span>
                      </div>
                      <iframe
                        title={`${selectedEntry.name} Storybook preview`}
                        src={selectedEntry.storybookEmbedHref}
                        className="h-[640px] w-full bg-white"
                      />
                    </div>
                  )}

                </div>

                <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          Registry
                        </p>
                        <h3 className="mt-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                          Internal metadata
                        </h3>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
                        {selectedEntry.outputFile}
                      </span>
                    </div>

                    <dl className="mt-5 grid gap-4 text-sm">
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                        <dt className="font-semibold text-slate-500 dark:text-slate-400">
                          CLI command
                        </dt>
                        <dd className="mt-2 font-mono text-slate-900 dark:text-slate-100">
                          {selectedEntry.cliCommand}
                        </dd>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                        <dt className="font-semibold text-slate-500 dark:text-slate-400">
                          Internal deps
                        </dt>
                        <dd className="mt-2 flex flex-wrap gap-2">
                          {(selectedEntry.resolvedDeps.length
                            ? selectedEntry.resolvedDeps
                            : ["none"]).map((dependency) => (
                            <span
                              key={dependency}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"
                            >
                              {dependency}
                            </span>
                          ))}
                        </dd>
                      </div>
                      <div className="rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
                        <dt className="font-semibold text-slate-500 dark:text-slate-400">
                          npm deps
                        </dt>
                        <dd className="mt-2 flex flex-wrap gap-2">
                          {(selectedEntry.npmDeps.length
                            ? selectedEntry.npmDeps
                            : ["none"]).map((dependency) => (
                            <span
                              key={dependency}
                              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-slate-950 dark:text-slate-300"
                            >
                              {dependency}
                            </span>
                          ))}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                          Controls
                        </p>
                        <h3 className="mt-2 text-lg font-black tracking-tight text-slate-900 dark:text-white">
                          Quick config
                        </h3>
                      </div>
                      <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
                        {selectedEntry.controls.length} fields
                      </span>
                    </div>

                    {selectedEntry.controls.length ? (
                      <div className="mt-5 grid gap-4">
                        {selectedEntry.controls.map((control) => (
                          <ControlField
                            key={control.id}
                            control={control}
                            value={currentState[control.id]}
                            onChange={(value) => updateControl(selectedEntry, control.id, value)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm leading-6 text-slate-500 dark:border-white/10 dark:bg-slate-900 dark:text-slate-400">
                        This component is browseable in the playground, but it does not have quick controls yet. Use the embedded Storybook preview or open the docs for its recommended composition.
                      </div>
                    )}
                  </div>
                </aside>
              </section>

              <section className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Code output
                    </p>
                    <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                      Ready to copy
                    </h2>
                  </div>
                  <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 dark:border-white/10 dark:bg-slate-950">
                    <button
                      type="button"
                      onClick={() => setCodeTab("usage")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        codeTab === "usage"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                      )}
                    >
                      Usage
                    </button>
                    <button
                      type="button"
                      onClick={() => setCodeTab("source")}
                      className={cn(
                        "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                        codeTab === "source"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                      )}
                    >
                      Source
                    </button>
                  </div>
                </div>

                <CodeBlock
                  filename={
                    codeTab === "usage"
                      ? `${selectedEntry.slug}.example.tsx`
                      : selectedEntry.outputFile
                  }
                  copyText={codeTab === "usage" ? usageSnippet : selectedEntry.sourceCode}
                >
                  {codeTab === "usage" ? usageSnippet : selectedEntry.sourceCode}
                </CodeBlock>

                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      Workflow
                    </p>
                    <ol className="mt-4 grid gap-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                      <li>1. Install the component with the CLI command shown below.</li>
                      <li>2. Drop the generated usage snippet into your feature or demo page.</li>
                      <li>3. Open the docs or Storybook link if you need deeper prop coverage.</li>
                    </ol>
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-slate-950">
                    <CliInstallBlock name={selectedEntry.slug} />
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
