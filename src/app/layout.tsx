import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { PageTransition } from "@/components/providers/page-transition";
import { ScrollProgress } from "@/components/shared/scroll-progress";
import { Toaster } from "sonner";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  fallback: ["system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
});

export const metadata: Metadata = {
  title: "LumenIQ | Prévisions professionnelles validées par backtesting",
  description: "Transformez vos historiques de ventes en forecasts fiables. 21 modèles statistiques/ML, routing ABC/XYZ intelligent, rapports détaillés. En 5 minutes.",
  keywords: ["forecasting", "prévisions", "e-commerce", "PME", "machine learning", "backtesting", "ABC/XYZ"],
  authors: [{ name: "LumenIQ" }],
  openGraph: {
    title: "LumenIQ | Forecasting professionnel pour PME",
    description: "Moteur de prévision professionnel pour PME e-commerce. Forecasts validés par backtesting, en 5 minutes.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${manrope.variable} font-sans antialiased`}>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
