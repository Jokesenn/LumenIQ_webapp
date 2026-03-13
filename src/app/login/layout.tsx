import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion | PREVYA",
  description:
    "Connectez-vous à votre espace PREVYA pour accéder à vos prévisions, résultats et recommandations.",
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
