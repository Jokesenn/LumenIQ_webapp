import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | LumenIQ",
  description:
    "Connectez-vous à votre espace LumenIQ pour accéder à vos prévisions, résultats et recommandations.",
  alternates: { canonical: "/login" },
  robots: { index: false, follow: true },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
