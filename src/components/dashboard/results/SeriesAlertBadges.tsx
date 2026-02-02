"use client";

import { AlertBadge } from "@/components/ui/alert-badge";
import {
  getSeriesAlerts,
  sortAlertsByPriority,
  type SeriesAlertData,
} from "@/lib/series-alerts";

interface SeriesAlertBadgesProps {
  series: SeriesAlertData;
  maxBadges?: number;
  size?: "sm" | "default";
  className?: string;
}

export function SeriesAlertBadges({
  series,
  maxBadges = 3,
  size = "default",
  className,
}: SeriesAlertBadgesProps) {
  const alerts = sortAlertsByPriority(getSeriesAlerts(series));
  const displayedAlerts = alerts.slice(0, maxBadges);
  const hiddenCount = alerts.length - displayedAlerts.length;

  if (displayedAlerts.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className ?? ""}`}>
      {displayedAlerts.map((alert) => (
        <AlertBadge key={alert} type={alert} size={size} />
      ))}
      {hiddenCount > 0 && (
        <span className="text-xs text-zinc-500">+{hiddenCount}</span>
      )}
    </div>
  );
}
