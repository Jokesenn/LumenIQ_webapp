"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Clock, Headphones, Send, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/shared";
import { FadeIn } from "@/components/animations";
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
    "w-full px-4 py-3 bg-white/5 border border-white/[0.1] rounded-lg text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-shadow";

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

    // Simulate sending delay
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
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/8 blur-[120px] pointer-events-none" />

      <Navbar />

      <main className="relative z-10 pt-20">
        {/* Hero Section */}
        <section className="py-20 md:py-24 px-6">
          <div className="max-w-[700px] mx-auto text-center">
            <FadeIn>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-[-0.02em] text-white mb-6">
                Contactez-nous
              </h1>
            </FadeIn>

            <FadeIn delay={0.1}>
              <p className="text-lg text-zinc-400 leading-relaxed">
                Une question ? Besoin d&apos;un devis sur-mesure ? Notre équipe
                vous répond sous 24h.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* Form + Info Grid */}
        <section className="pb-24 px-6">
          <div className="max-w-[1000px] mx-auto grid lg:grid-cols-5 gap-8">
            {/* Contact Form */}
            <FadeIn delay={0.2} className="lg:col-span-3">
              <motion.div
                className="glass-card p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
              >
                <h2 className="text-xl font-semibold text-white mb-6">
                  Envoyez-nous un message
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Nom complet */}
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-sm font-medium text-zinc-300 mb-2"
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

                  {/* Email professionnel */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-zinc-300 mb-2"
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

                  {/* Entreprise */}
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-zinc-300 mb-2"
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

                  {/* Sujet */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-zinc-300 mb-2"
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
                        formData.subject === "" ? "text-zinc-500" : "text-white"
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

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-zinc-300 mb-2"
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

                  {/* Submit */}
                  <Button
                    type="submit"
                    size="large"
                    className="w-full justify-center bg-indigo-500 hover:bg-indigo-600 text-white"
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
              </motion.div>
            </FadeIn>

            {/* Side Info Card */}
            <FadeIn delay={0.35} className="lg:col-span-2">
              <div className="glass-card p-8 h-fit lg:sticky lg:top-28">
                <h3 className="text-lg font-semibold text-white mb-6">
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
                        <p className="text-sm text-zinc-500 mb-0.5">
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

                {/* Separator */}
                <div className="my-8 border-t border-white/[0.08]" />

                {/* Extra info */}
                <div className="space-y-4">
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    Vous préférez une démonstration en direct ? Planifiez un
                    appel avec notre équipe pour découvrir LumenIQ adapté à
                    votre activité.
                  </p>
                  <a
                    href="/demo"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    Voir la démo
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
