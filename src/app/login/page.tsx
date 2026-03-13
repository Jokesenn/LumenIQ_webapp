"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LogoWithText } from "@/components/shared/logo";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Server,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup" | "forgot-password";

/* ------------------------------------------------
   Main login content
   ------------------------------------------------ */
function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useSupabase();

  const initialMode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState(false);

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

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError(null);
    setMessage(null);
    setConsentChecked(false);
  };

  const getTitle = () => {
    switch (mode) {
      case "login":
        return "Bon retour";
      case "signup":
        return "Créer un compte";
      case "forgot-password":
        return "Réinitialisation";
    }
  };

  const getSubtitle = () => {
    switch (mode) {
      case "login":
        return "Connectez-vous pour accéder à vos prévisions";
      case "signup":
        return "Commencez votre essai gratuit de 3 mois";
      case "forgot-password":
        return "Entrez votre email pour recevoir un lien de réinitialisation";
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] flex">
      {/* =============================================
          LEFT PANEL — Brand immersive
          ============================================= */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-[var(--color-bg-surface)]" />
        <div className="absolute inset-0 bg-dot-pattern opacity-20" />

        {/* Top — Logo */}
        <div className="relative z-10">
          <Link href="/">
            <motion.div
              className="inline-flex"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
            >
              <LogoWithText size={36} />
            </motion.div>
          </Link>
        </div>

        {/* Center — Tagline */}
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            <h1 className="font-display text-4xl xl:text-5xl font-800 tracking-[-0.03em] leading-[1.1] mb-6">
              <span className="text-[var(--color-text)]">Des prévisions</span>
              <br />
              <span className="text-gradient-brand">qui comptent.</span>
            </h1>
            <p className="text-[var(--color-text-secondary)] font-light leading-relaxed text-lg">
              Anticipez vos ventes, optimisez vos stocks,
              prenez des décisions éclairées grâce à l&apos;IA.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            className="flex gap-8 mt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {[
              { value: "24", label: "Modèles" },
              { value: "5min", label: "Setup" },
              { value: "99%", label: "Automatisé" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-display font-800 text-[var(--color-text)]">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-tertiary)] uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom — Trust badges */}
        <motion.div
          className="relative z-10 flex flex-wrap gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          {[
            { icon: Shield, label: "Conforme RGPD" },
            { icon: Server, label: "Hébergé en UE" },
            { icon: Lock, label: "Chiffrement AES-256" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] text-xs text-[var(--color-text-tertiary)]"
            >
              <Icon className="w-3.5 h-3.5 text-[var(--color-copper)]" />
              {label}
            </div>
          ))}
        </motion.div>
      </div>

      {/* =============================================
          RIGHT PANEL — Auth form
          ============================================= */}
      <div className="flex-1 flex flex-col min-h-screen relative">
        {/* Background */}
        <div className="absolute inset-0 bg-[var(--color-bg)]" />

        {/* Mobile logo */}
        <div className="lg:hidden relative z-10 p-6 pt-8">
          <Link href="/">
            <LogoWithText size={28} />
          </Link>
        </div>

        {/* Form container */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <motion.div
            className="w-full max-w-[420px]"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
          >
            {/* Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                className="mb-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {mode === "forgot-password" && (
                  <button
                    onClick={() => switchMode("login")}
                    className="flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] transition-colors mb-6"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </button>
                )}
                <h2 className="font-display text-3xl sm:text-4xl font-800 tracking-[-0.02em] text-[var(--color-text)] mb-2">
                  {getTitle()}
                </h2>
                <p className="text-sm text-[var(--color-text-tertiary)] font-light">
                  {getSubtitle()}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mode tabs */}
            {mode !== "forgot-password" && (
              <div className="flex mb-8 bg-[var(--color-bg-surface)] rounded-xl p-1 relative border border-[var(--color-border)]">
                {(["login", "signup"] as const).map((tabMode) => (
                  <button
                    key={tabMode}
                    onClick={() => switchMode(tabMode)}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative z-10",
                      mode === tabMode
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
                    )}
                  >
                    {tabMode === "login" ? "Connexion" : "Inscription"}
                  </button>
                ))}
                <motion.div
                  className="absolute top-1 bottom-1 rounded-lg bg-white border border-[var(--color-border)]"
                  animate={{
                    left: mode === "login" ? "4px" : "50%",
                    width: "calc(50% - 4px)",
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              </div>
            )}

            {/* Form content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3.5 bg-red-500/8 border border-red-500/15 rounded-xl text-sm text-red-400 flex items-start gap-2.5"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    {error}
                  </motion.div>
                )}

                {/* Success */}
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-3.5 bg-emerald-500/8 border border-emerald-500/15 rounded-xl text-sm text-emerald-400 flex items-start gap-2.5"
                  >
                    <Sparkles className="w-4 h-4 mt-0.5 shrink-0" />
                    {message}
                  </motion.div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Full name (signup only) */}
                  {mode === "signup" && (
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                        Nom complet
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-copper)] transition-colors" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jean Dupont"
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-copper)]/30 focus:border-[var(--color-copper)]/30 transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-copper)] transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@entreprise.com"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-copper)]/30 focus:border-[var(--color-copper)]/30 transition-all"
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  {mode !== "forgot-password" && (
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
                          Mot de passe
                        </label>
                        {mode === "login" && (
                          <button
                            type="button"
                            onClick={() => switchMode("forgot-password")}
                            className="text-xs text-[var(--color-copper)] hover:text-[var(--color-copper-dark)] transition-colors"
                            disabled={loading}
                          >
                            Oublié ?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-tertiary)] group-focus-within:text-[var(--color-copper)] transition-colors" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={8}
                          className="w-full pl-11 pr-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-copper)]/30 focus:border-[var(--color-copper)]/30 transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Consent checkbox (signup only) */}
                  {mode === "signup" && (
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-[var(--color-border)] bg-white text-[var(--color-copper)] focus:ring-[var(--color-copper)]/30 focus:ring-offset-0 accent-[var(--color-copper)]"
                        disabled={loading}
                      />
                      <span className="text-xs text-[var(--color-text-tertiary)] leading-relaxed">
                        J&apos;accepte la{" "}
                        <Link
                          href="/politique-de-confidentialite"
                          target="_blank"
                          className="text-[var(--color-copper)] hover:text-[var(--color-copper-dark)] underline underline-offset-2 transition-colors"
                        >
                          politique de confidentialit&eacute;
                        </Link>{" "}
                        et le traitement de mes donn&eacute;es personnelles
                      </span>
                    </label>
                  )}

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    disabled={loading || (mode === "signup" && !consentChecked)}
                    className={cn(
                      "btn-copper relative w-full py-3.5 rounded-xl font-semibold text-sm transition-all overflow-hidden",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                  >
                    <span className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          {mode === "login"
                            ? "Connexion..."
                            : mode === "signup"
                            ? "Création..."
                            : "Envoi..."}
                        </>
                      ) : (
                        <>
                          {mode === "login"
                            ? "Se connecter"
                            : mode === "signup"
                            ? "Créer mon compte"
                            : "Envoyer le lien"}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </span>
                  </motion.button>
                </form>

                {/* Footer links */}
                <div className="mt-8 text-center">
                  {mode === "login" && (
                    <p className="text-sm text-[var(--color-text-tertiary)]">
                      Pas encore de compte ?{" "}
                      <button
                        onClick={() => switchMode("signup")}
                        className="text-[var(--color-copper)] hover:text-[var(--color-copper-dark)] transition-colors font-medium"
                        disabled={loading}
                      >
                        S&apos;inscrire gratuitement
                      </button>
                    </p>
                  )}

                  {mode === "signup" && (
                    <p className="text-sm text-[var(--color-text-tertiary)]">
                      Déjà un compte ?{" "}
                      <button
                        onClick={() => switchMode("login")}
                        className="text-[var(--color-copper)] hover:text-[var(--color-copper-dark)] transition-colors font-medium"
                        disabled={loading}
                      >
                        Se connecter
                      </button>
                    </p>
                  )}
                </div>

                {/* Signup trust note */}
                {mode === "signup" && (
                  <motion.p
                    className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Essai gratuit 3 mois &middot; Aucune carte bancaire requise
                  </motion.p>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Bottom decorative line */}
        <div className="relative z-10 px-6 sm:px-12 pb-8">
          <div className="h-px bg-[var(--color-border)]" />
          <p className="text-xs text-[var(--color-text-tertiary)] text-center mt-4">
            &copy; 2025 PREVYA &middot; Conçu pour les PME françaises
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
