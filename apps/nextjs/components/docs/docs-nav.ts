export interface NavItem {
  label: string;
  href: string;
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
      { label: "Installation", href: "#" },
      { label: "Theming", href: "#" },
      { label: "Dark Mode", href: "#" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "#" },
      { label: "Alert Dialog", href: "#" },
      { label: "Badge", href: "#" },
      { label: "Button", href: "#" },
      { label: "Card", href: "#" },
      { label: "Checkbox", href: "#" },
      { label: "Dialog", href: "#" },
      { label: "Form", href: "/docs/forms" },
      { label: "Input", href: "#" },
      { label: "Modal", href: "#" },
      { label: "Tabs", href: "#" },
    ],
  },
  {
    title: "Patterns",
    items: [
      { label: "React Query", href: "/react-query" },
      { label: "Zustand", href: "/state" },
      { label: "Forms", href: "/forms" },
      { label: "Tables", href: "/table" },
    ],
  },
];
