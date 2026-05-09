import { use } from "react";
import Link from "next/link";
import Script from "next/script";
import type { Metadata } from "next";
import { DocsPageLayout } from "@/features/docs/components";
import { CookbookDetailPage } from "@/features/cookbook/components/CookbookDetailPage";
import { getRecipeDetail } from "@/features/cookbook/data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const detail = getRecipeDetail(slug);

  if (!detail) {
    return {
      title: "Recipe Not Found",
      robots: { index: false, follow: false },
    };
  }

  return {
    title: detail.title,
    description: detail.description,
    openGraph: {
      title: detail.title,
      description: detail.description,
      type: "article",
      url: `/nextjs/cookbook/${slug}`,
      images: [
        {
          url: `/nextjs/cookbook/${slug}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: detail.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: detail.title,
      description: detail.description,
      images: [`/nextjs/cookbook/${slug}/opengraph-image`],
    },
    alternates: {
      canonical: `/nextjs/cookbook/${slug}`,
    },
  };
}

export default function NextjsCookbookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const detail = getRecipeDetail(slug);

  if (!detail) {
    return (
      <DocsPageLayout>
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <span className="material-symbols-outlined text-[64px] text-slate-300 mb-4">
            search_off
          </span>
          <h1 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
            Recipe Not Found
          </h1>
          <p className="text-slate-500">
            This recipe does not exist or is not yet available.
          </p>
          <Link
            href="/nextjs/cookbook"
            className="mt-6 text-sm font-medium text-primary hover:underline"
          >
            ← Back to Cookbook
          </Link>
        </div>
      </DocsPageLayout>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: detail.title,
        description: detail.description,
        dateModified: detail.lastUpdated,
        author: {
          "@type": "Person",
          name: detail.contributor.name,
          jobTitle: detail.contributor.role,
        },
        publisher: {
          "@type": "Organization",
          name: "React Principles",
          url: BASE_URL,
          logo: `${BASE_URL}/android-chrome-512x512.png`,
        },
        inLanguage: "en-US",
        url: `${BASE_URL}/nextjs/cookbook/${detail.slug}`,
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
            name: detail.title,
            item: `${BASE_URL}/nextjs/cookbook/${detail.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Script
        id={`structured-data-${detail.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CookbookDetailPage detail={detail} framework="nextjs" />
    </>
  );
}
