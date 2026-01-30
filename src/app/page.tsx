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
