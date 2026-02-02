"use client";

import { AlertBadge, type AlertType } from "@/components/ui/alert-badge";
import { countAlertsByType, type SeriesAlertData } from "@/lib/series-alerts";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface AlertsSummaryCardProps {
  seriesList: SeriesAlertData[];
  onFilterAlerts?: () => void;
}

export function AlertsSummaryCard({
  seriesList,
  onFilterAlerts,
}: AlertsSummaryCardProps) {
  const counts = countAlertsByType(seriesList);

  // Alertes à afficher (exclure gated car c'est positif)
  const alertTypes: AlertType[] = [
    "attention",
    "watch",
    "drift",
    "model-changed",
    "new",
  ];
  const hasAlerts = alertTypes.some((type) => counts[type] > 0);
  const totalCritical = counts.attention + counts.watch;

  return (
    <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-zinc-400">Alertes</h3>
        {counts.gated > 0 && (
          <span className="text-xs text-emerald-400">
            {counts.gated} séries optimisées
          </span>
        )}
      </div>

      {hasAlerts ? (
        <>
          <div className="space-y-3">
            {alertTypes.map((type) => {
              if (counts[type] === 0) return null;
              return (
                <div key={type} className="flex justify-between items-center">
                  <AlertBadge type={type} />
                  <span className="text-lg font-bold text-white">
                    {counts[type]}
                  </span>
                </div>
              );
            })}
          </div>

          {totalCritical > 0 && onFilterAlerts && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 justify-between text-zinc-400"
              onClick={onFilterAlerts}
            >
              Voir les séries concernées
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-sm text-zinc-400">Aucune alerte</p>
          <p className="text-xs text-emerald-400 mt-1">
            Toutes les séries sont en bonne santé
          </p>
        </div>
      )}
    </div>
  );
}
