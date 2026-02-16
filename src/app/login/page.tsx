"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/shared/logo";
import { LogoWithText } from "@/components/shared/logo";
import {
  Loader2,
  Mail,
  Lock,
  User,
  ArrowRight,
  Shield,
  Server,
  Lock as LockIcon,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { useSupabase } from "@/hooks/use-supabase";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "signup" | "forgot-password";

/* ------------------------------------------------
   Decorative animated hexagon constellation
   ------------------------------------------------ */
function HexConstellation() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large central hex — slow rotation */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 opacity-[0.06]"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="100,10 178.7,37.5 178.7,112.5 100,140 21.3,112.5 21.3,37.5"
          fill="none"
          stroke="#6366f1"
          strokeWidth="0.5"
        />
        <polygon
          points="100,30 158.7,50 158.7,100 100,120 41.3,100 41.3,50"
          fill="none"
          stroke="#6366f1"
          strokeWidth="0.5"
        />
        <polygon
          points="100,50 138.7,62.5 138.7,87.5 100,100 61.3,87.5 61.3,62.5"
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="0.5"
        />
      </motion.svg>

      {/* Floating small hexagons */}
      {[
        { x: "15%", y: "20%", size: 40, delay: 0, dur: 6 },
        { x: "75%", y: "15%", size: 28, delay: 1.5, dur: 7 },
        { x: "85%", y: "70%", size: 35, delay: 0.5, dur: 5.5 },
        { x: "25%", y: "75%", size: 24, delay: 2, dur: 8 },
        { x: "60%", y: "85%", size: 20, delay: 1, dur: 6.5 },
        { x: "10%", y: "50%", size: 18, delay: 3, dur: 7 },
      ].map((hex, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 100 100"
          style={{ left: hex.x, top: hex.y, width: hex.size, height: hex.size, position: "absolute" }}
          className="opacity-[0.08]"
          animate={{ y: [-8, 8, -8], rotate: [0, 10, -10, 0] }}
          transition={{
            duration: hex.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: hex.delay,
          }}
        >
          <polygon
            points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
            fill="none"
            stroke="#818cf8"
            strokeWidth="2"
          />
        </motion.svg>
      ))}

      {/* Glowing orb */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full bg-indigo-500/10 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

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
    <div className="relative min-h-screen bg-zinc-950 flex">
      {/* =============================================
          LEFT PANEL — Brand immersive
          ============================================= */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] relative flex-col justify-between p-12 overflow-hidden">
        {/* Backgrounds */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-zinc-950 to-violet-950/20" />
        <div className="absolute inset-0 bg-hex-pattern opacity-30" />
        <HexConstellation />

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
              <span className="text-white">Des prévisions</span>
              <br />
              <span className="text-gradient-brand">qui comptent.</span>
            </h1>
            <p className="text-zinc-400 font-light leading-relaxed text-lg">
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
                <div className="text-2xl font-display font-800 text-white">{stat.value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</div>
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
            { icon: LockIcon, label: "Chiffrement AES-256" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs text-zinc-500"
            >
              <Icon className="w-3.5 h-3.5 text-indigo-400/60" />
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
        <div className="absolute inset-0 bg-zinc-950" />
        <div className="absolute inset-0 bg-iso-lines opacity-30" />
        {/* Top gradient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

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
                    className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Retour
                  </button>
                )}
                <h2 className="font-display text-3xl sm:text-4xl font-800 tracking-[-0.02em] text-white mb-2">
                  {getTitle()}
                </h2>
                <p className="text-sm text-zinc-500 font-light">
                  {getSubtitle()}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Mode tabs */}
            {mode !== "forgot-password" && (
              <div className="flex mb-8 bg-white/[0.02] rounded-xl p-1 relative border border-white/[0.04]">
                {(["login", "signup"] as const).map((tabMode) => (
                  <button
                    key={tabMode}
                    onClick={() => switchMode(tabMode)}
                    className={cn(
                      "flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative z-10",
                      mode === tabMode
                        ? "text-white"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    {tabMode === "login" ? "Connexion" : "Inscription"}
                  </button>
                ))}
                <motion.div
                  className="absolute top-1 bottom-1 rounded-lg bg-white/[0.06] border border-white/[0.04]"
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
                      <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                        Nom complet
                      </label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Jean Dupont"
                          className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 focus:bg-white/[0.03] transition-all"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                      Email
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vous@entreprise.com"
                        required
                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 focus:bg-white/[0.03] transition-all"
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
                            className="text-xs text-indigo-400/70 hover:text-indigo-300 transition-colors"
                            disabled={loading}
                          >
                            Oublié ?
                          </button>
                        )}
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          required
                          minLength={6}
                          className="w-full pl-11 pr-4 py-3.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/30 focus:bg-white/[0.03] transition-all"
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
                        className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-indigo-500 focus:ring-indigo-500/30 focus:ring-offset-0 accent-indigo-500"
                        disabled={loading}
                      />
                      <span className="text-xs text-zinc-500 leading-relaxed">
                        J&apos;accepte la{" "}
                        <Link
                          href="/politique-de-confidentialite"
                          target="_blank"
                          className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
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
                      "relative w-full py-3.5 rounded-xl font-semibold text-sm transition-all overflow-hidden",
                      "bg-gradient-to-r from-indigo-500 to-violet-500 text-white",
                      "hover:from-indigo-600 hover:to-violet-600",
                      "disabled:opacity-50 disabled:cursor-not-allowed",
                      "shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.35)]"
                    )}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                  >
                    {/* Shimmer overlay */}
                    {!loading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
                    )}
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
                    <p className="text-sm text-zinc-600">
                      Pas encore de compte ?{" "}
                      <button
                        onClick={() => switchMode("signup")}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
                        disabled={loading}
                      >
                        S&apos;inscrire gratuitement
                      </button>
                    </p>
                  )}

                  {mode === "signup" && (
                    <p className="text-sm text-zinc-600">
                      Déjà un compte ?{" "}
                      <button
                        onClick={() => switchMode("login")}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
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
                    className="mt-6 text-center text-xs text-zinc-600"
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
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
          <p className="text-xs text-zinc-700 text-center mt-4">
            &copy; 2025 LumenIQ &middot; Conçu pour les PME françaises
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
