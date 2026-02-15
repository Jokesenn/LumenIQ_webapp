"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Svg,
  Polygon,
} from "@react-pdf/renderer";
import type { SeriesPdfData, ForecastPoint } from "@/types/export";
import { getModelMeta, getFamilyMeta } from "@/lib/model-labels";

/* ─── Font registration (Manrope + Syne — local WOFF files served by Next.js) ─── */

Font.register({
  family: "Manrope",
  fonts: [
    { src: "/fonts/Manrope-400.woff", fontWeight: 400 },
    { src: "/fonts/Manrope-500.woff", fontWeight: 500 },
    { src: "/fonts/Manrope-600.woff", fontWeight: 600 },
    { src: "/fonts/Manrope-700.woff", fontWeight: 700 },
    { src: "/fonts/Manrope-800.woff", fontWeight: 800 },
  ],
});

Font.register({
  family: "Syne",
  fonts: [
    { src: "/fonts/Syne-700.woff", fontWeight: 700 },
    { src: "/fonts/Syne-800.woff", fontWeight: 800 },
  ],
});

/* ─── Brand palette (mode light — charte graphique) ─── */
const B = {
  white: "#FFFFFF",
  bgCard: "#F8F9FC",
  bgSurface: "#EEF0F5",
  accent: "#4F5BD5",
  accentHover: "#3D49B8",
  textPrimary: "#0B1020",
  textSecondary: "#4A5068",
  textMuted: "#7A8098",
  border: "#D0D4E0",
  borderLight: "#E8EAF0",
  success: "#10B981",
  successBg: "#ecfdf5",
  successBorder: "#a7f3d0",
  alert: "#F59E0B",
  alertBg: "#fffbeb",
  alertBorder: "#fde68a",
  error: "#EF4444",
  errorBg: "#fef2f2",
  errorBorder: "#fecaca",
  info: "#3B82F6",
  infoBg: "#eff6ff",
  infoBorder: "#bfdbfe",
  logoIndigo: "#6366f1",
};

/* ─── Styles ─── */
const s = StyleSheet.create({
  page: {
    padding: 40,
    paddingTop: 0,
    fontFamily: "Manrope",
    backgroundColor: B.white,
    color: B.textPrimary,
    fontSize: 10,
  },
  brandBar: {
    height: 5,
    backgroundColor: B.accent,
    marginHorizontal: -40,
  },

  /* Header */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: B.border,
    marginBottom: 22,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoText: {
    fontFamily: "Syne",
    fontSize: 18,
    fontWeight: 800,
    color: B.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerDate: {
    fontSize: 9,
    color: B.textMuted,
    fontWeight: 500,
  },
  headerLabel: {
    fontSize: 8,
    color: B.textMuted,
    marginTop: 2,
  },

  /* Title section */
  titleSection: {
    marginBottom: 22,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  title: {
    fontFamily: "Syne",
    fontSize: 26,
    fontWeight: 800,
    color: B.textPrimary,
    letterSpacing: -1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 9,
    fontWeight: 700,
    borderWidth: 1,
  },
  badgeGated: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 8,
    fontWeight: 600,
    backgroundColor: B.successBg,
    color: B.success,
    borderWidth: 1,
    borderColor: B.successBorder,
  },
  subtitle: {
    fontSize: 10,
    color: B.textSecondary,
    fontWeight: 500,
  },

  /* Section title */
  sectionTitle: {
    fontFamily: "Syne",
    fontSize: 13,
    fontWeight: 700,
    color: B.textPrimary,
    marginBottom: 10,
    letterSpacing: -0.3,
  },

  /* Metrics grid */
  metricsSection: {
    marginBottom: 22,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: B.bgCard,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: B.border,
  },
  metricLabel: {
    fontSize: 7.5,
    color: B.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 5,
    fontWeight: 600,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 800,
    marginBottom: 3,
  },
  metricSubtext: {
    fontSize: 8,
    color: B.textSecondary,
    fontWeight: 500,
  },

  /* Chart */
  chartSection: {
    marginBottom: 22,
  },
  chartContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2a2a30",
    overflow: "hidden",
    backgroundColor: "#0B1020",
  },
  chartImage: {
    width: "100%",
    height: 230,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 8,
    backgroundColor: "#0D1428",
    borderTopWidth: 1,
    borderTopColor: "#1a1f35",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 7.5,
    color: "#A0A8C0",
    fontWeight: 500,
  },
  chartPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: B.bgCard,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: B.border,
  },

  /* Model card */
  modelSection: {
    marginBottom: 20,
  },
  modelCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: B.bgCard,
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: B.border,
  },
  modelIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modelIconText: {
    fontSize: 16,
    fontWeight: 800,
    color: B.white,
  },
  modelInfo: {
    flex: 1,
  },
  modelName: {
    fontFamily: "Syne",
    fontSize: 12,
    fontWeight: 700,
    color: B.textPrimary,
    marginBottom: 2,
  },
  modelFamily: {
    fontSize: 9,
    color: B.textSecondary,
    fontWeight: 500,
  },
  modelScore: {
    alignItems: "flex-end",
  },
  modelScoreValue: {
    fontSize: 18,
    fontWeight: 800,
  },
  modelScoreLabel: {
    fontSize: 8,
    color: B.textMuted,
    fontWeight: 500,
  },

  /* Table */
  tableSection: {
    marginBottom: 20,
  },
  table: {
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: B.border,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: B.bgSurface,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: B.border,
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 7.5,
    fontWeight: 700,
    color: B.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 7,
    paddingHorizontal: 14,
  },
  tableRowAlt: {
    backgroundColor: B.bgCard,
  },
  tableCell: {
    flex: 1,
    fontSize: 9,
    color: B.textPrimary,
    fontWeight: 500,
  },
  tableCellRight: {
    flex: 1,
    fontSize: 9,
    color: B.textPrimary,
    textAlign: "right",
    fontWeight: 600,
  },

  /* Footer */
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: B.border,
  },
  footerText: {
    fontSize: 7.5,
    color: B.textMuted,
    fontWeight: 500,
  },
  footerBrand: {
    fontFamily: "Syne",
    fontSize: 8,
    fontWeight: 700,
    color: B.accent,
  },
  footerPage: {
    fontSize: 7.5,
    color: B.textMuted,
    fontWeight: 500,
  },
});

