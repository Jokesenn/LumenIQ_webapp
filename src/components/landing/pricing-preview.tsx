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
        <h2 className="text-3xl md:text-[40px] font-bold mb-4 tracking-[-0.01em] text-gradient">
          Tarification simple et transparente
        </h2>
        <p className="text-lg text-zinc-400 mb-16">
          Pas de coûts cachés. Pas d&apos;engagement. Essai gratuit 3 mois.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {pricingPlans.map((plan) => (
            <PricingCard key={plan.name} plan={plan} icon={icons[plan.name]} />
          ))}
        </div>

        <Link href="/pricing">
          <Button
            variant="outline"
            size="large"
            className="border-white/[0.1] text-zinc-300 hover:bg-white/5 hover:text-white"
          >
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
  const isRecommended = plan.popular || plan.badge === "BEST VALUE";

  const badgeStyle =
    plan.badge === "BEST VALUE"
      ? { bg: "#10b981", text: "#FFF" }
      : plan.badge === "PREMIUM"
      ? { bg: "#f59e0b", text: "#FFF" }
      : { bg: "#6366f1", text: "#FFF" };

  return (
    <div
      className={`relative glass-card p-8 flex flex-col text-center ${
        isRecommended
          ? "border-2 !border-indigo-500 glow-accent"
          : ""
      }`}
    >
      {(plan.popular || plan.badge) && (
        <div
          className="absolute top-[-12px] left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap"
          style={{
            backgroundColor: plan.badge ? badgeStyle.bg : "#6366f1",
            color: badgeStyle.text,
          }}
        >
          {plan.badge || "PLUS POPULAIRE"}
        </div>
      )}

      <div className="flex items-center justify-center gap-3 mb-2">
        {icon && (
          <div
            className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center"
            style={{
              color: plan.badge === "PREMIUM" ? "#f59e0b" : "#6366f1",
            }}
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
        <span className="text-4xl font-bold text-gradient">€{plan.price}</span>
        <span className="text-base text-zinc-500">/mois</span>
      </div>

      <Link href="/dashboard" className="mb-6">
        <Button
          className={`w-full justify-center ${
            isRecommended
              ? "bg-indigo-500 hover:bg-indigo-600 text-white"
              : "bg-white/5 text-zinc-300 hover:bg-white/10 border border-white/[0.08]"
          }`}
        >
          Commencer l&apos;essai
        </Button>
      </Link>

      <div className="space-y-2.5 flex-1 text-left">
        {plan.features.slice(0, 7).map((f, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span className="text-sm text-zinc-400">{f}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
