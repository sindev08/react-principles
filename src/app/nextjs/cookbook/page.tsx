import type { Metadata } from "next";
import { CookbookListPage } from "@/features/cookbook/components/CookbookListPage";

export const metadata: Metadata = {
  title: "Cookbook",
  description: "Production-ready Next.js App Router patterns and reference architectures.",
  keywords: ["Next.js", "React patterns", "App Router", "TanStack Query", "Zustand", "TypeScript"],
  openGraph: {
    title: "React Principles — Cookbook",
    description: "Production-ready Next.js App Router patterns and reference architectures.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Principles — Cookbook",
    description: "Production-ready Next.js App Router patterns and reference architectures.",
  },
  alternates: {
    canonical: "/nextjs/cookbook",
  },
};

export default function NextjsCookbookPage() {
  return <CookbookListPage framework="nextjs" />;
}