/* ─── Logo component (hexagons from brand guide) ─── */

function PdfLogo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      {/* Outer hexagon — stroke only */}
      <Polygon
        points="50,5 93.3,27.5 93.3,72.5 50,95 6.7,72.5 6.7,27.5"
        stroke={B.logoIndigo}
        strokeWidth={5}
        strokeLinejoin="round"
        opacity={0.8}
      />
      {/* Mid hexagon — translucent fill */}
      <Polygon
        points="50,20 78.7,35 78.7,65 50,80 21.3,65 21.3,35"
        fill={B.logoIndigo}
        opacity={0.15}
      />
      {/* Inner hexagon — solid */}
      <Polygon
        points="50,35 64.4,42.5 64.4,57.5 50,65 35.6,57.5 35.6,42.5"
        fill={B.logoIndigo}
      />
    </Svg>
  );
}

/* ─── Helpers ─── */

function getScoreStyle(score: number) {
  if (score >= 90) return { color: B.success, bg: B.successBg, border: B.successBorder };
  if (score >= 70) return { color: B.alert, bg: B.alertBg, border: B.alertBorder };
  return { color: B.error, bg: B.errorBg, border: B.errorBorder };
}

function getScoreLabel(score: number) {
  if (score >= 90) return "Excellent";
  if (score >= 70) return "Acceptable";
  return "A ameliorer";
}

function getCvLabel(cv: number) {
  if (cv < 0.5) return "Stable";
  if (cv < 1) return "Modere";
  return "Volatile";
}

function getAbcStyle(cls: string) {
  if (cls === "A") return { backgroundColor: B.successBg, color: B.success, borderColor: B.successBorder };
  if (cls === "B") return { backgroundColor: B.alertBg, color: B.alert, borderColor: B.alertBorder };
  return { backgroundColor: B.errorBg, color: B.error, borderColor: B.errorBorder };
}

function getXyzStyle(cls: string) {
  if (cls === "X") return { backgroundColor: B.infoBg, color: B.info, borderColor: B.infoBorder };
  if (cls === "Y") return { backgroundColor: B.alertBg, color: B.alert, borderColor: B.alertBorder };
  return { backgroundColor: B.errorBg, color: B.error, borderColor: B.errorBorder };
}

