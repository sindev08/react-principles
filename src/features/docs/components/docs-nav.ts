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
      { label: "Introduction", href: "/docs/introduction" },
      { label: "Installation", href: "/docs/installation" },
      { label: "Theming", href: "/docs/theming" },
      { label: "Dark Mode", href: "/docs/dark-mode" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "/docs/accordion" },
      { label: "Alert", href: "/docs/alert" },
      { label: "Alert Dialog", href: "/docs/alert-dialog" },
      { label: "Avatar", href: "/docs/avatar" },
      { label: "Badge", href: "/docs/badge" },
      { label: "Breadcrumb", href: "/docs/breadcrumb" },
      { label: "Button", href: "/docs/button" },
      { label: "Card", href: "/docs/card" },
      { label: "Checkbox", href: "/docs/checkbox" },
      { label: "Combobox", href: "/docs/combobox" },
      { label: "Command", href: "/docs/command" },
      { label: "Date Picker", href: "/docs/date-picker" },
      { label: "Dialog", href: "/docs/dialog" },
      { label: "Dropdown Menu", href: "/docs/dropdown-menu" },
      { label: "Drawer", href: "/docs/drawer" },
      { label: "Form", href: "/docs/forms" },
      { label: "Input", href: "/docs/input" },
      { label: "Pagination", href: "/docs/pagination" },
      { label: "Page Progress", href: "/docs/page-progress" },
      { label: "Popover", href: "/docs/popover" },
      { label: "Progress", href: "/docs/progress" },
      { label: "Radio Group", href: "/docs/radio-group" },
      { label: "Select", href: "/docs/select" },
      { label: "Separator", href: "/docs/separator" },
      { label: "Skeleton", href: "/docs/skeleton" },
      { label: "Slider", href: "/docs/slider" },
      { label: "Switch", href: "/docs/switch" },
      { label: "Table", href: "/docs/table" },
      { label: "Tabs", href: "/docs/tabs" },
      { label: "Textarea", href: "/docs/textarea" },
      { label: "Toast", href: "/docs/toast" },
      { label: "Tooltip", href: "/docs/tooltip" },
    ],
  },
];
