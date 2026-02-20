import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs LumenIQ | Plans à partir de 99€/mois sans engagement",
  description:
    "3 plans de prévisions pour PME : Standard (17 modèles, 50 séries), ML (22 modèles, 150 séries), Premium (24 modèles, 300 séries). Essai gratuit 3 mois.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Tarifs LumenIQ | Plans flexibles pour PME",
    description:
      "Standard 99€, ML 199€, Premium 299€/mois. Essai gratuit 3 mois, annulez à tout moment.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Puis-je changer de plan à tout moment ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment depuis les paramètres de votre compte. Le changement prend effet au prochain cycle de facturation.",
      },
    },
    {
      "@type": "Question",
      name: "Comment fonctionne l'essai gratuit ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "L'essai gratuit dure 3 mois avec un accès complet au plan ML. Aucune carte bancaire n'est requise. À la fin de l'essai, vous choisissez le plan qui vous convient.",
      },
    },
    {
      "@type": "Question",
      name: "Mes données sont-elles en sécurité ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vos données sont chiffrées en transit et au repos. Elles sont stockées en Europe (AWS eu-west). Nous ne partageons jamais vos données avec des tiers. Vous pouvez supprimer vos données à tout moment.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si je dépasse mon quota de séries ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Vous recevrez une notification quand vous approchez de votre limite. Les séries supplémentaires ne seront pas traitées, mais vos prévisions existantes restent accessibles. Vous pouvez upgrader votre plan pour obtenir plus de capacité.",
      },
    },
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://lumeniq.fr" },
    { "@type": "ListItem", position: 2, name: "Tarifs", item: "https://lumeniq.fr/pricing" },
  ],
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
