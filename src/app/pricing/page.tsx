import { Navbar, Footer } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { BarChart3, Cpu, Brain, Check, Mail } from "lucide-react";
import Link from "next/link";
import { pricingPlans } from "@/lib/mock-data";

const icons: Record<string, React.ReactNode> = {
  Standard: <BarChart3 size={20} />,
  ML: <Cpu size={20} />,
  Foundation: <Brain size={20} />,
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-[-0.02em] text-white">
                Tarification
              </h1>
              <p className="text-lg text-zinc-400">
                Essai gratuit 3 mois. Aucun engagement. Annulez \u00e0 tout moment.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} icon={icons[plan.name]} />
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.08] p-8 mb-8">
              <h3 className="text-xl font-semibold text-white mb-6">Comparaison d\u00e9taill\u00e9e</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-3 px-4 text-zinc-500">Feature</th>
                      <th className="text-center py-3 px-4 text-white">Standard</th>
                      <th className="text-center py-3 px-4 text-indigo-400">ML &#11088;</th>
                      <th className="text-center py-3 px-4 text-amber-400">Foundation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["S\u00e9ries / mois", "50", "150", "300"],
                      ["Mod\u00e8les disponibles", "10 stats", "13 (+ ML)", "15+ (+ Foundation)"],
                      ["Ridge / LightGBM", "\u274c", "\u2705", "\u2705"],
                      ["TimeGPT", "\u274c", "\u274c", "\u2705"],
                      ["EnsembleTop2", "\u274c", "\u274c", "\u2705"],
                      ["API Access", "\u274c", "\u274c", "\u2705"],
                      ["Historique", "30 jours", "60 jours", "90 jours"],
                      ["Support", "Email 48h", "Email 24h", "Prioritaire 4h"],
                    ].map(([feature, std, ml, found], i) => (
                      <tr key={i} className="border-b border-white/[0.08]">
                        <td className="py-3 px-4 text-zinc-400">{feature}</td>
                        <td className="text-center py-3 px-4 text-zinc-300">{std}</td>
                        <td className="text-center py-3 px-4 text-zinc-300">{ml}</td>
                        <td className="text-center py-3 px-4 text-zinc-300">{found}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enterprise CTA */}
            <div className="bg-zinc-900/50 rounded-2xl border border-white/[0.08] p-8">
              <h3 className="text-lg font-semibold text-white mb-4">
                Besoin d&apos;un volume sup\u00e9rieur ?
              </h3>
              <p className="text-zinc-400 mb-4">
                Pour les entreprises avec plus de 500 s\u00e9ries/mois ou des besoins sp\u00e9cifiques
                (on-premise, int\u00e9grations custom, SLA), contactez-nous pour un devis personnalis\u00e9.
              </p>
              <Button variant="secondary">
                <Mail size={18} />
                Contacter l&apos;\u00e9quipe
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

interface PricingCardProps {
  plan: (typeof pricingPlans)[0];
  icon: React.ReactNode;
}

function PricingCard({ plan, icon }: PricingCardProps) {
  const isML = plan.popular || plan.badge === "BEST VALUE";
  const isPremium = plan.badge === "PREMIUM";

  return (
    <div
      className={`relative rounded-2xl border p-8 flex flex-col ${
        isML
          ? "border-2 border-indigo-500 bg-zinc-900/50 glow-accent"
          : isPremium
          ? "border-2 border-amber-500 bg-zinc-900/50"
          : "border-white/[0.08] bg-zinc-900/50"
      }`}
    >
      {(plan.popular || plan.badge) && (
        <div
          className={`absolute top-[-12px] left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap text-white ${
            isPremium
              ? "bg-amber-500"
              : plan.badge === "BEST VALUE"
              ? "bg-emerald-500"
              : "bg-indigo-500"
          }`}
        >
          {plan.badge || "PLUS POPULAIRE"}
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isPremium ? "bg-amber-500/10 text-amber-400" : "bg-indigo-500/10 text-indigo-400"
            }`}
          >
            {icon}
          </div>
        )}
        <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
      </div>

      <p className="text-sm text-zinc-400 mb-5 min-h-[42px]">
        {plan.description}
      </p>

      <div className="mb-6">
        <span className="text-[44px] font-extrabold text-white">\u20ac{plan.price}</span>
        <span className="text-base text-zinc-500">/mois</span>
      </div>

      <Link href="/dashboard" className="mb-6">
        <Button
          variant={isML ? "primary" : "secondary"}
          className="w-full justify-center"
        >
          Commencer l&apos;essai gratuit
        </Button>
      </Link>

      <div className="space-y-2.5 flex-1">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Check size={16} className="text-emerald-500 shrink-0" />
            <span className="text-sm text-zinc-400">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
