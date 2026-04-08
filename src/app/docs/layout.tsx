import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Docs",
    template: "%s — React Principles",
  },
  description:
    "Reference docs for React Principles, covering architecture decisions, patterns, and implementation guides for modern React apps.",
  openGraph: {
    title: "React Principles — Docs",
    description:
      "Reference docs for React Principles, covering architecture decisions, patterns, and implementation guides for modern React apps.",
    type: "website",
    url: "/docs/introduction",
    images: [
      {
        url: "/docs/opengraph-image",
        width: 1200,
        height: 630,
        alt: "React Principles — Docs",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Principles — Docs",
    description:
      "Reference docs for React Principles, covering architecture decisions, patterns, and implementation guides for modern React apps.",
    images: ["/docs/opengraph-image"],
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
