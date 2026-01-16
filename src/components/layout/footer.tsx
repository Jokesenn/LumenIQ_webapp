import Link from 'next/link';
import { LumenIQLogo } from '@/components/common/logo';

export function Footer() {
    return (
        <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center gap-3 mb-6">
                            <LumenIQLogo size={28} />
                            <span className="text-lg font-bold">LumenIQ</span>
                        </div>
                        <p className="text-[var(--text-secondary)] mb-6">
                            Forecasting professionnel pour PME.<br />
                            Précision Enterprise, simplicité SaaS.
                        </p>
                        <div className="text-sm text-[var(--text-muted)]">
                            © 2025 LumenIQ Inc.
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Produit</h4>
                        <div className="flex flex-col gap-4">
                            <FooterLink href="/features">Features</FooterLink>
                            <FooterLink href="/pricing">Tarification</FooterLink>
                            <FooterLink href="/roadmap">Roadmap</FooterLink>
                            <FooterLink href="/changelog">Changelog</FooterLink>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Ressources</h4>
                        <div className="flex flex-col gap-4">
                            <FooterLink href="/docs">Documentation</FooterLink>
                            <FooterLink href="/api">API Reference</FooterLink>
                            <FooterLink href="/blog">Blog</FooterLink>
                            <FooterLink href="/community">Communauté</FooterLink>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-6">Légal</h4>
                        <div className="flex flex-col gap-4">
                            <FooterLink href="/privacy">Confidentialité</FooterLink>
                            <FooterLink href="/terms">CGU / CGV</FooterLink>
                            <FooterLink href="/security">Sécurité</FooterLink>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link href={href} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors text-sm">
            {children}
        </Link>
    );
}
