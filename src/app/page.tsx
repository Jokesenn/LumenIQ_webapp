import { Navbar, Footer } from "@/components/shared";
import {
  Hero,
  ComparisonSection,
  FeaturesSection,
  HowItWorks,
  PricingSection,
  FAQSection,
  CTASection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Skip to content */}
      <a
        href="#hero"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-indigo-500 focus:text-white focus:rounded-lg"
      >
        Aller au contenu principal
      </a>

      <Navbar />

      <main className="pt-20">
        <Hero />
        <ComparisonSection />
        <FeaturesSection />
        <HowItWorks />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
