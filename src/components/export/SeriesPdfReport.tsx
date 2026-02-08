"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { SeriesPdfData, ForecastPoint } from "@/types/export";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#0f0f0f",
    color: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  logo: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#8b5cf6",
  },
  date: {
    fontSize: 10,
    color: "#666",
  },
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 10,
    fontWeight: "bold",
  },
  badgeABC: {
    backgroundColor: "rgba(34, 197, 94, 0.2)",
    color: "#22c55e",
  },
  badgeXYZ: {
    backgroundColor: "rgba(59, 130, 246, 0.2)",
    color: "#3b82f6",
  },
  subtitle: {
    fontSize: 11,
    color: "#888",
  },
  metricsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#ccc",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    borderRadius: 8,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  metricLabel: {
    fontSize: 9,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  metricValue: {
    fontSize: 22,
    fontWeight: "bold",
  },
  metricValueGood: {
    color: "#22c55e",
  },
  metricValueWarning: {
    color: "#f59e0b",
  },
  metricValueBad: {
    color: "#ef4444",
  },
  metricSubtext: {
    fontSize: 9,
    color: "#666",
    marginTop: 2,
  },
  chartSection: {
    marginBottom: 24,
  },
  chartImage: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
  },
  chartPlaceholder: {
    width: "100%",
    height: 220,
    borderRadius: 8,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
  },
  tableSection: {
    marginBottom: 24,
  },
  table: {
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 9,
    fontWeight: "bold",
    color: "#888",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  tableRowAlt: {
    backgroundColor: "#141414",
  },
  tableCell: {
    flex: 1,
    fontSize: 10,
    color: "#ccc",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  footerText: {
    fontSize: 9,
    color: "#666",
  },
  footerBrand: {
    fontSize: 9,
    color: "#8b5cf6",
  },
});

interface SeriesPdfReportProps {
  series: SeriesPdfData;
  jobName: string;
  chartImage: string | null;
  forecasts: ForecastPoint[];
  generatedAt: Date;
}

export function SeriesPdfReport({
  series,
  jobName,
  chartImage,
  forecasts,
  generatedAt,
}: SeriesPdfReportProps) {
  const getSmapeStyle = (smape: number) => {
    if (smape < 8) return styles.metricValueGood;
    if (smape < 15) return styles.metricValueWarning;
    return styles.metricValueBad;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const cvValue = series.cv ?? 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.logo}>LumenIQ</Text>
          <Text style={styles.date}>Généré le {formatDate(generatedAt)}</Text>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{series.series_id}</Text>
          <View style={styles.badgeRow}>
            <Text style={[styles.badge, styles.badgeABC]}>
              {series.abc_class}
            </Text>
            <Text style={[styles.badge, styles.badgeXYZ]}>
              {series.xyz_class}
            </Text>
            {series.was_gated && (
              <Text
                style={[
                  styles.badge,
                  {
                    backgroundColor: "rgba(34, 197, 94, 0.2)",
                    color: "#22c55e",
                  },
                ]}
              >
                Automatisée
              </Text>
            )}
          </View>
          <Text style={styles.subtitle}>Analyse : {jobName}</Text>
        </View>

        {/* Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Métriques clés</Text>
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Écart prévision</Text>
              <Text style={[styles.metricValue, getSmapeStyle(series.smape)]}>
                {series.smape.toFixed(1)}%
              </Text>
              <Text style={styles.metricSubtext}>Précision symétrique</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Méthode retenue</Text>
              <Text style={[styles.metricValue, { fontSize: 14 }]}>
                {series.champion_model}
              </Text>
              <Text style={styles.metricSubtext}>Meilleur algorithme</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Variabilité</Text>
              <Text style={styles.metricValue}>
                {cvValue.toFixed(2)}
              </Text>
              <Text style={styles.metricSubtext}>
                {cvValue < 0.5 ? "Stable" : cvValue < 1 ? "Modéré" : "Volatile"}
              </Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Horizon</Text>
              <Text style={styles.metricValue}>{series.horizon}</Text>
              <Text style={styles.metricSubtext}>Périodes</Text>
            </View>
          </View>
        </View>

        {/* Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Historique & Prévisions</Text>
          {chartImage ? (
            <View>
              {/* @react-pdf/renderer Image has no alt prop */}
              <Image style={styles.chartImage} src={chartImage} />
            </View>
          ) : (
            <View style={styles.chartPlaceholder}>
              <Text style={{ color: "#666" }}>Graphique non disponible</Text>
            </View>
          )}
        </View>

        {/* Forecast Table */}
        <View style={styles.tableSection}>
          <Text style={styles.sectionTitle}>Prévisions détaillées</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Date</Text>
              <Text style={styles.tableHeaderCell}>Prévision</Text>
              <Text style={styles.tableHeaderCell}>Borne basse (10%)</Text>
              <Text style={styles.tableHeaderCell}>Borne haute (90%)</Text>
            </View>
            {forecasts.slice(0, 12).map((row, index) => (
              <View
                key={row.date}
                style={[
                  styles.tableRow,
                  index % 2 === 1 ? styles.tableRowAlt : {},
                ]}
              >
                <Text style={styles.tableCell}>{row.date}</Text>
                <Text style={styles.tableCell}>{row.forecast.toFixed(1)}</Text>
                <Text style={styles.tableCell}>
                  {row.lower != null ? row.lower.toFixed(1) : "—"}
                </Text>
                <Text style={styles.tableCell}>
                  {row.upper != null ? row.upper.toFixed(1) : "—"}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Rapport généré automatiquement • Données au{" "}
            {formatDate(generatedAt)}
          </Text>
          <Text style={styles.footerBrand}>lumeniq.io</Text>
        </View>
      </Page>
    </Document>
  );
}
