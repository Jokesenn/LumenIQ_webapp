"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { useSupabase } from "@/hooks/use-supabase";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const supabase = useSupabase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setMessage("Mot de passe mis à jour avec succès !");

      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-20">
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-6">
          <div className="w-full max-w-[420px] glass-card p-10">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size={48} />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Nouveau mot de passe
              </h1>
              <p className="text-sm text-zinc-400">
                Choisissez un nouveau mot de passe sécurisé
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm text-emerald-500">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full justify-center bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin-slow inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Mise à jour...
                  </span>
                ) : (
                  "Mettre à jour le mot de passe"
                )}
              </Button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
