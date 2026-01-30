import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-[120px] px-6">
      <div className="max-w-[900px] mx-auto">
        <div className="relative glass-card py-20 px-8 md:px-[60px] text-center overflow-hidden">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10 pointer-events-none" />

          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/15 blur-[120px] pointer-events-none" />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-[44px] font-bold mb-5 tracking-[-0.015em] text-gradient">
              Prêt à transformer vos prévisions ?
            </h2>
            <p className="text-lg text-zinc-400 mb-10 max-w-xl mx-auto">
              Rejoignez notre bêta et bénéficiez de 3 mois gratuits.
              <br />
              Aucune carte de crédit requise.
            </p>
            <Link href="/dashboard">
              <Button size="large" className="bg-indigo-500 hover:bg-indigo-600 text-white glow-accent">
                Démarrer gratuitement
                <ArrowRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
