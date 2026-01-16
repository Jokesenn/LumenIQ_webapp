import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ['300', '400', '500', '600', '700', '800'] });

export const metadata: Metadata = {
    title: "LumenIQ - Forecasts professionnels",
    description: "Prévisions professionnelles pour PME, validées par backtesting.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" data-theme="dark">
            <body className={manrope.className}>{children}</body>
        </html>
    );
}
