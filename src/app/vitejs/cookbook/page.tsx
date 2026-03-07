import type { Metadata } from "next";
import { CookbookListPage } from "@/features/cookbook/components/CookbookListPage";

export const metadata: Metadata = {
  title: "Cookbook — Vite",
  description: "Production-ready Vite + React Router patterns and reference architectures.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/nextjs/cookbook" },
};

export default function VitejsCookbookPage() {
  return <CookbookListPage framework="vitejs" />;
}