function fmtNum(n: number): string {
  // @react-pdf runs in browser context, toLocaleString works
  return n.toLocaleString("fr-FR", { maximumFractionDigits: 1, minimumFractionDigits: 1 });
}

function fmtDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

/* ─── Props ─── */

interface SeriesPdfReportProps {
  series: SeriesPdfData;
  jobName: string;
  chartImage: string | null;
  forecasts: ForecastPoint[];
  generatedAt: Date;
}

/* ─── Main component ─── */

export function SeriesPdfReport({
  series,
  jobName,
  chartImage,
  forecasts,
  generatedAt,
}: SeriesPdfReportProps) {
  const modelMeta = getModelMeta(series.champion_model);
  const familyMeta = getFamilyMeta(series.champion_model);
  const scoreValue = series.champion_score ?? (series.wape != null ? (100 - series.wape) : 0);
  const scoreStyle = getScoreStyle(scoreValue);
  const cvValue = series.cv ?? 0;
  const totalPages = forecasts.length > 0 ? 2 : 1;

  const PageFooter = ({ pageNum }: { pageNum: number }) => (
    <View style={s.footer}>
      <Text style={s.footerText}>
        Rapport genere automatiquement le {fmtDate(generatedAt)}
      </Text>
      <Text style={s.footerPage}>{pageNum} / {totalPages}</Text>
      <Text style={s.footerBrand}>lumeniq.fr</Text>
    </View>
  );

  return (
    <Document>
      {/* ════════════ PAGE 1 — Synthese ════════════ */}
      <Page size="A4" style={s.page}>
        <View style={s.brandBar} />

        {/* Header with logo */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <PdfLogo size={26} />
            <Text style={s.logoText}>LumenIQ</Text>
          </View>
          <View style={s.headerRight}>
            <Text style={s.headerDate}>{fmtDate(generatedAt)}</Text>
            <Text style={s.headerLabel}>Rapport de serie</Text>
          </View>
        </View>

        {/* Title + badges */}
        <View style={s.titleSection}>
          <View style={s.titleRow}>
            <Text style={s.title}>{series.series_id}</Text>
            <Text style={[s.badge, getAbcStyle(series.abc_class)]}>{series.abc_class}</Text>
            <Text style={[s.badge, getXyzStyle(series.xyz_class)]}>{series.xyz_class}</Text>
            {series.was_gated && <Text style={s.badgeGated}>Previsions stables</Text>}
          </View>
          <Text style={s.subtitle}>Analyse : {jobName}</Text>
        </View>

        {/* Metrics */}
        <View style={s.metricsSection}>
          <Text style={s.sectionTitle}>Metriques cles</Text>
          <View style={s.metricsGrid}>
            <View style={[s.metricCard, { borderColor: scoreStyle.border, backgroundColor: scoreStyle.bg }]}>
              <Text style={s.metricLabel}>Score de fiabilite</Text>
              <Text style={[s.metricValue, { color: scoreStyle.color }]}>
                {scoreValue.toFixed(1)}
              </Text>
              <Text style={s.metricSubtext}>/100 · {getScoreLabel(scoreValue)}</Text>
            </View>

            <View style={s.metricCard}>
              <Text style={s.metricLabel}>Methode retenue</Text>
              <Text style={[s.metricValue, { fontSize: 13, color: B.textPrimary }]}>
                {modelMeta.label}
              </Text>
              <Text style={s.metricSubtext}>{modelMeta.family}</Text>
            </View>

            <View style={s.metricCard}>
              <Text style={s.metricLabel}>Variabilite</Text>
              <Text style={[s.metricValue, { color: B.textPrimary }]}>
                {cvValue.toFixed(2)}
              </Text>
              <Text style={s.metricSubtext}>{getCvLabel(cvValue)}</Text>
            </View>

            <View style={s.metricCard}>
              <Text style={s.metricLabel}>Horizon</Text>
              <Text style={[s.metricValue, { color: B.textPrimary }]}>{series.horizon}</Text>
              <Text style={s.metricSubtext}>Periodes</Text>
            </View>
          </View>
        </View>

        {/* Chart — only shown if capture succeeded */}
        {chartImage && (
          <View style={s.chartSection}>
            <Text style={s.sectionTitle}>Historique & Previsions</Text>
            <View style={s.chartContainer}>
              <Image style={s.chartImage} src={chartImage} />
              <View style={s.chartLegend}>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: "#6366f1" }]} />
                  <Text style={s.legendText}>Reel</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: "#8b5cf6" }]} />
                  <Text style={s.legendText}>Prevision</Text>
                </View>
                <View style={s.legendItem}>
                  <View style={[s.legendDot, { backgroundColor: "#8b5cf6", opacity: 0.3 }]} />
                  <Text style={s.legendText}>Intervalle de confiance</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Champion model card */}
        <View style={s.modelSection}>
          <Text style={s.sectionTitle}>Modele champion</Text>
          <View style={s.modelCard}>
            <View style={[s.modelIcon, { backgroundColor: familyMeta.hex }]}>
              <Text style={s.modelIconText}>
                {modelMeta.label.charAt(0).toUpperCase()}
              </Text>
            </View>
            <View style={s.modelInfo}>
              <Text style={s.modelName}>{modelMeta.label}</Text>
              <Text style={s.modelFamily}>{modelMeta.family}</Text>
            </View>
            <View style={s.modelScore}>
              <Text style={[s.modelScoreValue, { color: scoreStyle.color }]}>
                {scoreValue.toFixed(1)}
              </Text>
              <Text style={s.modelScoreLabel}>/100</Text>
            </View>
          </View>
        </View>

        <PageFooter pageNum={1} />
      </Page>

      {/* ════════════ PAGE 2 — Previsions detaillees ════════════ */}
      {forecasts.length > 0 && (
        <Page size="A4" style={s.page}>
          <View style={s.brandBar} />

          {/* Compact header */}
          <View style={[s.header, { paddingTop: 16, paddingBottom: 10, marginBottom: 16 }]}>
            <View style={s.headerLeft}>
              <PdfLogo size={20} />
              <Text style={[s.logoText, { fontSize: 13 }]}>LumenIQ</Text>
              <Text style={{ fontSize: 10, color: B.textMuted, fontWeight: 500 }}>·</Text>
              <Text style={{ fontSize: 10, color: B.textSecondary, fontWeight: 600 }}>
                {series.series_id}
              </Text>
            </View>
            <Text style={s.headerDate}>{fmtDate(generatedAt)}</Text>
          </View>

          {/* Full table */}
          <View style={s.tableSection}>
            <Text style={s.sectionTitle}>
              Previsions detaillees ({forecasts.length} periodes)
            </Text>
            <View style={s.table}>
              <View style={s.tableHeader}>
                <Text style={s.tableHeaderCell}>Date</Text>
                <Text style={[s.tableHeaderCell, { textAlign: "right" }]}>Prevision</Text>
                <Text style={[s.tableHeaderCell, { textAlign: "right" }]}>Borne basse (10%)</Text>
                <Text style={[s.tableHeaderCell, { textAlign: "right" }]}>Borne haute (90%)</Text>
              </View>
              {forecasts.map((row, index) => (
                <View
                  key={row.date}
                  style={[s.tableRow, index % 2 === 1 ? s.tableRowAlt : {}]}
                >
                  <Text style={s.tableCell}>{row.date}</Text>
                  <Text style={s.tableCellRight}>{fmtNum(row.forecast)}</Text>
                  <Text style={s.tableCellRight}>
                    {row.lower != null ? fmtNum(row.lower) : "\u2014"}
                  </Text>
                  <Text style={s.tableCellRight}>
                    {row.upper != null ? fmtNum(row.upper) : "\u2014"}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Summary line */}
          {series.total_value != null && series.total_value > 0 && (
            <View style={{ flexDirection: "row", gap: 20, marginTop: 6, paddingHorizontal: 4 }}>
              <Text style={{ fontSize: 9, color: B.textSecondary, fontWeight: 600 }}>
                Total prevu : {series.total_value.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} unites
              </Text>
              <Text style={{ fontSize: 9, color: B.textSecondary, fontWeight: 500 }}>
                Erreur ponderee (WAPE) : {(series.wape ?? series.smape).toFixed(1)}%
              </Text>
            </View>
          )}

          <PageFooter pageNum={2} />
        </Page>
      )}
    </Document>
  );
}
