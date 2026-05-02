import { getStorybookComponentUrl, getStorybookEmbedUrl } from "@/features/docs/lib/storybook";
import {
  REGISTRY,
  getTemplate,
  resolve,
  type RegistryEntry,
} from "../../../../packages/cli/src/registry";

export type PlaygroundFramework = "nextjs" | "vitejs";
export type PlaygroundTheme = "light" | "dark";
export type PlaygroundColorScheme = "indigo" | "emerald" | "amber" | "rose";
export type PlaygroundControlValue = string | boolean;
export type PlaygroundControlState = Record<string, PlaygroundControlValue>;

export interface PlaygroundControlOption {
  label: string;
  value: string;
}

export interface PlaygroundControlDefinition {
  id: string;
  label: string;
  type: "select" | "boolean" | "text";
  options?: PlaygroundControlOption[];
  placeholder?: string;
  helperText?: string;
}

export interface PlaygroundEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  docsHref: string;
  storybookHref: string;
  storybookEmbedHref: string;
  cliCommand: string;
  outputFile: string;
  templateKey: string;
  sourceCode: string;
  npmDeps: string[];
  internalDeps: string[];
  resolvedDeps: string[];
  controls: PlaygroundControlDefinition[];
  initialState: PlaygroundControlState;
  supportsQuickPreview: boolean;
}

const CATEGORY_BY_SLUG: Record<string, string> = {
  accordion: "Navigation",
  alert: "Feedback",
  "alert-dialog": "Overlays",
  avatar: "Data Display",
  badge: "Feedback",
  breadcrumb: "Navigation",
  button: "Actions",
  card: "Data Display",
  checkbox: "Forms",
  combobox: "Forms",
  command: "Navigation",
  "date-picker": "Forms",
  dialog: "Overlays",
  drawer: "Overlays",
  "dropdown-menu": "Overlays",
  input: "Forms",
  pagination: "Navigation",
  popover: "Overlays",
  progress: "Feedback",
  "page-progress": "Feedback",
  "radio-group": "Forms",
  "search-dialog": "Overlays",
  select: "Forms",
  separator: "Layout",
  skeleton: "Feedback",
  slider: "Forms",
  switch: "Forms",
  tabs: "Navigation",
  textarea: "Forms",
  toast: "Feedback",
  tooltip: "Overlays",
};

const TAGS_BY_SLUG: Record<string, string[]> = {
  accordion: ["collapsible", "faq"],
  alert: ["status", "inline"],
  "alert-dialog": ["confirmation", "destructive"],
  avatar: ["identity", "profile"],
  badge: ["status", "tags"],
  breadcrumb: ["hierarchy", "routing"],
  button: ["cta", "loading"],
  card: ["container", "layout"],
  checkbox: ["selection", "forms"],
  combobox: ["search", "selection"],
  command: ["palette", "search"],
  "date-picker": ["date", "forms"],
  dialog: ["modal", "focus"],
  drawer: ["panel", "slideover"],
  "dropdown-menu": ["menu", "actions"],
  input: ["forms", "text"],
  pagination: ["listing", "navigation"],
  popover: ["floating", "contextual"],
  progress: ["loading", "status"],
  "page-progress": ["navigation", "loading"],
  "radio-group": ["forms", "single-choice"],
  "search-dialog": ["search", "overlay"],
  select: ["forms", "native"],
  separator: ["layout", "divider"],
  skeleton: ["loading", "placeholder"],
  slider: ["range", "input"],
  switch: ["toggle", "boolean"],
  tabs: ["navigation", "content"],
  textarea: ["forms", "multiline"],
  toast: ["notification", "ephemeral"],
  tooltip: ["help", "hover"],
};

