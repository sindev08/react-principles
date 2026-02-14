import {
  Navbar,
  HeroSection,
  WhySection,
  TechStackSection,
  MonorepoSection,
  DocsSection,
  Footer,
} from "@/components/landing";

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
