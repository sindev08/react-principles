import type { Metadata } from "next";
import {
  Navbar,
  HeroSection,
  WhySection,
  TechStackSection,
  MonorepoSection,
  DocsSection,
  Footer,
} from "@/features/landing/components";

export const metadata: Metadata = {
  title: "React Principles — A Living Cookbook of React Patterns",
  description:
    "Production-grade React patterns with real implementations using Next.js, Vite, TanStack Query, Zustand, React Hook Form, and TypeScript.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "React Principles — A Living Cookbook of React Patterns",
    description:
      "Production-grade React patterns with real implementations using Next.js, Vite, TanStack Query, Zustand, React Hook Form, and TypeScript.",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "React Principles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Principles — A Living Cookbook of React Patterns",
    description:
      "Production-grade React patterns with real implementations using Next.js, Vite, TanStack Query, Zustand, React Hook Form, and TypeScript.",
    images: ["/opengraph-image"],
  },
};

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden antialiased font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-300 scroll-smooth">
      <Navbar />
      <main>
        <HeroSection />
        <WhySection />
        <TechStackSection />
        <MonorepoSection />
        <DocsSection />
      </main>
      <Footer />
    </div>
  );
}
