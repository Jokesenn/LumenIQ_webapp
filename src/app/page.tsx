import dynamic from "next/dynamic";
import { Navbar, Footer } from "@/components/shared";
import { Hero } from "@/components/landing";

// Below-the-fold sections — dynamic imports for code splitting
const ComparisonSection = dynamic(() =>
  import("@/components/landing/comparison-section").then(mod => ({ default: mod.ComparisonSection }))
);
const FeaturesSection = dynamic(() =>
  import("@/components/landing/features-section").then(mod => ({ default: mod.FeaturesSection }))
);
const HowItWorks = dynamic(() =>
  import("@/components/landing/how-it-works").then(mod => ({ default: mod.HowItWorks }))
);
const RoiSection = dynamic(() =>
  import("@/components/landing/roi-section").then(mod => ({ default: mod.RoiSection }))
);
const PricingSection = dynamic(() =>
  import("@/components/landing/pricing-preview").then(mod => ({ default: mod.PricingSection }))
);
const FAQSection = dynamic(() =>
  import("@/components/landing/faq-section").then(mod => ({ default: mod.FAQSection }))
);
const CTASection = dynamic(() =>
  import("@/components/landing/cta-section").then(mod => ({ default: mod.CTASection }))
);

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "LumenIQ",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "AggregateOffer",
              "priceCurrency": "EUR",
              "lowPrice": "99",
              "highPrice": "299"
            },
            "description": "Plateforme SaaS de prévisions professionnelles pour PME. Jusqu'à 24 modèles statistiques et ML, backtesting automatique, routing ABC/XYZ intelligent.",
            "url": "https://lumeniq.fr"
          })
        }}
      />
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
        <RoiSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>

      <Footer />
    </div>
  );
}
