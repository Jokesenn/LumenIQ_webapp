"use client";

import { useEffect, useRef } from "react";

const TOUR_STEPS = [
  {
    element: '[data-onboarding="champion-score-gauge"]',
    popover: {
      title: "Champion Score",
      description:
        "Le Champion Score mesure la fiabilité de vos prévisions sur une échelle de 0 à 100. Un score ≥ 90 signifie que vos forecasts sont excellents.",
    },
  },
  {
    element: '[data-onboarding="bias-gauge"]',
    popover: {
      title: "Biais directionnel",
      description:
        "Le BIAS indique si le modèle surestime (positif) ou sous-estime (négatif) vos ventes. Idéalement proche de 0%.",
    },
  },
  {
    element: '[data-onboarding="abc-xyz-matrix"]',
    popover: {
      title: "Matrice ABC/XYZ",
      description:
        "Chaque série est classée selon son importance (ABC) et sa stabilité (XYZ). Cliquez sur une cellule pour filtrer.",
    },
  },
  {
    element: '[data-onboarding="alerts-panel"]',
    popover: {
      title: "Panneau d'alertes",
      description:
        "Résumé des séries nécessitant votre attention : erreurs élevées, changements de modèle, dérive détectée.",
    },
  },
  {
    element: '[data-onboarding="synthesis-tab"]',
    popover: {
      title: "Synthèse IA",
      description:
        "L'IA analyse vos résultats et génère un rapport en langage naturel avec des recommandations actionnables.",
    },
  },
];

interface ResultsTourProps {
  enabled: boolean;
  onComplete: () => void;
}

export function ResultsTour({ enabled, onComplete }: ResultsTourProps) {
  const hasLaunched = useRef(false);

  useEffect(() => {
    if (!enabled || hasLaunched.current) return;

    const timer = setTimeout(async () => {
      hasLaunched.current = true;

      const { driver } = await import("driver.js");
      // @ts-expect-error -- CSS module has no type declarations
      await import("driver.js/dist/driver.css");

      const driverObj = driver({
        showProgress: true,
        animate: true,
        overlayColor: "rgba(0, 0, 0, 0.75)",
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: "lumeniq-tour-popover",
        nextBtnText: "Suivant",
        prevBtnText: "Précédent",
        doneBtnText: "Terminer",
        progressText: "{{current}} / {{total}}",
        onDestroyStarted: () => {
          onComplete();
          driverObj.destroy();
        },
        steps: TOUR_STEPS,
      });

      driverObj.drive();
    }, 1500);

    return () => clearTimeout(timer);
  }, [enabled, onComplete]);

  return null;
}
