import type { Metadata } from "next";
import { Manrope, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/providers/page-transition";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/shared/cookie-banner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumeniq.fr"),
  title: "LumenIQ | Prévisions professionnelles validées par backtesting",
  description: "Transformez vos historiques de ventes en prévisions fiables. Jusqu'à 24 modèles statistiques et ML, routing ABC/XYZ intelligent, rapports détaillés. Essai gratuit 3 mois.",
  authors: [{ name: "LumenIQ" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "LumenIQ | Prévisions professionnelles pour PME",
    description: "Moteur de prévision professionnel pour PME e-commerce. Jusqu'à 24 modèles, backtesting automatique. Essai gratuit 3 mois.",
    type: "website",
    siteName: "LumenIQ",
    locale: "fr_FR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LumenIQ | Prévisions professionnelles pour PME",
    description: "Moteur de prévision professionnel pour PME e-commerce. Jusqu'à 24 modèles, backtesting automatique. Essai gratuit 3 mois.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "LumenIQ",
              "url": "https://lumeniq.fr",
              "logo": "https://lumeniq.fr/logo.png",
              "sameAs": [
                "https://linkedin.com/company/lumeniq",
                "https://x.com/lumeniq"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Support client",
                "email": "support@lumeniq.fr",
                "availableLanguage": "French"
              }
            })
          }}
        />
      </head>
      <body className={`${manrope.variable} ${syne.variable} font-sans antialiased`}>
        <ScrollProgress />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <PageTransition>
            {children}
          </PageTransition>
          <Toaster
            theme="dark"
            position="bottom-center"
            toastOptions={{
              style: {
                background: "rgb(24 24 27)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgb(228 228 231)",
              },
            }}
          />
          <CookieBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
