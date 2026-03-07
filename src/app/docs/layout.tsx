import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Docs",
    template: "%s — React Principles",
  },
  description:
    "Production-ready UI components built with React, Tailwind CSS, and TypeScript. Copy, paste, and customize for your project.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
