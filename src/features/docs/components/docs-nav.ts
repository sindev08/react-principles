export interface CookbookNavItem {
  label: string;
  slug: string; // "" for "All Recipes"
}

export const COOKBOOK_ITEMS: CookbookNavItem[] = [
  { label: "All Recipes", slug: "" },
  { label: "Server State", slug: "server-state" },
  { label: "Client State", slug: "client-state" },
  { label: "Form Validation", slug: "form-validation" },
  { label: "Data Tables", slug: "data-tables" },
  { label: "E-commerce Dashboard", slug: "e-commerce-dashboard" },
  { label: "SaaS Landing Page", slug: "saas-landing-page" },
  { label: "Authentication Flow", slug: "authentication-flow" },
  { label: "OAuth Flow", slug: "oauth-flow" },
  { label: "Data Visualization", slug: "data-visualization" },
  { label: "API Integration", slug: "api-integration" },
];

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
];
