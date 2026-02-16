import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Démo LumenIQ | Visite produit interactive",
  description:
    "Découvrez LumenIQ en action : importez vos données, lancez une analyse, explorez les résultats et les recommandations. Visite interactive en 5 minutes.",
  alternates: { canonical: "/demo" },
  openGraph: {
    title: "Démo LumenIQ | Découvrez le produit en 5 minutes",
    description:
      "Import, analyse, résultats, recommandations. Visite interactive du moteur de prévision LumenIQ.",
  },
};

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
