"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { useSupabase } from "@/hooks/use-supabase";

type AuthMode = "login" | "signup" | "forgot-password";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useSupabase();

  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(redirectTo);
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        setMessage(
          "Vérifiez votre boîte mail pour confirmer votre inscription."
        );
      } else if (mode === "forgot-password") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
        });
        if (error) throw error;
        setMessage(
          "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation."
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Une erreur est survenue";
      // Traduction des erreurs courantes
      if (errorMessage.includes("Invalid login credentials")) {
        setError("Email ou mot de passe incorrect");
      } else if (errorMessage.includes("User already registered")) {
        setError("Un compte existe déjà avec cet email");
      } else if (errorMessage.includes("Password should be at least")) {
        setError("Le mot de passe doit contenir au moins 6 caractères");
      } else if (errorMessage.includes("Invalid email")) {
        setError("Adresse email invalide");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Connexion";
      case "signup":
        return "Créer un compte";
      case "forgot-password":
        return "Mot de passe oublié";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Accédez à votre dashboard LumenIQ";
      case "signup":
        return "Commencez votre essai gratuit de 3 mois";
      case "forgot-password":
        return "Entrez votre email pour réinitialiser votre mot de passe";
    }
  };

  const getSubmitText = () => {
    if (loading) {
      return (
        <span className="flex items-center gap-2">
          <span className="animate-spin-slow inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          {mode === "login"
            ? "Connexion..."
            : mode === "signup"
            ? "Création..."
            : "Envoi..."}
        </span>
      );
    }
    switch (mode) {
      case "login":
        return "Se connecter";
      case "signup":
        return "Créer mon compte";
      case "forgot-password":
        return "Envoyer le lien";
    }
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
              <h1 className="text-2xl font-bold mb-2">{getTitle()}</h1>
              <p className="text-sm text-[var(--text-secondary)]">
                {getSubtitle()}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-lg text-sm text-[var(--danger)]">
                {error}
              </div>
            )}

            {message && (
              <div className="mb-5 p-3 bg-[var(--success)]/10 border border-[var(--success)]/30 rounded-lg text-sm text-[var(--success)]">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="mb-5">
                  <label className="block text-sm font-medium mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Dupont"
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  required
                  className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                  disabled={loading}
                />
              </div>

              {mode !== "forgot-password" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className="w-full px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
                    disabled={loading}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full justify-center"
                disabled={loading}
              >
                {getSubmitText()}
              </Button>
            </form>

            <div className="mt-6 text-center">
              {mode === "login" && (
                <>
                  <button
                    onClick={() => {
                      setMode("signup");
                      setError(null);
                      setMessage(null);
                    }}
                    className="text-sm text-[var(--accent)] hover:underline"
                    disabled={loading}
                  >
                    Pas encore de compte ? S&apos;inscrire
                  </button>
                  <div className="mt-4">
                    <button
                      onClick={() => {
                        setMode("forgot-password");
                        setError(null);
                        setMessage(null);
                      }}
                      className="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                      disabled={loading}
                    >
                      Mot de passe oublié ?
                    </button>
                  </div>
                </>
              )}

              {mode === "signup" && (
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-sm text-[var(--accent)] hover:underline"
                  disabled={loading}
                >
                  Déjà un compte ? Se connecter
                </button>
              )}

              {mode === "forgot-password" && (
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-sm text-[var(--accent)] hover:underline"
                  disabled={loading}
                >
                  Retour à la connexion
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
