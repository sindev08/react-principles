import Script from "next/script";
import type { Metadata } from "next";
import { CookbookFoundationPage } from "@/features/cookbook/components/CookbookFoundationPage";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "React Principles Foundation — Core Concepts & Conventions",
  description:
    "Learn the React principles behind this cookbook: SOLID principles, design patterns, folder structure, and coding conventions for scalable React apps.",
  keywords: [
    "react principles",
    "react design principles",
    "react patterns",
    "SOLID principles React",
    "react conventions",
    "react folder structure",
    "react architecture",
    "react best practices",
  ],
  alternates: {
    canonical: "/nextjs/cookbook/foundation",
  },
  openGraph: {
    title: "React Principles Foundation — Core Concepts & Conventions",
    description:
      "Learn the React principles behind this cookbook: SOLID principles, design patterns, folder structure, and coding conventions for scalable React apps.",
    type: "article",
    url: "/nextjs/cookbook/foundation",
  },
  twitter: {
    card: "summary_large_image",
    title: "React Principles Foundation — Core Concepts & Conventions",
    description:
      "Learn the React principles behind this cookbook: SOLID principles, design patterns, folder structure, and coding conventions for scalable React apps.",
  },
};

export default function NextjsCookbookFoundationPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: "React Principles Foundation",
        description:
          "Learn the React principles behind this cookbook: SOLID principles, design patterns, folder structure, and coding conventions for scalable React apps.",
        url: `${BASE_URL}/nextjs/cookbook/foundation`,
        publisher: {
          "@type": "Organization",
          name: "React Principles",
          url: BASE_URL,
          logo: `${BASE_URL}/android-chrome-512x512.png`,
        },
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: BASE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Cookbook",
            item: `${BASE_URL}/nextjs/cookbook`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Foundation",
            item: `${BASE_URL}/nextjs/cookbook/foundation`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id="foundation-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CookbookFoundationPage framework="nextjs" />
    </>
  );
}
