import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | LumenIQ",
  description:
    "Connectez-vous à votre espace LumenIQ pour accéder à vos prévisions, résultats et recommandations.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
