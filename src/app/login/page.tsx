"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LumenIQLogo } from '@/components/common/logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true);
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] p-10 shadow-xl">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-6">
                        <LumenIQLogo size={48} />
                    </Link>
                    <h1 className="text-2xl font-bold mb-2">
                        {isLogin ? 'Bon retour' : 'Créer un compte'}
                    </h1>
                    <p className="text-[var(--text-muted)] text-sm">
                        {isLogin ? 'Accédez à votre dashboard LumenIQ' : 'Commencez votre essai gratuit de 3 mois'}
                    </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); router.push('/dashboard'); }}>
                    {!isLogin && (
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Nom complet</label>
                            <input type="text" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all" placeholder="Jean Dupont" />
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input type="email" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all" placeholder="vous@entreprise.com" />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-medium mb-2">Mot de passe</label>
                        <input type="password" className="w-full px-4 py-3 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border)] focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all" placeholder="••••••••" />
                    </div>

                    <Button type="submit" className="w-full py-6 text-base" size="large">
                        {isLogin ? 'Se connecter' : 'Créer mon compte'}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-[var(--accent)] text-sm font-medium hover:underline"
                    >
                        {isLogin ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
                    </button>
                </div>
            </div>
        </div>
    );
}
