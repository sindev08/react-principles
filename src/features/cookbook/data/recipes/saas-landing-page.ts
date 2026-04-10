import type { RecipeDetail } from "../types";

export const saasLandingPage: RecipeDetail = {
  slug: "saas-landing-page",
  title: "SaaS Landing Page",
  breadcrumbCategory: "Landing Pages",
  description:
    "Optimized conversion funnels with component composition, SSG/ISR, and accessible form layouts built for maximum performance.",
  principle: {
    text: "Landing pages must be statically generated for SEO and performance. Use a section-based component architecture where each section is an independent, lazily-loaded unit. Avoid client-side data fetching for above-the-fold content.",
    tip: "Use ISR (Incremental Static Regeneration) for pricing and content sections that update occasionally without requiring a full rebuild.",
  },
  rules: [
    { title: "Atomic Section Components", description: "Each section (Hero, Features, Pricing) is a standalone component with no shared state." },
    { title: "Mobile-First CSS", description: "Design for 375px first. Scale up with sm:, md:, lg: breakpoints." },
    { title: "Static Generation", description: "Use generateStaticParams or SSG — never getServerSideProps — for landing pages." },
    { title: "Lazy Load Below Fold", description: "Dynamically import sections below the fold to reduce initial bundle size." },
  ],
  pattern: {
    filename: "components/landing/SectionFactory.tsx",
    code: `import dynamic from 'next/dynamic';

const SECTIONS = {
  hero: dynamic(() => import('./HeroSection')),
  features: dynamic(() => import('./FeaturesSection')),
  pricing: dynamic(() => import('./PricingSection')),
} as const;

export function SectionFactory({ type, props }: SectionProps) {
  const Section = SECTIONS[type];
  return <Section {...props} />;
}`,
  },
  implementation: {
    nextjs: {
      description: "Use Next.js static generation with revalidation for dynamic pricing data while keeping the page fast.",
      filename: "app/page.tsx",
      code: `export const revalidate = 3600; // ISR: revalidate hourly

export default async function LandingPage() {
  const pricing = await fetchPricingPlans();
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <PricingSection plans={pricing} />
      <CTASection />
    </>
  );
}`,
    },
    vite: {
      description: "In Vite, use React.lazy and Suspense boundaries to lazy-load sections and reduce initial bundle.",
      filename: "pages/LandingPage.tsx",
      code: `const PricingSection = lazy(() => import('./sections/PricingSection'));

export function LandingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <Suspense fallback={<PricingSkeleton />}>
        <PricingSection />
      </Suspense>
    </>
  );
}`,
    },
  },
  lastUpdated: "Feb 26, 2026",
  contributor: { name: "Singgih Budi Purnadi", role: "Frontend & Mobile Developer" },
};
