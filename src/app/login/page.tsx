"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Loader2 } from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";

type AuthMode = "login" | "signup" | "forgot-password";

function LoginContent() {
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

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
  };

  const inputClass =
    "w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-shadow";

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        <section className="min-h-[calc(100vh-80px)] flex items-center justify-center py-10 px-6">
          <div className="w-full max-w-[420px] glass-card p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo size={48} variant="glow" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">{getTitle()}</h1>
              <p className="text-sm text-zinc-400">
                {getSubtitle()}
              </p>
            </div>

            {/* Mode tabs */}
            {mode !== "forgot-password" && (
              <div className="flex mb-6 border-b border-white/[0.08]">
                <button
                  onClick={() => switchMode("login")}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors duration-200 ${
                    mode === "login"
                      ? "text-white border-b-2 border-indigo-500"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Connexion
                </button>
                <button
                  onClick={() => switchMode("signup")}
                  className={`flex-1 pb-3 text-sm font-medium transition-colors duration-200 ${
                    mode === "signup"
                      ? "text-white border-b-2 border-indigo-500"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  Inscription
                </button>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Success message */}
            {message && (
              <div className="mb-5 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-sm text-emerald-400">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {mode === "signup" && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Dupont"
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="mb-5">
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@entreprise.com"
                  required
                  className={inputClass}
                  disabled={loading}
                />
              </div>

              {mode !== "forgot-password" && (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-zinc-300">
                      Mot de passe
                    </label>
                    {mode === "login" && (
                      <button
                        type="button"
                        onClick={() => switchMode("forgot-password")}
                        className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                        disabled={loading}
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    minLength={6}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>
              )}

              <Button
                type="submit"
                className="w-full justify-center bg-indigo-500 hover:bg-indigo-600 text-white"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    {mode === "login"
                      ? "Connexion..."
                      : mode === "signup"
                      ? "Création..."
                      : "Envoi..."}
                  </span>
                ) : mode === "login" ? (
                  "Se connecter"
                ) : mode === "signup" ? (
                  "Créer mon compte"
                ) : (
                  "Envoyer le lien"
                )}
              </Button>
            </form>

            {/* Footer links */}
            <div className="mt-6 text-center">
              {mode === "login" && (
                <button
                  onClick={() => switchMode("signup")}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  disabled={loading}
                >
                  Pas encore de compte ? S&apos;inscrire
                </button>
              )}

              {mode === "signup" && (
                <button
                  onClick={() => switchMode("login")}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                  disabled={loading}
                >
                  Déjà un compte ? Se connecter
                </button>
              )}

              {mode === "forgot-password" && (
                <button
                  onClick={() => switchMode("login")}
                  className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={32} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
