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
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-[-0.02em]">
                Tarification
              </h1>
              <p className="text-lg text-[var(--text-secondary)]">
                Essai gratuit 3 mois. Aucun engagement. Annulez à tout moment.
              </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
              {pricingPlans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} icon={icons[plan.name]} />
              ))}
            </div>

            {/* Comparison Table */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8 mb-8">
              <h3 className="text-xl font-semibold mb-6">Comparaison détaillée</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-4 text-[var(--text-muted)]">Feature</th>
                      <th className="text-center py-3 px-4">Standard</th>
                      <th className="text-center py-3 px-4 text-[var(--accent)]">ML ⭐</th>
                      <th className="text-center py-3 px-4 text-[#F59E0B]">Foundation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Séries / mois", "50", "150", "300"],
                      ["Modèles disponibles", "10 stats", "13 (+ ML)", "15+ (+ Foundation)"],
                      ["Ridge / LightGBM", "❌", "✅", "✅"],
                      ["TimeGPT", "❌", "❌", "✅"],
                      ["EnsembleTop2", "❌", "❌", "✅"],
                      ["API Access", "❌", "❌", "✅"],
                      ["Historique", "30 jours", "60 jours", "90 jours"],
                      ["Support", "Email 48h", "Email 24h", "Prioritaire 4h"],
                    ].map(([feature, std, ml, found], i) => (
                      <tr key={i} className="border-b border-[var(--border)]">
                        <td className="py-3 px-4 text-[var(--text-secondary)]">{feature}</td>
                        <td className="text-center py-3 px-4">{std}</td>
                        <td className="text-center py-3 px-4">{ml}</td>
                        <td className="text-center py-3 px-4">{found}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Enterprise CTA */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border)] p-8">
              <h3 className="text-lg font-semibold mb-4">
                Besoin d&apos;un volume supérieur ?
              </h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Pour les entreprises avec plus de 500 séries/mois ou des besoins spécifiques
                (on-premise, intégrations custom, SLA), contactez-nous pour un devis personnalisé.
              </p>
              <Button variant="secondary">
                <Mail size={18} />
                Contacter l&apos;équipe
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
  const badgeStyle =
    plan.badge === "BEST VALUE"
      ? { bg: "var(--success)", text: "#FFF" }
      : plan.badge === "PREMIUM"
      ? { bg: "#F59E0B", text: "#FFF" }
      : { bg: "var(--accent)", text: "#FFF" };

  return (
    <div
      className={`relative rounded-2xl border p-8 flex flex-col ${
        plan.popular || plan.badge === "BEST VALUE"
          ? "border-2 border-[var(--accent)] bg-[var(--bg-secondary)]"
          : plan.badge === "PREMIUM"
          ? "border-2 border-[#F59E0B] bg-[var(--bg-secondary)]"
          : "border-[var(--border)] bg-[var(--bg-secondary)]"
      }`}
    >
      {(plan.popular || plan.badge) && (
        <div
          className="absolute top-[-12px] left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
          style={{
            backgroundColor: plan.badge ? badgeStyle.bg : "var(--accent)",
            color: badgeStyle.text,
          }}
        >
          {plan.badge || "PLUS POPULAIRE"}
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        {icon && (
          <div
            className="w-10 h-10 rounded-lg bg-[var(--accent-muted)] flex items-center justify-center"
            style={{
              color: plan.badge === "PREMIUM" ? "#F59E0B" : "var(--accent)",
            }}
          >
            {icon}
          </div>
        )}
        <h3 className="text-2xl font-bold">{plan.name}</h3>
      </div>

      <p className="text-sm text-[var(--text-secondary)] mb-5 min-h-[42px]">
        {plan.description}
      </p>

      <div className="mb-6">
        <span className="text-[44px] font-extrabold">€{plan.price}</span>
        <span className="text-base text-[var(--text-muted)]">/mois</span>
      </div>

      <Link href="/dashboard" className="mb-6">
        <Button
          variant={plan.popular || plan.badge === "BEST VALUE" ? "primary" : "secondary"}
          className="w-full justify-center"
        >
          Commencer l&apos;essai gratuit
        </Button>
      </Link>

      <div className="space-y-2.5 flex-1">
        {plan.features.map((f, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Check size={16} className="text-[var(--success)] shrink-0" />
            <span className="text-sm text-[var(--text-secondary)]">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
