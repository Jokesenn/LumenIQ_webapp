import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BarChart3, Cpu, Brain, Check, ArrowRight } from "lucide-react";
import { pricingPlans } from "@/lib/mock-data";

const icons: Record<string, React.ReactNode> = {
  Standard: <BarChart3 size={20} />,
  ML: <Cpu size={20} />,
  Foundation: <Brain size={20} />,
};

export function PricingPreview() {
  return (
    <section className="py-[120px] px-6" id="pricing">
      <div className="max-w-[1000px] mx-auto text-center">
        <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-[-0.01em]">
          Tarification simple et transparente
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mb-16">
          Pas de coûts cachés. Pas d&apos;engagement. Essai gratuit 3 mois.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} icon={icons[plan.name]} />
          ))}
        </div>

        <Link href="/pricing">
          <Button variant="secondary" size="large">
            Voir tous les détails
            <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </section>
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
      className={`relative rounded-2xl border p-8 flex flex-col text-center ${
        plan.popular || plan.badge === "BEST VALUE"
          ? "border-2 border-[var(--accent)] bg-[var(--bg-secondary)]"
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

      <div className="flex items-center justify-center gap-3 mb-2">
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
          Commencer l&apos;essai
        </Button>
      </Link>

      <div className="space-y-2.5 flex-1 text-left">
        {plan.features.slice(0, 7).map((f, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Check size={16} className="text-[var(--success)] shrink-0" />
            <span className="text-sm text-[var(--text-secondary)]">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
