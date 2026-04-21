import { TEMPLATES } from "./templates";

export interface RegistryEntry {
  name: string;
  description: string;
  /** Key in TEMPLATES */
  templateKey: string;
  /** Output filename in user's project */
  outputFile: string;
  /** Other registry entries that must be installed first */
  internalDeps: string[];
  /** npm packages to install */
  npmDeps: string[];
  /** Where the file goes: "components" | "hooks" | "lib" */
  target: "components" | "hooks" | "lib";
}

export const REGISTRY: RegistryEntry[] = [
  // ── Utilities ────────────────────────────────────────────────────────────
  {
    name: "utils",
    description: "cn() utility for merging Tailwind classes",
    templateKey: "utils",
    outputFile: "utils.ts",
    internalDeps: [],
    npmDeps: ["clsx", "tailwind-merge"],
    target: "lib",
  },
  {
    name: "use-animated-mount",
    description: "Hook for managing animated mount/unmount timing",
    templateKey: "use-animated-mount",
    outputFile: "use-animated-mount.ts",
    internalDeps: [],
    npmDeps: [],
    target: "hooks",
  },
  // ── Components ───────────────────────────────────────────────────────────
  {
    name: "accordion",
    description: "Collapsible content sections",
    templateKey: "Accordion",
    outputFile: "Accordion.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "alert",
    description: "Inline status messages",
    templateKey: "Alert",
    outputFile: "Alert.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "alert-dialog",
    description: "Confirmation dialog with destructive actions",
    templateKey: "AlertDialog",
    outputFile: "AlertDialog.tsx",
    internalDeps: ["utils", "use-animated-mount"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "aspect-ratio",
    description: "Container with fixed aspect ratio",
    templateKey: "AspectRatio",
    outputFile: "AspectRatio.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "avatar",
    description: "User avatar with size variants",
    templateKey: "Avatar",
    outputFile: "Avatar.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "badge",
    description: "Status and label tags",
    templateKey: "Badge",
    outputFile: "Badge.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "breadcrumb",
    description: "Navigation breadcrumb trail",
    templateKey: "Breadcrumb",
    outputFile: "Breadcrumb.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "button",
    description: "Primary, secondary, ghost, outline, destructive variants",
    templateKey: "Button",
    outputFile: "Button.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "card",
    description: "Content container with variants",
    templateKey: "Card",
    outputFile: "Card.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "checkbox",
    description: "Controlled checkbox with label",
    templateKey: "Checkbox",
    outputFile: "Checkbox.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "combobox",
    description: "Searchable dropdown select",
    templateKey: "Combobox",
    outputFile: "Combobox.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "command",
    description: "Command palette container",
    templateKey: "Command",
    outputFile: "Command.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "date-picker",
    description: "Date input",
    templateKey: "DatePicker",
    outputFile: "DatePicker.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "dialog",
    description: "Modal dialog with compound sub-components",
    templateKey: "Dialog",
    outputFile: "Dialog.tsx",
    internalDeps: ["utils", "use-animated-mount"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "drawer",
    description: "Slide-in panel (left/right)",
    templateKey: "Drawer",
    outputFile: "Drawer.tsx",
    internalDeps: ["utils", "use-animated-mount"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "dropdown-menu",
    description: "Contextual dropdown",
    templateKey: "DropdownMenu",
    outputFile: "DropdownMenu.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "field",
    description: "Form field wrapper with label, helper text, and error message",
    templateKey: "Field",
    outputFile: "Field.tsx",
    internalDeps: ["utils", "label"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "input",
    description: "Text input with variants",
    templateKey: "Input",
    outputFile: "Input.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "input-group",
    description: "Input with prefix and suffix slots",
    templateKey: "InputGroup",
    outputFile: "InputGroup.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "input-otp",
    description: "Segmented input for OTP/PIN codes",
    templateKey: "InputOTP",
    outputFile: "InputOTP.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "kbd",
    description: "Keyboard shortcut and key combination display",
    templateKey: "Kbd",
    outputFile: "Kbd.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "native-select",
    description: "Styled native select element",
    templateKey: "NativeSelect",
    outputFile: "NativeSelect.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "pagination",
    description: "Page navigation",
    templateKey: "Pagination",
    outputFile: "Pagination.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "popover",
    description: "Floating content anchored to a trigger",
    templateKey: "Popover",
    outputFile: "Popover.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "progress",
    description: "Linear progress bar",
    templateKey: "Progress",
    outputFile: "Progress.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "resizable",
    description: "Resizable panel layout with drag handles",
    templateKey: "Resizable",
    outputFile: "Resizable.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "page-progress",
    description: "Animated top progress bar tied to navigation",
    templateKey: "PageProgress",
    outputFile: "PageProgress.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "radio-group",
    description: "Radio button group",
    templateKey: "RadioGroup",
    outputFile: "RadioGroup.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "search-dialog",
    description: "Full-screen search dialog",
    templateKey: "SearchDialog",
    outputFile: "SearchDialog.tsx",
    internalDeps: ["utils", "use-animated-mount"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "scrollarea",
    description: "Scrollable container with custom scrollbar styling",
    templateKey: "ScrollArea",
    outputFile: "ScrollArea.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "select",
    description: "Native select with styling",
    templateKey: "Select",
    outputFile: "Select.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "separator",
    description: "Horizontal/vertical divider",
    templateKey: "Separator",
    outputFile: "Separator.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "skeleton",
    description: "Loading placeholder shapes",
    templateKey: "Skeleton",
    outputFile: "Skeleton.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "slider",
    description: "Range input",
    templateKey: "Slider",
    outputFile: "Slider.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "spinner",
    description: "Animated circular loading indicator",
    templateKey: "Spinner",
    outputFile: "Spinner.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "switch",
    description: "Toggle switch",
    templateKey: "Switch",
    outputFile: "Slider.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "switch",
    description: "Toggle switch",
    templateKey: "Switch",
    outputFile: "Switch.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "tabs",
    description: "Tabbed content panels",
    templateKey: "Tabs",
    outputFile: "Tabs.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "textarea",
    description: "Multi-line text input",
    templateKey: "Textarea",
    outputFile: "Textarea.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "toast",
    description: "Transient notification",
    templateKey: "Toast",
    outputFile: "Toast.tsx",
    internalDeps: ["utils", "use-animated-mount"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "tooltip",
    description: "Hover tooltip with positioning",
    templateKey: "Tooltip",
    outputFile: "Tooltip.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
  {
    name: "typography",
    description: "Semantic text elements with consistent styling",
    templateKey: "Typography",
    outputFile: "Typography.tsx",
    internalDeps: ["utils"],
    npmDeps: [],
    target: "components",
  },
];

const BY_NAME = new Map(REGISTRY.map((e) => [e.name, e]));

export function getEntry(name: string): RegistryEntry | undefined {
  return BY_NAME.get(name);
}

export function getAll(): RegistryEntry[] {
  return REGISTRY;
}

/** Returns entry + all transitive internalDeps, deps first. */
export function resolve(name: string): RegistryEntry[] {
  const entry = BY_NAME.get(name);
  if (!entry) return [];

  const visited = new Set<string>();
  const result: RegistryEntry[] = [];

  function walk(e: RegistryEntry) {
    if (visited.has(e.name)) return;
    visited.add(e.name);
    for (const dep of e.internalDeps) {
      const d = BY_NAME.get(dep);
      if (d) walk(d);
    }
    result.push(e);
  }

  walk(entry);
  return result;
}

export function getTemplate(key: string): string {
  return TEMPLATES[key] ?? "";
}
