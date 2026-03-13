import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez PREVYA | Support, devis et partenariats",
  description:
    "Une question sur PREVYA ? Contactez notre équipe pour un devis personnalisé, du support technique ou une proposition de partenariat. Réponse sous 24h.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contactez PREVYA | Réponse sous 24h",
    description:
      "Support technique, devis personnalisé, partenariats. Contactez l'équipe PREVYA.",
  },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Accueil", item: "https://lumeniq.fr" },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://lumeniq.fr/contact" },
  ],
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
