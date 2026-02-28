/**
 * Frequency-aware date formatting for chart axes.
 *
 * Classifies pandas-style frequency strings (MS, ME, W, 7D, D, H, Q…)
 * into families and formats dates accordingly so that weekly data shows
 * week-level labels, daily data shows day-level labels, etc.
 */

type FreqFamily = "H" | "D" | "W" | "M" | "Q";

export function classifyFreq(freq: string): FreqFamily {
  if (!freq) return "M";

  const upper = freq.toUpperCase();

  // Special case: "7D" is effectively weekly
  if (upper.startsWith("7D")) return "W";

  // Strip leading digit multiplier (e.g. "2MS" → "MS")
  const base = upper.replace(/^\d+/, "");

  if (base.startsWith("H") || base === "T" || base === "MIN") return "H";
  if (base.startsWith("W")) return "W";
  if (base.startsWith("Q")) return "Q";
  if (base.startsWith("D") || base === "B") return "D";
  // Monthly: M, MS, ME, BM, BMS, BME, SM, etc.
  if (base.includes("M")) return "M";

  return "M";
}

/**
 * Format a date string according to the detected forecast frequency.
 *
 * - Hourly  → "dd/MM HH:mm"
 * - Daily   → "dd MMM"         (e.g. "01 mars")
 * - Weekly  → "dd MMM yy"      (e.g. "03 mars 25")
 * - Monthly → "MMM yy"         (e.g. "mars 25")  — current default
 * - Quarterly → "T1 25"
 *
 * Falls back to monthly format when frequency is null/undefined.
 */
export function formatDateByFrequency(
  ds: string,
  frequency: string | null | undefined,
): string {
  const date = new Date(ds);
  const family = classifyFreq(frequency ?? "");

  switch (family) {
    case "H":
      return (
        date.toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
        }) +
        " " +
        date.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
      );

    case "D":
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
      });

    case "W":
      return date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
      });

    case "Q": {
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      return `T${quarter} ${date.getFullYear().toString().slice(-2)}`;
    }

    case "M":
    default:
      return date.toLocaleDateString("fr-FR", {
        month: "short",
        year: "2-digit",
      });
  }
}

/**
 * Return a French human-readable label for a frequency string.
 */
export function formatFrequencyLabel(freq: string | null): string {
  if (!freq) return "Mensuel";
  const family = classifyFreq(freq);
  const labels: Record<string, string> = {
    H: "Horaire",
    D: "Journalier",
    W: "Hebdomadaire",
    M: "Mensuel",
    Q: "Trimestriel",
  };
  return labels[family] ?? "Mensuel";
}
