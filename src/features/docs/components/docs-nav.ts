export interface NavItem {
  label: string;
  href: string;
  soon?: true;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const DOCS_NAV: NavGroup[] = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/components/introduction" },
      { label: "Installation", href: "/components/installation" },
      { label: "Theming", href: "/components/theming" },
      { label: "Dark Mode", href: "/components/dark-mode" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "/components/accordion" },
      { label: "Alert", href: "/components/alert" },
      { label: "Alert Dialog", href: "/components/alert-dialog" },
      { label: "Aspect Ratio", href: "/components/aspect-ratio" },
      { label: "Avatar", href: "/components/avatar" },
      { label: "Badge", href: "/components/badge" },
      { label: "Breadcrumb", href: "/components/breadcrumb" },
      { label: "Button", href: "/components/button" },
      { label: "Button Group", href: "/components/button-group" },
      { label: "Calendar", href: "/components/calendar" },
      { label: "Card", href: "/components/card" },
      { label: "Carousel", href: "/components/carousel" },
      { label: "Chart", href: "/components/chart" },
      { label: "Checkbox", href: "/components/checkbox" },
      { label: "Collapsible", href: "/components/collapsible" },
      { label: "Combobox", href: "/components/combobox" },
      { label: "Command", href: "/components/command" },
      { label: "Context Menu", href: "/components/context-menu" },
      { label: "Data Table", href: "/components/data-table" },
      { label: "Date Picker", href: "/components/date-picker" },
      { label: "Dialog", href: "/components/dialog" },
      { label: "Drawer", href: "/components/drawer" },
      { label: "Dropdown Menu", href: "/components/dropdown-menu" },
      { label: "Field", href: "/components/field" },
      { label: "Form", href: "/components/forms" },
      { label: "Hover Card", href: "/components/hover-card" },
      { label: "Input", href: "/components/input" },
      { label: "Input Group", href: "/components/input-group" },
      { label: "Input OTP", href: "/components/input-otp" },
      { label: "Item", href: "/components/item" },
      { label: "Kbd", href: "/components/kbd" },
      { label: "Label", href: "/components/label" },
      { label: "Menubar", href: "/components/menubar" },
      { label: "Native Select", href: "/components/native-select" },
      { label: "Navigation Menu", href: "/components/navigation-menu" },
      { label: "Page Progress", href: "/components/page-progress" },
      { label: "Pagination", href: "/components/pagination" },
      { label: "Popover", href: "/components/popover" },
      { label: "Progress", href: "/components/progress" },
      { label: "Radio Group", href: "/components/radio-group" },
      { label: "Resizable", href: "/components/resizable" },
      { label: "ScrollArea", href: "/components/scroll-area" },
      { label: "Select", href: "/components/select" },
      { label: "Separator", href: "/components/separator" },
      { label: "Sheet", href: "/components/sheet" },
      { label: "Skeleton", href: "/components/skeleton" },
      { label: "Slider", href: "/components/slider" },
      { label: "Spinner", href: "/components/spinner" },
      { label: "Switch", href: "/components/switch" },
      { label: "Table", href: "/components/table" },
      { label: "Tabs", href: "/components/tabs" },
      { label: "Textarea", href: "/components/textarea" },
      { label: "Toast", href: "/components/toast" },
      { label: "Toggle", href: "/components/toggle" },
      { label: "Toggle Group", href: "/components/toggle-group" },
      { label: "Tooltip", href: "/components/tooltip" },
      { label: "Typography", href: "/components/typography" },
    ],
  },
];
