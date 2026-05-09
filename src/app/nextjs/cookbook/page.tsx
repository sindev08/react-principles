import type { Metadata } from "next";
import { CookbookListPage } from "@/features/cookbook/components/CookbookListPage";

export const metadata: Metadata = {
  title: "Cookbook",
  description: "Production-ready Next.js App Router patterns and reference architectures.",
  keywords: ["React principles", "React patterns", "React cookbook", "Next.js", "App Router", "TanStack Query", "Zustand", "TypeScript"],
  openGraph: {
    title: "React Principles — Cookbook",
    description: "Production-ready Next.js App Router patterns and reference architectures.",
    type: "website",
    url: "/nextjs/cookbook",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "React Principles — Cookbook",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Principles — Cookbook",
    description: "Production-ready Next.js App Router patterns and reference architectures.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "/nextjs/cookbook",
  },
};

export default function NextjsCookbookPage() {
  return <CookbookListPage framework="nextjs" />;
}
