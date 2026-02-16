import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fonctionnalités LumenIQ | Routing ABC/XYZ, 24 modèles, backtesting",
  description:
    "Découvrez le moteur de prévision LumenIQ : routing intelligent ABC/XYZ, jusqu'à 24 modèles statistiques et ML, backtesting automatique, rapports détaillés par série.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: "Fonctionnalités LumenIQ | Prévisions intelligentes pour PME",
    description:
      "Routing ABC/XYZ, 24 modèles statistiques et ML, backtesting automatique, rapports détaillés.",
  },
};

export default function FeaturesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
