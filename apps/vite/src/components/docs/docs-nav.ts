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
      { label: "Theming", href: "/docs/theming" },
      { label: "Dark Mode", href: "/docs/dark-mode" },
    ],
  },
  {
    title: "Components",
    items: [
      { label: "Accordion", href: "/docs/accordion" },
      { label: "Alert Dialog", href: "/docs/alert-dialog" },
      { label: "Badge", href: "/docs/badge" },
      { label: "Button", href: "/docs/button" },
      { label: "Card", href: "/docs/card" },
      { label: "Checkbox", href: "/docs/checkbox" },
      { label: "Dialog", href: "/docs/dialog" },
      { label: "Form", href: "/docs/forms" },
      { label: "Input", href: "/docs/input" },
      { label: "Drawer", href: "/docs/drawer" },
      { label: "Table", href: "/docs/table" },
      { label: "Tabs", href: "/docs/tabs" },
    ],
  },
  {
    title: "Cookbook",
    items: [
      { label: "All Recipes", href: "/cookbook" },
      { label: "Server State", href: "/cookbook/server-state" },
      { label: "Client State", href: "/cookbook/client-state" },
      { label: "Form Validation", href: "/cookbook/form-validation" },
      { label: "Data Tables", href: "/cookbook/data-tables" },
      { label: "E-commerce Dashboard", href: "/cookbook/e-commerce-dashboard" },
      { label: "SaaS Landing Page", href: "/cookbook/saas-landing-page" },
      { label: "Authentication Flow", href: "/cookbook/authentication-flow" },
      { label: "OAuth Flow", href: "/cookbook/oauth-flow" },
      { label: "Data Visualization", href: "/cookbook/data-visualization" },
      { label: "API Integration", href: "/cookbook/api-integration" },
    ],
  },
];