const CONTROL_DEFINITIONS_BY_SLUG: Record<string, PlaygroundControlDefinition[]> = {
  accordion: [
    {
      id: "type",
      label: "Type",
      type: "select",
      options: [
        { label: "Single", value: "single" },
        { label: "Multiple", value: "multiple" },
      ],
    },
    {
      id: "openSecond",
      label: "Open second item",
      type: "boolean",
    },
  ],
  "alert-dialog": [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Warning", value: "warning" },
        { label: "Destructive", value: "destructive" },
      ],
    },
    {
      id: "open",
      label: "Open",
      type: "boolean",
    },
    {
      id: "isLoading",
      label: "Loading",
      type: "boolean",
    },
  ],
  alert: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
        { label: "Info", value: "info" },
      ],
    },
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Deployment status",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Everything shipped successfully.",
    },
    {
      id: "showAction",
      label: "Show action",
      type: "boolean",
    },
  ],
  avatar: [
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "XL", value: "xl" },
      ],
    },
    {
      id: "fallback",
      label: "Fallback text",
      type: "text",
      placeholder: "RP",
    },
    {
      id: "showImage",
      label: "Show image",
      type: "boolean",
    },
  ],
  badge: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
        { label: "Info", value: "info" },
        { label: "Outline", value: "outline" },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Beta access",
    },
  ],
  button: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Ghost", value: "ghost" },
        { label: "Outline", value: "outline" },
        { label: "Destructive", value: "destructive" },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Create recipe",
    },
    {
      id: "isLoading",
      label: "Loading state",
      type: "boolean",
    },
    {
      id: "disabled",
      label: "Disabled",
      type: "boolean",
    },
  ],
  breadcrumb: [
    {
      id: "separator",
      label: "Separator",
      type: "select",
      options: [
        { label: "Slash", value: "/" },
        { label: "Chevron", value: ">" },
        { label: "Dot", value: "•" },
      ],
    },
  ],
  card: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Elevated", value: "elevated" },
        { label: "Flat", value: "flat" },
      ],
    },
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Conversion snapshot",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Weekly signups are ahead of target.",
    },
    {
      id: "showFooter",
      label: "Show footer actions",
      type: "boolean",
    },
  ],
  checkbox: [
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Ship docs examples",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Enable polished examples in the docs site.",
    },
    {
      id: "checked",
      label: "Checked",
      type: "boolean",
    },
    {
      id: "indeterminate",
      label: "Indeterminate",
      type: "boolean",
      helperText: "Useful for partial selection states.",
    },
  ],
  combobox: [
    {
      id: "value",
      label: "Selected option",
      type: "select",
      options: [
        { label: "Next.js", value: "nextjs" },
        { label: "Vite", value: "vitejs" },
        { label: "Storybook", value: "storybook" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Stack",
    },
  ],
  command: [
    {
      id: "query",
      label: "Initial query",
      type: "text",
      placeholder: "search docs",
    },
  ],
  "date-picker": [
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Publish date",
    },
    {
      id: "value",
      label: "Value",
      type: "text",
      placeholder: "2026-04-14",
    },
    {
      id: "showError",
      label: "Show error",
      type: "boolean",
    },
  ],
  input: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Filled", value: "filled" },
        { label: "Ghost", value: "ghost" },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Email address",
    },
    {
      id: "placeholder",
      label: "Placeholder",
      type: "text",
      placeholder: "name@company.com",
    },
    {
      id: "showError",
      label: "Show error",
      type: "boolean",
    },
  ],
  dialog: [
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "XL", value: "xl" },
      ],
    },
    {
      id: "open",
      label: "Open",
      type: "boolean",
    },
  ],
  drawer: [
    {
      id: "side",
      label: "Side",
      type: "select",
      options: [
        { label: "Right", value: "right" },
        { label: "Left", value: "left" },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
        { label: "Full", value: "full" },
      ],
    },
    {
      id: "open",
      label: "Open",
      type: "boolean",
    },
  ],
  "dropdown-menu": [
    {
      id: "open",
      label: "Open",
      type: "boolean",
    },
    {
      id: "showLabel",
      label: "Show section label",
      type: "boolean",
    },
  ],
  "page-progress": [
    {
      id: "progress",
      label: "Progress",
      type: "select",
      options: [
        { label: "15", value: "15" },
        { label: "45", value: "45" },
        { label: "80", value: "80" },
        { label: "100", value: "100" },
      ],
    },
    {
      id: "visible",
      label: "Visible",
      type: "boolean",
    },
  ],
  pagination: [
    {
      id: "page",
      label: "Current page",
      type: "select",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
        { label: "3", value: "3" },
        { label: "4", value: "4" },
        { label: "5", value: "5" },
      ],
    },
    {
      id: "totalPages",
      label: "Total pages",
      type: "select",
      options: [
        { label: "5", value: "5" },
        { label: "8", value: "8" },
        { label: "12", value: "12" },
      ],
    },
    {
      id: "siblingCount",
      label: "Sibling count",
      type: "select",
      options: [
        { label: "1", value: "1" },
        { label: "2", value: "2" },
      ],
    },
  ],
  progress: [
    {
      id: "value",
      label: "Value",
      type: "select",
      options: [
        { label: "10", value: "10" },
        { label: "35", value: "35" },
        { label: "60", value: "60" },
        { label: "85", value: "85" },
      ],
    },
    {
      id: "max",
      label: "Max",
      type: "select",
      options: [
        { label: "100", value: "100" },
        { label: "120", value: "120" },
      ],
    },
  ],
  popover: [
    {
      id: "side",
      label: "Side",
      type: "select",
      options: [
        { label: "Bottom", value: "bottom" },
        { label: "Top", value: "top" },
      ],
    },
    {
      id: "align",
      label: "Align",
      type: "select",
      options: [
        { label: "Start", value: "start" },
        { label: "Center", value: "center" },
        { label: "End", value: "end" },
      ],
    },
    {
      id: "open",
      label: "Open",
      type: "boolean",
    },
  ],
  "radio-group": [
    {
      id: "value",
      label: "Selected option",
      type: "select",
      options: [
        { label: "Next.js", value: "nextjs" },
        { label: "Vite", value: "vitejs" },
        { label: "Remix", value: "remix" },
      ],
    },
    {
      id: "showDescriptions",
      label: "Show descriptions",
      type: "boolean",
    },
  ],
  select: [
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Framework",
    },
    {
      id: "placeholder",
      label: "Placeholder",
      type: "text",
      placeholder: "Choose framework",
    },
    {
      id: "showDescription",
      label: "Show description",
      type: "boolean",
    },
  ],
  "search-dialog": [
    {
      id: "open",
      label: "Open",
      type: "boolean",
    },
    {
      id: "query",
      label: "Seed query",
      type: "text",
      placeholder: "button",
    },
  ],
  separator: [
    {
      id: "orientation",
      label: "Orientation",
      type: "select",
      options: [
        { label: "Horizontal", value: "horizontal" },
        { label: "Vertical", value: "vertical" },
      ],
    },
  ],
  skeleton: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Line", value: "line" },
        { label: "Rectangle", value: "rect" },
        { label: "Circle", value: "circle" },
      ],
    },
    {
      id: "width",
      label: "Width",
      type: "select",
      options: [
        { label: "80", value: "80" },
        { label: "160", value: "160" },
        { label: "240", value: "240" },
      ],
    },
  ],
  slider: [
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Volume",
    },
    {
      id: "value",
      label: "Value",
      type: "select",
      options: [
        { label: "10", value: "10" },
        { label: "25", value: "25" },
        { label: "50", value: "50" },
        { label: "75", value: "75" },
        { label: "90", value: "90" },
      ],
    },
    {
      id: "showValue",
      label: "Show numeric value",
      type: "boolean",
    },
  ],
  switch: [
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Enable notifications",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Ship product alerts to the current workspace.",
    },
    {
      id: "checked",
      label: "Enabled",
      type: "boolean",
    },
  ],
  tabs: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Underline", value: "underline" },
        { label: "Pills", value: "pills" },
      ],
    },
    {
      id: "firstLabel",
      label: "First tab",
      type: "text",
      placeholder: "Overview",
    },
    {
      id: "secondLabel",
      label: "Second tab",
      type: "text",
      placeholder: "API",
    },
    {
      id: "thirdLabel",
      label: "Third tab",
      type: "text",
      placeholder: "Examples",
    },
  ],
  textarea: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Filled", value: "filled" },
        { label: "Ghost", value: "ghost" },
      ],
    },
    {
      id: "size",
      label: "Size",
      type: "select",
      options: [
        { label: "Small", value: "sm" },
        { label: "Medium", value: "md" },
        { label: "Large", value: "lg" },
      ],
    },
    {
      id: "label",
      label: "Label",
      type: "text",
      placeholder: "Release notes",
    },
    {
      id: "placeholder",
      label: "Placeholder",
      type: "text",
      placeholder: "Summarize what changed in this release...",
    },
    {
      id: "showError",
      label: "Show error",
      type: "boolean",
    },
  ],
  toast: [
    {
      id: "variant",
      label: "Variant",
      type: "select",
      options: [
        { label: "Default", value: "default" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
      ],
    },
    {
      id: "position",
      label: "Position",
      type: "select",
      options: [
        { label: "Top right", value: "top-right" },
        { label: "Bottom right", value: "bottom-right" },
        { label: "Top left", value: "top-left" },
        { label: "Bottom left", value: "bottom-left" },
      ],
    },
    {
      id: "title",
      label: "Title",
      type: "text",
      placeholder: "Changes saved",
    },
    {
      id: "description",
      label: "Description",
      type: "text",
      placeholder: "Your component settings are ready to ship.",
    },
  ],
  tooltip: [
    {
      id: "side",
      label: "Side",
      type: "select",
      options: [
        { label: "Top", value: "top" },
        { label: "Bottom", value: "bottom" },
        { label: "Left", value: "left" },
        { label: "Right", value: "right" },
      ],
    },
    {
      id: "defaultOpen",
      label: "Open by default",
      type: "boolean",
    },
    {
      id: "label",
      label: "Tooltip text",
      type: "text",
      placeholder: "Copy install command",
    },
  ],
};

