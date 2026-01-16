"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to dashboard on submit
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="pt-20">
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-6">
          <div className="w-full max-w-[420px] bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size={48} />
              </div>
              <h1 className="text-2xl font-bold mb-2">
                {isLogin ? "Connexion" : "Créer un compte"}
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {isLogin
                  ? "Accédez à votre dashboard LumenIQ"
                  : "Commencez votre essai gratuit de 3 mois"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  />
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  placeholder="vous@entreprise.com"
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                />
              </div>

              <Button type="submit" className="w-full justify-center">
                {isLogin ? "Se connecter" : "Créer mon compte"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[var(--accent)] hover:underline"
              >
                {isLogin
                  ? "Pas encore de compte ? S'inscrire"
                  : "Déjà un compte ? Se connecter"}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link
                  href="#"
                  className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
