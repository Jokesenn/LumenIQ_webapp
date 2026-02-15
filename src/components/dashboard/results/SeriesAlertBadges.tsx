"use client";

import { AlertBadge } from "@/components/ui/alert-badge";
import { BadgeWithTooltip } from "@/components/ui/badge-with-tooltip";
import { GLOSSARY } from "@/lib/glossary";
import {
  getSeriesAlerts,
  sortAlertsByPriority,
  type SeriesAlertData,
} from "@/lib/series-alerts";
import { useThresholds } from "@/lib/thresholds/context";

interface SeriesAlertBadgesProps {
  series: SeriesAlertData;
  maxBadges?: number;
  size?: "sm" | "default";
  className?: string;
}

const ALERT_GLOSSARY_KEY: Record<string, string | undefined> = {
  attention: "attention",
  watch: "watch",
  drift: "drift",
  "model-changed": "model_changed",
  gated: "gated",
};

export function SeriesAlertBadges({
  series,
  maxBadges = 3,
  size = "default",
  className,
}: SeriesAlertBadgesProps) {
  const { thresholds } = useThresholds();
  const wapeThresholds = {
    attention: thresholds.wape.yellow_max,
    watch: thresholds.wape.green_max,
  };
  const alerts = sortAlertsByPriority(getSeriesAlerts(series, { wapeThresholds }));
  const displayedAlerts = alerts.slice(0, maxBadges);
  const hiddenCount = alerts.length - displayedAlerts.length;

  if (displayedAlerts.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-1.5 flex-wrap ${className ?? ""}`}>
      {displayedAlerts.map((alert) => {
        const glossaryKey = ALERT_GLOSSARY_KEY[alert];
        const tooltipContent = glossaryKey ? GLOSSARY[glossaryKey] : undefined;

        if (tooltipContent) {
          return (
            <BadgeWithTooltip key={alert} tooltip={tooltipContent}>
              <AlertBadge type={alert} size={size} />
            </BadgeWithTooltip>
          );
        }

        return <AlertBadge key={alert} type={alert} size={size} />;
      })}
      {hiddenCount > 0 && (
        <span className="text-xs text-zinc-500">+{hiddenCount}</span>
      )}
    </div>
  );
}
