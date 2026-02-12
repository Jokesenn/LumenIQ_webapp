"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Headphones, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/shared";
import { FadeIn, TiltCard } from "@/components/animations";
import { Button } from "@/components/ui/button";

const subjectOptions = [
  { value: "", label: "Sélectionnez un sujet" },
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
    label: "Réponse",
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "w-full px-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-transparent transition-all";

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

    toast.success("Message envoyé !", {
      description: "Notre équipe vous répondra sous 24h.",
    });

    setFormData({
      fullName: "",
      email: "",
      company: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      <div className="absolute inset-0 bg-hex-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/8 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/6 blur-[140px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* Header */}
        <section className="py-24 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="mb-16">
              <FadeIn>
                <p className="text-sm font-display font-600 uppercase tracking-[0.2em] text-indigo-400 mb-4">
                  Contact
                </p>
              </FadeIn>
              <FadeIn delay={0.1}>
                <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-800 tracking-[-0.03em] leading-[0.95] text-white mb-6">
                  Parlons de
                  <br />
                  <span className="text-gradient-brand">votre projet</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2}>
                <p className="text-lg text-zinc-400 max-w-[500px] font-light leading-relaxed">
                  Une question ? Besoin d&apos;un devis sur-mesure ? Notre équipe
                  vous répond sous 24h.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Form + Info Grid */}
        <section className="pb-28 px-6">
          <div className="max-w-[1200px] mx-auto grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <FadeIn delay={0.2} className="lg:col-span-3">
              <div className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 overflow-hidden">
                {/* Gradient top edge */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                <h2 className="text-xl font-display font-700 text-white mb-8">
                  Envoyez-nous un message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-sm font-medium text-zinc-400 mb-2"
                      >
                        Nom complet
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Jean Dupont"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-zinc-400 mb-2"
                      >
                        Email professionnel
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="vous@entreprise.com"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium text-zinc-400 mb-2"
                      >
                        Entreprise
                      </label>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Nom de votre entreprise"
                        className={inputClass}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="subject"
                        className="block text-sm font-medium text-zinc-400 mb-2"
                      >
                        Sujet
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className={`${inputClass} appearance-none cursor-pointer ${
                          formData.subject === "" ? "text-zinc-600" : "text-white"
                        }`}
                        disabled={isSubmitting}
                      >
                        {subjectOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            disabled={opt.value === ""}
                            className="bg-zinc-900 text-white"
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-zinc-400 mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre besoin..."
                      className={`${inputClass} resize-none`}
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="large"
                    className="w-full justify-center bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl py-3.5 font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Send className="w-4 h-4" />
                        </motion.div>
                        Envoi en cours...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Envoyer le message
                      </span>
                    )}
                  </Button>
                </form>
              </div>
            </FadeIn>

            {/* Side Info Card */}
            <FadeIn delay={0.35} className="lg:col-span-2">
              <TiltCard>
                <div className="relative rounded-2xl border border-white/[0.05] bg-zinc-900/30 p-8 h-fit lg:sticky lg:top-28 overflow-hidden">
                  {/* Gradient top edge */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />

                  <h3 className="text-lg font-display font-700 text-white mb-8">
                    Informations de contact
                  </h3>

                  <div className="space-y-6">
                    {contactInfo.map((item, index) => (
                      <motion.div
                        key={index}
                        className="flex items-start gap-4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.5 + index * 0.1,
                          ease: [0.21, 0.47, 0.32, 0.98],
                        }}
                      >
                        <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5 text-indigo-400" />
                        </div>
                        <div>
                          <p className="text-sm text-zinc-500 mb-0.5 font-display font-600">
                            {item.label}
                          </p>
                          {item.href ? (
                            <a
                              href={item.href}
                              className="text-sm font-medium text-white hover:text-indigo-400 transition-colors"
                            >
                              {item.value}
                            </a>
                          ) : (
                            <p className="text-sm font-medium text-white">
                              {item.value}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="my-8 border-t border-white/[0.04]" />

                  <div className="space-y-4">
                    <p className="text-sm text-zinc-400 leading-relaxed font-light">
                      Vous préférez une démonstration en direct ? Planifiez un
                      appel avec notre équipe pour découvrir LumenIQ adapté à
                      votre activité.
                    </p>
                    <a
                      href="/demo"
                      className="inline-flex items-center gap-1.5 text-sm font-display font-600 text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Voir la démo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </TiltCard>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
