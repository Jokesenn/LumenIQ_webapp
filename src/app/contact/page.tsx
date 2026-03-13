"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, Headphones, Send, ArrowRight, CheckCircle2, MessageSquare, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/shared";
import { FadeIn } from "@/components/animations";

const subjectOptions = [
  { value: "", label: "Selectionnez un sujet" },
  { value: "devis", label: "Demande de devis" },
  { value: "technique", label: "Question technique" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "contact@lumeniq.fr",
    href: "mailto:contact@lumeniq.fr",
  },
  {
    icon: Clock,
    label: "Reponse",
    value: "Sous 24h ouvrées",
    href: null,
  },
  {
    icon: Headphones,
    label: "Support technique",
    value: "support@lumeniq.fr",
    href: "mailto:support@lumeniq.fr",
  },
];

/* ------------------------------------------------
   Premium floating input component
   ------------------------------------------------ */
function PremiumInput({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  required = false,
  disabled = false,
  icon: Icon,
}: {
  id: string;
  name: string;
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <label
        htmlFor={id}
        className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${isFocused ? "text-[var(--color-copper)]" : "text-[var(--color-text-tertiary)]"}`} />
        )}
        <input
          id={id}
          name={name}
          type={type}
          required={required}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full ${Icon ? "pl-11" : "pl-4"} pr-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-copper)]/30 focus:border-[var(--color-copper)]/30 transition-all duration-300`}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 800));

    setIsSuccess(true);

    toast.success("Message envoye !", {
      description: "Notre équipe vous répondra sous 24h.",
    });

    setTimeout(() => {
      setFormData({
        fullName: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
      setIsSubmitting(false);
      setIsSuccess(false);
    }, 2500);
  };

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] overflow-hidden">
      <Navbar />

      <main className="relative z-10 pt-20">
        {/* =============================================
            SPLIT-SCREEN LAYOUT
            ============================================= */}
        <section className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
          {/* =============================================
              LEFT PANEL — Immersive brand visual
              ============================================= */}
          <div className="hidden lg:flex lg:w-[42%] xl:w-[45%] relative flex-col justify-between p-12 overflow-hidden">
            {/* Backgrounds */}
            <div className="absolute inset-0 bg-[var(--color-bg-surface)]" />
            <div className="absolute inset-0 bg-dot-pattern opacity-20" />

            {/* Top — Section label */}
            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-[var(--color-copper)]/8 border border-[var(--color-copper)]/15">
                  <MessageSquare className="w-4 h-4 text-[var(--color-copper)]" />
                  <span className="text-sm text-[var(--color-text-secondary)] font-display font-600">Contact</span>
                </div>
              </motion.div>
            </div>

            {/* Center — Tagline */}
            <div className="relative z-10 max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <h1 className="font-display text-4xl xl:text-5xl font-800 tracking-[-0.03em] leading-[1.1] mb-6">
                  <span className="text-[var(--color-text)]">Parlons de</span>
                  <br />
                  <span className="text-gradient-brand">votre projet</span>
                </h1>
                <p className="text-[var(--color-text-secondary)] font-light leading-relaxed text-lg">
                  Une question ? Besoin d&apos;un devis sur-mesure ?
                  Notre équipe vous répond sous 24h.
                </p>
              </motion.div>

              {/* Floating contact info cards */}
              <div className="mt-10 space-y-4">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={index}
                    className="card-signal flex items-center gap-4 px-5 py-4"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7 + index * 0.15,
                      ease: [0.21, 0.47, 0.32, 0.98],
                    }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--color-copper)]/10 flex items-center justify-center shrink-0">
                      <item.icon className="w-5 h-5 text-[var(--color-copper)]" />
                    </div>
                    <div>
                      <p className="text-xs text-[var(--color-text-tertiary)] font-display font-600 uppercase tracking-wider">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="text-sm font-medium text-[var(--color-text)] hover:text-[var(--color-copper)] transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {item.value}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Bottom — Demo link */}
            <motion.div
              className="relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <p className="text-sm text-[var(--color-text-tertiary)] mb-3 font-light">
                Vous preferez une demonstration en direct ?
              </p>
              <a
                href="/demo"
                className="inline-flex items-center gap-2 text-sm font-display font-600 text-[var(--color-copper)] hover:text-[var(--color-copper-dark)] transition-colors group"
              >
                Voir la demo
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </div>

          {/* =============================================
              RIGHT PANEL — Contact form
              ============================================= */}
          <div className="flex-1 flex flex-col min-h-[calc(100vh-80px)] relative">
            {/* Background */}
            <div className="absolute inset-0 bg-[var(--color-bg)]" />

            {/* Mobile header (hidden on lg) */}
            <div className="lg:hidden relative z-10 px-6 pt-8 pb-4">
              <FadeIn>
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-[var(--color-copper)] mb-3">
                  Contact
                </p>
                <h1 className="font-display text-4xl font-800 tracking-[-0.03em] leading-[0.95] text-[var(--color-text)] mb-4">
                  Parlons de{" "}
                  <span className="text-gradient-brand">votre projet</span>
                </h1>
                <p className="text-base text-[var(--color-text-secondary)] font-light leading-relaxed">
                  Une question ? Besoin d&apos;un devis sur-mesure ? Notre équipe
                  vous répond sous 24h.
                </p>
              </FadeIn>

              {/* Mobile contact info */}
              <div className="flex flex-wrap gap-3 mt-6">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-3 py-2 rounded-full bg-[var(--color-bg-surface)] border border-[var(--color-border)] text-xs text-[var(--color-text-secondary)]"
                  >
                    <item.icon className="w-3.5 h-3.5 text-[var(--color-copper)]" />
                    {item.value}
                  </div>
                ))}
              </div>
            </div>

            {/* Form container */}
            <div className="relative z-10 flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
              <motion.div
                className="w-full max-w-[520px]"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                {/* Form header */}
                <div className="mb-10 hidden lg:block">
                  <h2 className="font-display text-3xl font-800 tracking-[-0.02em] text-[var(--color-text)] mb-2">
                    Envoyez-nous un message
                  </h2>
                  <p className="text-sm text-[var(--color-text-tertiary)] font-light">
                    Remplissez le formulaire et nous reviendrons vers vous rapidement.
                  </p>
                </div>

                {/* Form */}
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    /* ---- Success state ---- */
                    <motion.div
                      key="success"
                      className="flex flex-col items-center justify-center py-16 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98] }}
                    >
                      <motion.div
                        className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 12 }}
                        >
                          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </motion.div>
                      </motion.div>
                      <motion.h3
                        className="font-display text-2xl font-800 text-[var(--color-text)] mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        Message envoye !
                      </motion.h3>
                      <motion.p
                        className="text-sm text-[var(--color-text-secondary)] font-light"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        Notre équipe vous répondra sous 24h ouvrées.
                      </motion.p>
                    </motion.div>
                  ) : (
                    /* ---- Form state ---- */
                    <motion.form
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="grid sm:grid-cols-2 gap-5">
                        <PremiumInput
                          id="fullName"
                          name="fullName"
                          label="Nom complet"
                          placeholder="Jean Dupont"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                        />
                        <PremiumInput
                          id="email"
                          name="email"
                          type="email"
                          label="Email professionnel"
                          placeholder="vous@entreprise.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isSubmitting}
                          icon={Mail}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <PremiumInput
                          id="company"
                          name="company"
                          label="Entreprise"
                          placeholder="Nom de votre entreprise"
                          value={formData.company}
                          onChange={handleChange}
                          disabled={isSubmitting}
                        />

                        {/* Select */}
                        <div className="relative group">
                          <label
                            htmlFor="subject"
                            className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider"
                          >
                            Sujet
                          </label>
                          <div className="relative">
                            <select
                              id="subject"
                              name="subject"
                              required
                              value={formData.subject}
                              onChange={handleChange}
                              onFocus={() => setSubjectFocused(true)}
                              onBlur={() => setSubjectFocused(false)}
                              className={`w-full px-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[var(--color-copper)]/30 focus:border-[var(--color-copper)]/30 transition-all duration-300 ${
                                formData.subject === "" ? "text-[var(--color-text-tertiary)]" : "text-[var(--color-text)]"
                              }`}
                              disabled={isSubmitting}
                            >
                              {subjectOptions.map((opt) => (
                                <option
                                  key={opt.value}
                                  value={opt.value}
                                  disabled={opt.value === ""}
                                  className="bg-white text-[var(--color-text)]"
                                >
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Textarea */}
                      <div className="relative group">
                        <label
                          htmlFor="message"
                          className="block text-xs font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider"
                        >
                          Message
                        </label>
                        <div className="relative">
                          <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setMessageFocused(true)}
                            onBlur={() => setMessageFocused(false)}
                            placeholder="Decrivez votre besoin..."
                            className="w-full px-4 py-3.5 bg-white border border-[var(--color-border)] rounded-xl text-[var(--color-text)] text-sm placeholder:text-[var(--color-text-tertiary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-copper)]/30 focus:border-[var(--color-copper)]/30 transition-all duration-300 resize-none"
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>

                      {/* Submit button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-copper relative w-full py-4 rounded-xl font-semibold text-sm transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: isSubmitting ? 1 : 1.01 }}
                        whileTap={{ scale: isSubmitting ? 1 : 0.99 }}
                      >
                        <span className="relative flex items-center justify-center gap-2">
                          {isSubmitting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              >
                                <Send className="w-4 h-4" />
                              </motion.div>
                              Envoi en cours...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Envoyer le message
                            </>
                          )}
                        </span>
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {/* Bottom decorative line */}
                <div className="mt-10">
                  <div className="h-px bg-[var(--color-border)]" />
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
