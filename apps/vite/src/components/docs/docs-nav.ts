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
      { label: "Installation", href: "#", soon: true },
      { label: "Theming", href: "#", soon: true },
      { label: "Dark Mode", href: "#", soon: true },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "#", soon: true },
      { label: "Alert Dialog", href: "#", soon: true },
      { label: "Badge", href: "#", soon: true },
      { label: "Button", href: "#", soon: true },
      { label: "Card", href: "#", soon: true },
      { label: "Checkbox", href: "#", soon: true },
      { label: "Dialog", href: "#", soon: true },
      { label: "Form", href: "/docs/forms" },
      { label: "Input", href: "#", soon: true },
      { label: "Modal", href: "#", soon: true },
      { label: "Tabs", href: "#", soon: true },
    ],
  },
];
