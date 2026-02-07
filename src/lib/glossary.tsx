import type { ReactNode } from "react";

export const GLOSSARY: Record<string, ReactNode> = {
  championScore: (
    <div>
      <p className="font-medium mb-2">Pouvez-vous faire confiance à ces prévisions ?</p>
      <p className="text-white/70 text-sm mb-3">
        Score de fiabilité du modèle champion (100 = parfait). Ce score vous dit si vous pouvez utiliser ces chiffres pour passer vos commandes fournisseurs.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">{"≥"} 90</span>
          <span className="text-white/60">→ Commandez en confiance</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">70-89</span>
          <span className="text-white/60">→ Fiable, gardez une marge de sécurité</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-medium">{"<"} 70</span>
          <span className="text-white/60">→ Vérifiez les données sources</span>
        </li>
      </ul>
    </div>
  ),

  smape: (
    <div>
      <p className="font-medium mb-2">Précision symétrique des prévisions</p>
      <p className="text-white/70 text-sm mb-3">
        Mesure l&apos;écart entre prévisions et réalité, en pénalisant de la même façon les sur et sous-estimations.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">{"<"} 10%</span>
          <span className="text-white/60">→ Excellent</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">10-20%</span>
          <span className="text-white/60">→ Bon, marge de sécurité conseillée</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-medium">{">"}20%</span>
          <span className="text-white/60">→ À surveiller</span>
        </li>
      </ul>
    </div>
  ),

  mape: (
    <div>
      <p className="font-medium mb-2">Erreur moyenne de prévision</p>
      <p className="text-white/70 text-sm">
        Mesure l&apos;écart moyen entre vos prévisions et les ventes réelles. Utile pour comparer la performance globale de vos forecasts.
      </p>
    </div>
  ),

  bias: (
    <div>
      <p className="font-medium mb-2">Risquez-vous la rupture ou le surstock ?</p>
      <p className="text-white/70 text-sm mb-3">
        Ce chiffre vous alerte sur votre risque principal.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">Positif</span>
          <span className="text-white/60">→ Risque de surstock (vous prévoyez trop)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-400 font-medium">Négatif</span>
          <span className="text-white/60">→ Risque de rupture (vous prévoyez pas assez)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">~0%</span>
          <span className="text-white/60">→ Équilibré, risque maîtrisé</span>
        </li>
      </ul>
    </div>
  ),

  abc: (
    <div>
      <p className="font-medium mb-2">Où concentrer vos efforts ?</p>
      <p className="text-white/70 text-sm mb-3">
        Vos produits classés par impact sur votre chiffre d&apos;affaires.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">A</span>
          <span className="text-white/60">→ Vos best-sellers. Une rupture ici coûte cher.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">B</span>
          <span className="text-white/60">→ Importants mais moins critiques.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-medium">C</span>
          <span className="text-white/60">→ Petits volumes. Gérez-les en lot.</span>
        </li>
      </ul>
    </div>
  ),

  xyz: (
    <div>
      <p className="font-medium mb-2">Ces prévisions sont-elles fiables ?</p>
      <p className="text-white/70 text-sm mb-3">
        Indique si les ventes de ce produit sont prévisibles ou chaotiques.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">X</span>
          <span className="text-white/60">→ Ventes régulières. Prévisions fiables.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">Y</span>
          <span className="text-white/60">→ Ventes variables. Gardez du stock tampon.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-medium">Z</span>
          <span className="text-white/60">→ Ventes erratiques. Commandez à la demande.</span>
        </li>
      </ul>
    </div>
  ),

  abcxyz_matrix: (
    <div>
      <p className="font-medium mb-2">Quelle stratégie pour chaque produit ?</p>
      <p className="text-white/70 text-sm mb-3">
        Croisez importance (ABC) et prévisibilité (XYZ) pour décider.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">AX</span>
          <span className="text-white/60">→ Automatisez les commandes</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">AZ</span>
          <span className="text-white/60">→ Surveillez de près, stock de sécurité élevé</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-medium">CZ</span>
          <span className="text-white/60">→ Commandez uniquement sur demande client</span>
        </li>
      </ul>
      <p className="text-white/50 text-xs mt-3">Cliquez sur une cellule pour voir les produits.</p>
    </div>
  ),

  champion: (
    <div>
      <p className="font-medium mb-2">Pourquoi ce modèle ?</p>
      <p className="text-white/70 text-sm">
        LumenIQ a testé 21 approches différentes sur ce produit et a gardé celle qui prédit le mieux VOS ventes passées. C&apos;est du sur-mesure.
      </p>
      <p className="text-white/50 text-xs mt-3">
        Vous n&apos;avez rien à configurer, c&apos;est automatique.
      </p>
    </div>
  ),

  horizon: (
    <div>
      <p className="font-medium mb-2">Sur quelle période planifier ?</p>
      <p className="text-white/70 text-sm">
        Les prévisions sont calculées sur les prochains mois. Idéal pour vos négociations fournisseurs et votre budget annuel.
      </p>
    </div>
  ),

  cv: (
    <div>
      <p className="font-medium mb-2">Ce produit est-il prévisible ?</p>
      <p className="text-white/70 text-sm mb-3">
        Mesure la régularité des ventes passées.
      </p>
      <ul className="text-sm space-y-1.5">
        <li className="flex items-start gap-2">
          <span className="text-emerald-400 font-medium">Stable</span>
          <span className="text-white/60">→ Ventes régulières, facile à prévoir</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-amber-400 font-medium">Variable</span>
          <span className="text-white/60">→ Fluctuations saisonnières ou tendances</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-red-400 font-medium">Erratique</span>
          <span className="text-white/60">→ Ventes imprévisibles, soyez prudent</span>
        </li>
      </ul>
    </div>
  ),

  model_changed: (
    <div>
      <p className="font-medium mb-2">Pourquoi ce badge ?</p>
      <p className="text-white/70 text-sm">
        Le comportement de ce produit a évolué depuis la dernière analyse. LumenIQ a trouvé une meilleure approche pour le prévoir.
      </p>
      <p className="text-white/50 text-xs mt-3">
        C&apos;est normal et souvent positif — le système s&apos;adapte.
      </p>
    </div>
  ),

  attention: (
    <div>
      <p className="font-medium mb-2">Pourquoi ce badge ?</p>
      <p className="text-white/70 text-sm">
        Les prévisions de ce produit sont moins fiables que la moyenne. Causes possibles :
      </p>
      <ul className="text-sm space-y-1 mt-2 text-white/60">
        <li>• Ventes très irrégulières</li>
        <li>• Pas assez d&apos;historique</li>
        <li>• Événement exceptionnel dans les données</li>
      </ul>
      <p className="text-white/50 text-xs mt-3">
        Vérifiez les données sources de ce produit.
      </p>
    </div>
  ),

  top_performers: (
    <div>
      <p className="font-medium mb-2">Vos prévisions les plus fiables</p>
      <p className="text-white/70 text-sm">
        Ces produits ont les meilleurs scores de précision. Vous pouvez utiliser ces prévisions en confiance pour vos commandes.
      </p>
    </div>
  ),

  to_watch: (
    <div>
      <p className="font-medium mb-2">À surveiller de près</p>
      <p className="text-white/70 text-sm">
        Ces produits ont des prévisions moins fiables. Gardez un œil sur eux et ajustez manuellement si nécessaire.
      </p>
    </div>
  ),

  series_count: (
    <div>
      <p className="font-medium mb-2">Combien de produits analysés ?</p>
      <p className="text-white/70 text-sm">
        Nombre de produits (SKUs) traités dans cette analyse. Chacun a son propre modèle de prévision optimisé.
      </p>
    </div>
  ),

  forecast_graph: (
    <div>
      <p className="font-medium mb-2">Comment lire ce graphique ?</p>
      <p className="text-white/70 text-sm mb-2">
        La ligne continue montre vos ventes passées. La zone colorée montre les prévisions futures.
      </p>
      <ul className="text-sm space-y-1 text-white/60">
        <li>• <span className="text-white/80">Ligne bleue</span> → Historique réel</li>
        <li>• <span className="text-violet-400">Zone violette</span> → Prévisions + marge d&apos;incertitude</li>
      </ul>
    </div>
  ),
};
