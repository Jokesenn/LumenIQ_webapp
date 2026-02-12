import Link from "next/link";
import { LogoWithText } from "./logo";
import { Linkedin, Twitter } from "lucide-react";

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
    <footer className="bg-zinc-950 py-16 px-6">
      {/* Gradient line separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent mb-16" />
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div>
            <LogoWithText size={32} variant="glow" />
            <p className="mt-4 text-sm text-zinc-300 leading-relaxed max-w-[280px]">
              Moteur de prévision professionnel pour PME e-commerce.
              Prévisions fiables, validées sur votre historique, en 5 minutes.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Produit</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Entreprise</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Légal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-300 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-zinc-400">
            © 2026 LumenIQ. Tous droits réservés.
          </p>
          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 -m-3 text-zinc-500 hover:text-white transition-colors duration-200"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
