import type { Metadata, Viewport } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Providers } from "./providers";
import "./globals.css";
import "@material-symbols/font-400/outlined.css";
import Script from "next/script";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const TITLE = "React Principles";
const DESCRIPTION =
  "A living cookbook of production-grade React patterns. Real implementations with Next.js 16, Vite, TanStack Query, Zustand, React Hook Form, and TypeScript.";
const OG_IMAGE = "/opengraph-image";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: TITLE,
    template: `%s — ${TITLE}`,
  },
  description: DESCRIPTION,
  keywords: [
    "React",
    "Next.js",
    "TanStack Query",
    "Zustand",
    "TypeScript",
    "React patterns",
    "React cookbook",
    "React Hook Form",
    "Tailwind CSS",
  ],
  authors: [{ name: "React Principles" }],
  creator: "React Principles",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: TITLE,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [OG_IMAGE],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=3" },
      { url: "/favicon-16x16.png?v=3", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=3", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=3" }],
    other: [
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
  verification: {
    google: "C8xhqe7uDGUBsLAEGOj000djus2sjWBYF80zd5upT24",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#4628F1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: TITLE,
    url: BASE_URL,
    description: DESCRIPTION,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: TITLE,
      url: BASE_URL,
      logo: `${BASE_URL}/android-chrome-512x512.png`,
    },
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Anti-FOUC: apply theme class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme')||'dark';if(t==='dark')document.documentElement.classList.add('dark');})();`,
          }}
        />
        <Script
          id="website-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <link
          rel="icon"
          href="/favicon-light.svg?v=3"
          type="image/svg+xml"
          media="(prefers-color-scheme: light)"
        />
        <link
          rel="icon"
          href="/favicon-dark.svg?v=3"
          type="image/svg+xml"
          media="(prefers-color-scheme: dark)"
        />
        <link rel="icon" href="/favicon-light.svg?v=3" type="image/svg+xml" />
      </head>
      <body className="min-h-screen bg-(--background) text-(--foreground) antialiased">
                {process.env.NODE_ENV === "production" && (
          <Script src="https://analytics.sindev.my.id/track.js" data-api-key="4744f6b200cecd79c9241430f5049e3e5c1f65478888e82542469a170d6c6e7c" />
        )}
        <NuqsAdapter>
          <Providers>{children}</Providers>
        </NuqsAdapter>
      </body>
    </html>
  );
}