const INITIAL_STATE_BY_SLUG: Record<string, PlaygroundControlState> = {
  accordion: {
    type: "single",
    openSecond: true,
  },
  "alert-dialog": {
    variant: "destructive",
    open: true,
    isLoading: false,
  },
  alert: {
    variant: "success",
    title: "Deployment status",
    description: "Everything shipped successfully to staging.",
    showAction: true,
  },
  avatar: {
    size: "lg",
    fallback: "RP",
    showImage: true,
  },
  badge: {
    variant: "info",
    size: "md",
    label: "Early access",
  },
  breadcrumb: {
    separator: "/",
  },
  button: {
    variant: "primary",
    size: "md",
    label: "Create recipe",
    isLoading: false,
    disabled: false,
  },
  card: {
    variant: "elevated",
    title: "Conversion snapshot",
    description: "Weekly signups are ahead of target and churn remains stable.",
    showFooter: true,
  },
  checkbox: {
    size: "md",
    label: "Ship docs examples",
    description: "Enable polished examples in the docs site.",
    checked: true,
    indeterminate: false,
  },
  combobox: {
    value: "nextjs",
    label: "Stack",
  },
  command: {
    query: "docs",
  },
  "date-picker": {
    label: "Publish date",
    value: "2026-04-14",
    showError: false,
  },
  dialog: {
    size: "md",
    open: true,
  },
  drawer: {
    side: "right",
    size: "md",
    open: true,
  },
  "dropdown-menu": {
    open: true,
    showLabel: true,
  },
  input: {
    variant: "default",
    size: "md",
    label: "Email address",
    placeholder: "name@company.com",
    showError: false,
  },
  pagination: {
    page: "3",
    totalPages: "8",
    siblingCount: "1",
  },
  "page-progress": {
    progress: "45",
    visible: true,
  },
  popover: {
    side: "bottom",
    align: "start",
    open: true,
  },
  progress: {
    value: "60",
    max: "100",
  },
  "radio-group": {
    value: "nextjs",
    showDescriptions: true,
  },
  select: {
    size: "md",
    label: "Framework",
    placeholder: "Choose framework",
    showDescription: true,
  },
  "search-dialog": {
    open: true,
    query: "button",
  },
  separator: {
    orientation: "horizontal",
  },
  skeleton: {
    variant: "line",
    width: "160",
  },
  slider: {
    label: "Volume",
    value: "50",
    showValue: true,
  },
  switch: {
    size: "md",
    label: "Enable notifications",
    description: "Ship product alerts to the current workspace.",
    checked: true,
  },
  tabs: {
    variant: "underline",
    firstLabel: "Overview",
    secondLabel: "API",
    thirdLabel: "Examples",
  },
  textarea: {
    variant: "default",
    size: "md",
    label: "Release notes",
    placeholder: "Summarize what changed in this release...",
    showError: false,
  },
  toast: {
    variant: "success",
    position: "top-right",
    title: "Changes saved",
    description: "Your component settings are ready to ship.",
  },
  tooltip: {
    side: "top",
    defaultOpen: true,
    label: "Copy install command",
  },
};

