import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contactez LumenIQ | Support, devis et partenariats",
  description:
    "Une question sur LumenIQ ? Contactez notre équipe pour un devis personnalisé, du support technique ou une proposition de partenariat. Réponse sous 24h.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contactez LumenIQ | Réponse sous 24h",
    description:
      "Support technique, devis personnalisé, partenariats. Contactez l'équipe LumenIQ.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
