import Link from "next/link";
import { LogoWithText } from "./logo";
import { Linkedin, Twitter, ArrowUpRight } from "lucide-react";

const footerLinks = {
  product: [
    { label: "Fonctionnalités", href: "/features" },
    { label: "Tarifs", href: "/pricing" },
    { label: "Démo", href: "/demo" },
    { label: "Blog", href: "#" },
  ],
  company: [
    { label: "À propos", href: "#" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Mentions légales", href: "/mentions-legales" },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: "https://linkedin.com/company/lumeniq", label: "LinkedIn" },
  { icon: Twitter, href: "https://x.com/lumeniq", label: "X (Twitter)" },
];

export function Footer() {
  return (
    <footer className="relative bg-zinc-950 overflow-hidden">
      {/* Top gradient separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

      {/* Subtle hex pattern */}
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 sm:px-8 pt-20 pb-12">
        {/* Top section — Brand + Newsletter feel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-5">
            <LogoWithText size={36} variant="glow" />
            <p className="mt-6 text-base text-zinc-400 leading-relaxed max-w-[380px] font-light">
              Moteur de prévision professionnel pour PME e-commerce.
              Prévisions fiables, validées sur votre historique, en 5 minutes.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-8">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/[0.08] hover:border-white/10 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          <div className="lg:col-span-7 grid grid-cols-3 gap-8">
            <div>
              <h4 className="font-display font-600 text-white text-sm uppercase tracking-widest mb-6">
                Produit
              </h4>
              <ul className="space-y-4">
                {footerLinks.product.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-600 text-white text-sm uppercase tracking-widest mb-6">
                Entreprise
              </h4>
              <ul className="space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-display font-600 text-white text-sm uppercase tracking-widest mb-6">
                Légal
              </h4>
              <ul className="space-y-4">
                {footerLinks.legal.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group text-sm text-zinc-400 hover:text-white transition-colors duration-200 inline-flex items-center gap-1"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-50 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-200" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-600">
            &copy; 2026 LumenIQ. Tous droits réservés.
          </p>
          <p className="text-xs text-zinc-700">
            Conçu pour les PME e-commerce françaises.
          </p>
        </div>
      </div>
    </footer>
  );
}
