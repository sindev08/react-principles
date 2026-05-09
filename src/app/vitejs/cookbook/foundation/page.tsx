import type { Metadata } from "next";
import { CookbookFoundationPage } from "@/features/cookbook/components/CookbookFoundationPage";

export const metadata: Metadata = {
  title: "React Principles Foundation — Core Concepts & Conventions",
  description:
    "Learn the React principles behind this cookbook: SOLID principles, design patterns, folder structure, and coding conventions for scalable React apps.",
  alternates: {
    canonical: "/nextjs/cookbook/foundation",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function VitejsCookbookFoundationPage() {
  return <CookbookFoundationPage framework="vitejs" />;
}