function titleize(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getFrameworkImportPath(framework: PlaygroundFramework, outputFile: string) {
  const basePath = "@/components/ui";

  return `${basePath}/${outputFile.replace(/\.tsx$/, "")}`;
}

function getPlaygroundCategory(entry: RegistryEntry) {
  return CATEGORY_BY_SLUG[entry.name] ?? "Components";
}

function getPlaygroundTags(entry: RegistryEntry) {
  return TAGS_BY_SLUG[entry.name] ?? [entry.target];
}

const PLAYGROUND_ENTRIES: PlaygroundEntry[] = REGISTRY
  .filter((entry) => entry.target === "components")
  .map((entry) => {
    const dependencies = resolve(entry.name)
      .filter((resolvedEntry) => resolvedEntry.name !== entry.name)
      .map((resolvedEntry) => resolvedEntry.name);

    return {
      slug: entry.name,
      name: titleize(entry.name),
      description: entry.description,
      category: getPlaygroundCategory(entry),
      tags: getPlaygroundTags(entry),
      docsHref: `/docs/${entry.name}`,
      storybookHref: getStorybookComponentUrl(entry.name),
      storybookEmbedHref: getStorybookEmbedUrl(entry.name),
      cliCommand: `npx react-principles add ${entry.name}`,
      outputFile: entry.outputFile,
      templateKey: entry.templateKey,
      sourceCode: getTemplate(entry.templateKey),
      npmDeps: entry.npmDeps,
      internalDeps: entry.internalDeps,
      resolvedDeps: dependencies,
      controls: CONTROL_DEFINITIONS_BY_SLUG[entry.name] ?? [],
      initialState: INITIAL_STATE_BY_SLUG[entry.name] ?? {},
      supportsQuickPreview: entry.name in CONTROL_DEFINITIONS_BY_SLUG,
    };
  })
  .sort((left, right) => left.name.localeCompare(right.name));

export function getPlaygroundEntries() {
  return PLAYGROUND_ENTRIES;
}

export function getPlaygroundEntry(slug: string) {
  return PLAYGROUND_ENTRIES.find((entry) => entry.slug === slug);
}

export function getDefaultPlaygroundEntry() {
  return getPlaygroundEntry("button") ?? PLAYGROUND_ENTRIES[0];
}

function stringifyAttribute(name: string, value: string | boolean) {
  if (typeof value === "boolean") {
    return value ? ` ${name}` : "";
  }

  return value ? ` ${name}="${value}"` : "";
}

export function buildUsageSnippet(
  entry: PlaygroundEntry,
  framework: PlaygroundFramework,
  state: PlaygroundControlState,
) {
  const importPath = getFrameworkImportPath(framework, entry.outputFile);
  const importPrefix = framework === "nextjs" ? `"use client";\n\nimport` : "import";

  switch (entry.slug) {
    case "accordion": {
      const type = String(state.type ?? "single");
      const openSecond = Boolean(state.openSecond);

      return `${importPrefix} { Accordion } from "${importPath}";

export function Example() {
  return (
    <Accordion type="${type}" defaultValue={${type === "multiple" ? openSecond ? '["item-2"]' : "[]" : openSecond ? '"item-2"' : '""'}}>
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
  );
}`;
    }

    case "alert-dialog": {
      const variant = String(state.variant ?? "default");
      const open = Boolean(state.open);
      const isLoading = Boolean(state.isLoading);

      return `${importPrefix} { AlertDialog } from "${importPath}";

export function Example() {
  return (
    <AlertDialog
      open={${open}}
      onClose={() => {}}
      onConfirm={() => {}}
      variant="${variant}"
      isLoading={${isLoading}}
      title="Delete component preset?"
      description="This removes the saved playground preset from your workspace."
      confirmLabel="Delete preset"
    />
  );
}`;
    }

    case "alert": {
      const title = String(state.title ?? "Deployment status");
      const description = String(state.description ?? "Everything shipped successfully.");
      const variant = String(state.variant ?? "default");
      const showAction = Boolean(state.showAction);

      return `${importPrefix} { Alert } from "${importPath}";

export function Example() {
  return (
    <Alert variant="${variant}">
      <Alert.Title>${title}</Alert.Title>
      <Alert.Description>
        ${description}
      </Alert.Description>${showAction ? `
      <Alert.Footer>
        <Alert.Action>Review changes</Alert.Action>
      </Alert.Footer>` : ""}
    </Alert>
  );
}`;
    }

    case "avatar": {
      const size = String(state.size ?? "md");
      const fallback = String(state.fallback ?? "RP");
      const showImage = Boolean(state.showImage);

      return `${importPrefix} { Avatar } from "${importPath}";

export function Example() {
  return (
    <Avatar size="${size}">
      ${showImage ? '<Avatar.Image src="https://i.pravatar.cc/160?img=12" alt="Profile" />\n      ' : ""}<Avatar.Fallback>${fallback}</Avatar.Fallback>
    </Avatar>
  );
}`;
    }

    case "badge": {
      const variant = String(state.variant ?? "default");
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Early access");

      return `${importPrefix} { Badge } from "${importPath}";

export function Example() {
  return <Badge variant="${variant}" size="${size}">${label}</Badge>;
}`;
    }

    case "breadcrumb": {
      const separator = String(state.separator ?? "/");

      return `${importPrefix} { Breadcrumb } from "${importPath}";

export function Example() {
  return (
    <Breadcrumb>
      <Breadcrumb.List>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Docs</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>${separator}</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Link href="#">Playground</Breadcrumb.Link>
        </Breadcrumb.Item>
        <Breadcrumb.Separator>${separator}</Breadcrumb.Separator>
        <Breadcrumb.Item>
          <Breadcrumb.Page>Button</Breadcrumb.Page>
        </Breadcrumb.Item>
      </Breadcrumb.List>
    </Breadcrumb>
  );
}`;
    }

    case "button": {
      const variant = String(state.variant ?? "primary");
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Create recipe");
      const isLoading = Boolean(state.isLoading);
      const disabled = Boolean(state.disabled);

      return `${importPrefix} { Button } from "${importPath}";

export function Example() {
  return (
    <Button${stringifyAttribute("variant", variant)}${stringifyAttribute("size", size)}${stringifyAttribute("isLoading", isLoading)}${stringifyAttribute("disabled", disabled)}>
      ${label}
    </Button>
  );
}`;
    }

    case "card": {
      const variant = String(state.variant ?? "default");
      const title = String(state.title ?? "Conversion snapshot");
      const description = String(state.description ?? "Weekly signups are ahead of target.");
      const showFooter = Boolean(state.showFooter);

      return `${importPrefix} { Card } from "${importPath}";
import { Button } from "@/components/ui/Button";

export function Example() {
  return (
    <Card variant="${variant}">
      <Card.Header>
        <Card.Title>${title}</Card.Title>
        <Card.Description>${description}</Card.Description>
      </Card.Header>
      <Card.Content>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Drop metrics, summaries, or content blocks here.
        </p>
      </Card.Content>${showFooter ? `
      <Card.Footer>
        <Button size="sm">Review</Button>
        <Button size="sm" variant="ghost">Dismiss</Button>
      </Card.Footer>` : ""}
    </Card>
  );
}`;
    }

    case "checkbox": {
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Ship docs examples");
      const description = String(state.description ?? "Enable polished examples in the docs site.");
      const checked = Boolean(state.checked);
      const indeterminate = Boolean(state.indeterminate);

      return `${importPrefix} { Checkbox } from "${importPath}";

export function Example() {
  return (
    <Checkbox
      size="${size}"
      label="${label}"
      description="${description}"
      checked={${checked}}
      indeterminate={${indeterminate}}
      onChange={() => {}}
    />
  );
}`;
    }

    case "combobox": {
      const value = String(state.value ?? "nextjs");
      const label = String(state.label ?? "Stack");

      return `${importPrefix} { Combobox } from "${importPath}";

const options = [
  { label: "Next.js", value: "nextjs", description: "App Router and server rendering." },
  { label: "Vite", value: "vitejs", description: "Fast local iteration for SPA workflows." },
  { label: "Storybook", value: "storybook", description: "Visual review and component development." },
];

export function Example() {
  return (
    <Combobox
      label="${label}"
      options={options}
      value="${value}"
      onValueChange={() => {}}
    />
  );
}`;
    }

    case "command": {
      const query = String(state.query ?? "docs");

      return `${importPrefix} { Command } from "${importPath}";

export function Example() {
  return (
    <Command initialQuery="${query}">
      <Command.Input placeholder="Search docs, patterns, components..." />
      <Command.List>
        <Command.Group>
          <Command.Label>Docs</Command.Label>
          <Command.Item value="button" keywords={["action", "cta"]}>Button</Command.Item>
          <Command.Item value="dialog" keywords={["modal", "overlay"]}>Dialog</Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  );
}`;
    }

    case "date-picker": {
      const label = String(state.label ?? "Publish date");
      const value = String(state.value ?? "2026-04-14");
      const showError = Boolean(state.showError);

      return `${importPrefix} { DatePicker } from "${importPath}";

export function Example() {
  return (
    <DatePicker
      label="${label}"
      value="${value}"
      ${showError ? 'error="Choose a valid publication date."' : 'description="Used to schedule the component release."'}
      onChange={() => {}}
    />
  );
}`;
    }

    case "dialog": {
      const size = String(state.size ?? "md");
      const open = Boolean(state.open);

      return `${importPrefix} { Dialog } from "${importPath}";

export function Example() {
  return (
    <Dialog open={${open}} onClose={() => {}} size="${size}">
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
        <button type="button">Cancel</button>
        <button type="button">Continue</button>
      </Dialog.Footer>
    </Dialog>
  );
}`;
    }

    case "drawer": {
      const side = String(state.side ?? "right");
      const size = String(state.size ?? "md");
      const open = Boolean(state.open);

      return `${importPrefix} { Drawer } from "${importPath}";

export function Example() {
  return (
    <Drawer open={${open}} onClose={() => {}} side="${side}" size="${size}">
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
        <button type="button">Close</button>
      </Drawer.Footer>
    </Drawer>
  );
}`;
    }

    case "dropdown-menu": {
      const open = Boolean(state.open);
      const showLabel = Boolean(state.showLabel);

      return `${importPrefix} { DropdownMenu } from "${importPath}";

export function Example() {
  return (
    <DropdownMenu open={${open}} onOpenChange={() => {}}>
      <DropdownMenu.Trigger>Open menu</DropdownMenu.Trigger>
      <DropdownMenu.Content>
        ${showLabel ? "<DropdownMenu.Label>Actions</DropdownMenu.Label>\n        " : ""}<DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item>Edit</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Archive</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}`;
    }

    case "input": {
      const variant = String(state.variant ?? "default");
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Email address");
      const placeholder = String(state.placeholder ?? "name@company.com");
      const showError = Boolean(state.showError);

      return `${importPrefix} { Input } from "${importPath}";

export function Example() {
  return (
    <Input
      variant="${variant}"
      size="${size}"
      label="${label}"
      placeholder="${placeholder}"
      ${showError ? 'error="Enter a valid email address."' : 'description="We only use this for product updates."'}
    />
  );
}`;
    }

    case "pagination": {
      const page = Number(state.page ?? 3);
      const totalPages = Number(state.totalPages ?? 8);
      const siblingCount = Number(state.siblingCount ?? 1);

      return `${importPrefix} { Pagination } from "${importPath}";

export function Example() {
  return (
    <Pagination
      page={${page}}
      totalPages={${totalPages}}
      siblingCount={${siblingCount}}
      onPageChange={() => {}}
    />
  );
}`;
    }

    case "page-progress": {
      const progress = Number(state.progress ?? 45);
      const visible = Boolean(state.visible);

      return `${importPrefix} { PageProgress } from "${importPath}";

export function Example() {
  return <PageProgress progress={${progress}} visible={${visible}} />;
}`;
    }

    case "progress": {
      const value = Number(state.value ?? 60);
      const max = Number(state.max ?? 100);

      return `${importPrefix} { Progress } from "${importPath}";

export function Example() {
  return <Progress value={${value}} max={${max}} />;
}`;
    }

    case "popover": {
      const side = String(state.side ?? "bottom");
      const align = String(state.align ?? "start");
      const open = Boolean(state.open);

      return `${importPrefix} { Popover } from "${importPath}";

export function Example() {
  return (
    <Popover open={${open}} onOpenChange={() => {}} side="${side}" align="${align}">
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
  );
}`;
    }

    case "radio-group": {
      const value = String(state.value ?? "nextjs");
      const showDescriptions = Boolean(state.showDescriptions);

      return `${importPrefix} { RadioGroup } from "${importPath}";

export function Example() {
  return (
    <RadioGroup value="${value}" onValueChange={() => {}}>
      <RadioGroup.Item
        value="nextjs"
        label="Next.js"${showDescriptions ? `
        description="App Router, server rendering, and integrated routing."` : ""}
      />
      <RadioGroup.Item
        value="vitejs"
        label="Vite"${showDescriptions ? `
        description="Lean client-side tooling with fast local iteration."` : ""}
      />
      <RadioGroup.Item
        value="remix"
        label="Remix"${showDescriptions ? `
        description="Nested routes with server-first data workflows."` : ""}
      />
    </RadioGroup>
  );
}`;
    }

    case "select": {
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Framework");
      const placeholder = String(state.placeholder ?? "Choose framework");
      const showDescription = Boolean(state.showDescription);

      return `${importPrefix} { Select } from "${importPath}";

const frameworkOptions = [
  { label: "Next.js", value: "nextjs" },
  { label: "Vite", value: "vite" },
  { label: "Storybook", value: "storybook" },
];

export function Example() {
  return (
    <Select
      size="${size}"
      label="${label}"
      placeholder="${placeholder}"
      options={frameworkOptions}
      ${showDescription ? 'description="Keep generated examples aligned with your app shell."' : ""}
    />
  );
}`;
    }

    case "search-dialog": {
      const open = Boolean(state.open);
      const query = String(state.query ?? "button");

      return `${importPrefix} { SearchDialog } from "${importPath}";

const items = [
  { title: "Button", href: "/docs/button", group: "Docs", section: "Components" },
  { title: "Dialog", href: "/docs/dialog", group: "Docs", section: "Components" },
  { title: "Form Validation", href: "/nextjs/cookbook/form-validation", group: "Cookbook", description: "Schema-first forms with React Hook Form" },
];

export function Example() {
  return (
    <SearchDialog
      open={${open}}
      items={items}
      initialQuery="${query}"
      onClose={() => {}}
      onNavigate={() => {}}
    />
  );
}`;
    }

    case "separator": {
      const orientation = String(state.orientation ?? "horizontal");

      return `${importPrefix} { Separator } from "${importPath}";

export function Example() {
  return (
    <div className="${orientation === "horizontal" ? "w-full" : "h-24"}">
      <Separator orientation="${orientation}" />
    </div>
  );
}`;
    }

    case "skeleton": {
      const variant = String(state.variant ?? "line");
      const width = Number(state.width ?? 160);

      return `${importPrefix} { Skeleton } from "${importPath}";

export function Example() {
  return <Skeleton variant="${variant}" width={${width}} />;
}`;
    }

    case "slider": {
      const label = String(state.label ?? "Volume");
      const value = Number(state.value ?? 50);
      const showValue = Boolean(state.showValue);

      return `${importPrefix} { Slider } from "${importPath}";

export function Example() {
  return (
    <Slider
      label="${label}"
      defaultValue={${value}}
      showValue={${showValue}}
      onValueChange={() => {}}
    />
  );
}`;
    }

    case "switch": {
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Enable notifications");
      const description = String(
        state.description ?? "Ship product alerts to the current workspace.",
      );
      const checked = Boolean(state.checked);

      return `${importPrefix} { Switch } from "${importPath}";

export function Example() {
  return (
    <Switch
      size="${size}"
      label="${label}"
      description="${description}"
      checked={${checked}}
      onChange={() => {}}
    />
  );
}`;
    }

    case "tabs": {
      const variant = String(state.variant ?? "underline");
      const firstLabel = String(state.firstLabel ?? "Overview");
      const secondLabel = String(state.secondLabel ?? "API");
      const thirdLabel = String(state.thirdLabel ?? "Examples");

      return `${importPrefix} { Tabs } from "${importPath}";

export function Example() {
  return (
    <Tabs defaultValue="overview" variant="${variant}">
      <Tabs.List>
        <Tabs.Trigger value="overview">${firstLabel}</Tabs.Trigger>
        <Tabs.Trigger value="api">${secondLabel}</Tabs.Trigger>
        <Tabs.Trigger value="examples">${thirdLabel}</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">Start with intent and behavior.</Tabs.Content>
      <Tabs.Content value="api">Document props, variants, and defaults.</Tabs.Content>
      <Tabs.Content value="examples">Show production-ready combinations.</Tabs.Content>
    </Tabs>
  );
}`;
    }

    case "textarea": {
      const variant = String(state.variant ?? "default");
      const size = String(state.size ?? "md");
      const label = String(state.label ?? "Release notes");
      const placeholder = String(
        state.placeholder ?? "Summarize what changed in this release...",
      );
      const showError = Boolean(state.showError);

      return `${importPrefix} { Textarea } from "${importPath}";

export function Example() {
  return (
    <Textarea
      variant="${variant}"
      size="${size}"
      label="${label}"
      placeholder="${placeholder}"
      ${showError ? 'error="Please add enough detail before publishing."' : 'description="This summary appears in changelog emails and product updates."'}
    />
  );
}`;
    }

    case "toast": {
      const variant = String(state.variant ?? "default");
      const position = String(state.position ?? "top-right");
      const title = String(state.title ?? "Changes saved");
      const description = String(
        state.description ?? "Your component settings are ready to ship.",
      );

      return `${importPrefix} { Toast } from "${importPath}";
import { useState } from "react";

export function Example() {
  const [open, setOpen] = useState(true);

  return (
    <Toast open={open} onOpenChange={setOpen} variant="${variant}" position="${position}">
      <Toast.Title>${title}</Toast.Title>
      <Toast.Description>${description}</Toast.Description>
      <Toast.Footer>
        <Toast.Close />
      </Toast.Footer>
    </Toast>
  );
}`;
    }

    case "tooltip": {
      const side = String(state.side ?? "top");
      const defaultOpen = Boolean(state.defaultOpen);
      const label = String(state.label ?? "Copy install command");

      return `${importPrefix} { Tooltip } from "${importPath}";

export function Example() {
  return (
    <Tooltip side="${side}" defaultOpen={${defaultOpen}}>
      <Tooltip.Trigger>
        <span>Hover target</span>
      </Tooltip.Trigger>
      <Tooltip.Content>${label}</Tooltip.Content>
    </Tooltip>
  );
}`;
    }

    default:
      return `${importPrefix} { ${entry.templateKey} } from "${importPath}";

export function Example() {
  return (
    <div>
      <p>Install this component with the CLI, then open the docs or Storybook preview for its recommended composition.</p>
    </div>
  );
}`;
  }
}
