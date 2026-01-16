import { Navbar, Footer } from "@/components/shared";
import {
  Hero,
  ComparisonSection,
  FeaturesSection,
  HowItWorks,
  PricingPreview,
  FAQSection,
  CTASection,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="pt-20">
        <Hero />
        <ComparisonSection />
        <FeaturesSection />
        <HowItWorks />
        <PricingPreview />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
