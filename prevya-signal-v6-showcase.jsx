import { useState } from "react";

// ─── Signal V6 Design Tokens ───
const T = {
  bg: "#FAFAF9",
  card: "#FFFFFF",
  surface: "#F3F3F0",
  border: "#E5E5E0",
  copper: "#B45309",
  copperHover: "#9A4408",
  copperDark: "#92400E",
  copperBg: "#FEF3E2",
  copperBgSoft: "#FFFBF5",
  text: "#141414",
  textSec: "#5C5C58",
  textTri: "#8A8A82",
  success: "#15803D",
  successBg: "#F0FDF4",
  warning: "#A16207",
  warningBg: "#FEFCE8",
  error: "#B91C1C",
  errorBg: "#FEF2F2",
  chartActual: "#141414",
  chartForecast: "#B45309",
  chartGrid: "#EEEEE8",
};

// ─── Grain SVG texture ───
const grainSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)' opacity='0.015'/%3E%3C/svg%3E")`;

// ─── Dot grid pattern ───
const dotGridSvg = `url("data:image/svg+xml,%3Csvg width='16' height='16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='0.6' fill='%238A8A82' opacity='0.35'/%3E%3C/svg%3E")`;

// ─── Logo Ascension SVG ───
function LogoAscension({ size = 32, dark = false }) {
  const curveColor = dark ? "#ECECEC" : "#141414";
  const anchorColor = dark ? "#ECECEC" : "#141414";
  return (
    <svg viewBox="0 0 32 32" fill="none" width={size} height={size}>
      <rect x="13.5" y="3" width="3" height="26" rx="1.5" fill={T.copper} />
      <path
        d="M4 27C6 23 9 17 12 13L15 9"
        stroke={curveColor}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="15" y1="9" x2="27" y2="4" stroke={T.copper} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="4" cy="27" r="2" fill={anchorColor} />
    </svg>
  );
}

// ─── Section Marker ───
function SectionMarker() {
  return <div style={{ width: 12, height: 2, background: T.copper, borderRadius: 1, marginBottom: 8 }} />;
}

// ─── Color Swatch ───
function Swatch({ name, hex, usage, wcag, ratio }) {
  const isLight = ["#FAFAF9", "#FFFFFF", "#F3F3F0", "#E5E5E0", "#FEF3E2", "#FFFBF5", "#F0FDF4", "#FEFCE8", "#FEF2F2"].includes(hex);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 6,
          background: hex,
          border: isLight ? `1px solid ${T.border}` : "none",
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: T.text }}>{hex}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{name}</span>
        </div>
        <div style={{ fontSize: 11, color: T.textSec, marginTop: 1 }}>{usage}</div>
      </div>
      {wcag && (
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9,
            fontWeight: 600,
            letterSpacing: "0.05em",
            padding: "2px 6px",
            borderRadius: 4,
            background: wcag === "AAA" ? T.successBg : wcag === "AA" ? T.copperBg : T.warningBg,
            color: wcag === "AAA" ? T.success : wcag === "AA" ? T.copperDark : T.warning,
          }}
        >
          {wcag} {ratio}
        </div>
      )}
    </div>
  );
}

// ─── Badge ───
function Badge({ variant, children }) {
  const styles = {
    urgent: { bg: "rgba(185,28,28,0.07)", color: T.error },
    warning: { bg: "rgba(161,98,7,0.07)", color: T.warning },
    copper: { bg: "rgba(180,83,9,0.07)", color: T.copper },
    stable: { bg: "rgba(21,128,61,0.07)", color: T.success },
  };
  const s = styles[variant];
  return (
    <span
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 4,
        background: s.bg,
        color: s.color,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

// ─── Mini sparkline ───
function Sparkline({ data, width = 80, height = 24, color = T.copper }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * width} cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2} r="2" fill={color} />
    </svg>
  );
}

// ─── Chart with Signal conventions ───
function SignalChart() {
  const actual = [42, 38, 45, 51, 48, 55, 61, 58, 63, 67, 64, 70];
  const forecast = [null, null, null, null, null, null, null, null, null, null, null, 70, 74, 78, 82, 85];
  const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr"];

  const w = 520, h = 180, px = 40, py = 16;
  const allVals = [...actual, ...forecast.filter(Boolean)];
  const maxV = Math.max(...allVals);
  const minV = Math.min(...allVals);
  const range = maxV - minV || 1;

  const toX = (i) => px + (i / (months.length - 1)) * (w - px * 2);
  const toY = (v) => py + (1 - (v - minV) / range) * (h - py * 2.5);

  const refIdx = 11;
  const refX = toX(refIdx);

  const actualPath = actual.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");
  const forecastPts = forecast.map((v, i) => v != null ? { x: toX(i), y: toY(v) } : null).filter(Boolean);
  const forecastPath = forecastPts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" style={{ display: "block" }}>
      {/* Dot grid in forecast zone */}
      <defs>
        <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="0.5" fill={T.textTri} opacity="0.35" />
        </pattern>
      </defs>
      <rect x={refX} y={py} width={w - px - refX} height={h - py * 2.5} fill="url(#dots)" />

      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const y = py + pct * (h - py * 2.5);
        return <line key={i} x1={px} y1={y} x2={w - px} y2={y} stroke={T.chartGrid} strokeWidth="0.5" />;
      })}

      {/* Reference line — Brand Device #1 */}
      <line x1={refX} y1={py - 4} x2={refX} y2={h - py} stroke={T.copper} strokeWidth="2" />
      <text x={refX} y={h - 4} textAnchor="middle" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 8, fontWeight: 600, letterSpacing: "0.08em", fill: T.copper }}>
        RÉFÉRENCE
      </text>

      {/* Actual line */}
      <path d={actualPath} fill="none" stroke={T.chartActual} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Forecast line */}
      <path d={forecastPath} fill="none" stroke={T.chartForecast} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 3" />

      {/* Pulse — Brand Device #5 */}
      <circle cx={toX(11)} cy={toY(70)} r="5" fill={T.copper} opacity="0.12" />
      <circle cx={toX(11)} cy={toY(70)} r="3" fill={T.copper} />

      {/* Month labels */}
      {months.map((m, i) => i % 2 === 0 && (
        <text key={i} x={toX(i)} y={h - py + 12} textAnchor="middle" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: T.textTri }}>
          {m}
        </text>
      ))}
    </svg>
  );
}

// ─── Main Component ───
export default function SignalV6Showcase() {
  const [activeNav, setActiveNav] = useState("Tableau de bord");
  const navItems = ["Tableau de bord", "Prévisions", "Actions", "Modèles"];

  return (
    <div
      style={{
        fontFamily: "'Satoshi', system-ui, -apple-system, sans-serif",
        background: T.bg,
        backgroundImage: grainSvg,
        backgroundSize: "200px 200px",
        color: T.text,
        minHeight: "100vh",
        lineHeight: 1.5,
      }}
    >
      {/* ─── Load fonts ─── */}
      <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ═══════════════════════════════════════════ */}
      {/* HEADER */}
      {/* ═══════════════════════════════════════════ */}
      <header
        style={{
          maxWidth: 840,
          margin: "0 auto",
          padding: "48px 32px 40px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <LogoAscension size={36} />
          <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: "-0.03em", color: T.text }}>
            Prevya
          </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginLeft: 8, padding: "2px 8px", background: T.surface, borderRadius: 4 }}>
            Signal V6
          </span>
        </div>

        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: "-0.03em", color: T.copper, margin: "0 0 8px", lineHeight: 1.1 }}>
          Charte graphique
        </h1>
        <p style={{ fontSize: 13, color: T.textSec, maxWidth: 500, margin: 0 }}>
          Système d'identité visuelle pour la plateforme de prévision de ventes. Précision, clarté, confiance — sans compromis sur l'accessibilité.
        </p>
      </header>

      <div style={{ maxWidth: 840, margin: "0 auto", padding: "0 32px 64px" }}>

        {/* ═══════════════════════════════════════════ */}
        {/* 1. LOGO ASCENSION */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
            Logo « Ascension »
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Light variant */}
            <div
              style={{
                background: T.bg,
                border: `1px solid ${T.border}`,
                borderRadius: 8,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}
            >
              <LogoAscension size={64} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LogoAscension size={36} />
                <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em" }}>Prevya</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <LogoAscension size={24} />
                <LogoAscension size={20} />
                <LogoAscension size={16} />
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>Fond clair</span>
            </div>

            {/* Dark variant */}
            <div
              style={{
                background: T.text,
                border: `1px solid ${T.text}`,
                borderRadius: 8,
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <LogoAscension size={64} dark />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <LogoAscension size={36} dark />
                <span style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.03em", color: "#ECECEC" }}>Prevya</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <LogoAscension size={24} dark />
                <LogoAscension size={20} dark />
                <LogoAscension size={16} dark />
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: "#8A8A82", letterSpacing: "0.05em", textTransform: "uppercase" }}>Fond sombre</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* 2. PALETTE DE COULEURS */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
            Palette de couleurs — audit WCAG
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {/* Main colors */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>Couleurs principales</div>
              <Swatch name="Background" hex="#FAFAF9" usage="Fond principal" />
              <Swatch name="Card" hex="#FFFFFF" usage="Cartes, panels" />
              <Swatch name="Surface" hex="#F3F3F0" usage="Hover, sections" />
              <Swatch name="Border" hex="#E5E5E0" usage="Bordures" />
              <Swatch name="Text" hex="#141414" usage="Texte principal" wcag="AAA" ratio="17.64:1" />
              <Swatch name="Text sec." hex="#5C5C58" usage="Texte secondaire" wcag="AA" ratio="6.43:1" />
              <Swatch name="Text tert." hex="#8A8A82" usage="Captions ≥18px" wcag="AA-lg" ratio="3.33:1" />
            </div>

            {/* Copper & semantic */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px 20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 12 }}>Accent & sémantique</div>
              <Swatch name="Copper" hex="#B45309" usage="Accent principal" wcag="AA" ratio="4.81:1" />
              <Swatch name="Copper hover" hex="#9A4408" usage="Hover, active" wcag="AA+" ratio="6.27:1" />
              <Swatch name="Copper dark" hex="#92400E" usage="Haut contraste" wcag="AAA" ratio="7.09:1" />
              <Swatch name="Copper BG" hex="#FEF3E2" usage="Fond accentué" />
              <Swatch name="Success" hex="#15803D" usage="Validations" wcag="AA" ratio="4.79:1" />
              <Swatch name="Warning" hex="#A16207" usage="Alertes" wcag="AA" ratio="4.76:1" />
              <Swatch name="Error" hex="#B91C1C" usage="Erreurs" wcag="AA" ratio="5.91:1" />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* 3. TYPOGRAPHIE */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
            Typographie
          </h2>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "32px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            {/* Hero metric */}
            <div style={{ marginBottom: 24, paddingBottom: 24, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>Hero metric — Satoshi 700, 48px</span>
              <div style={{ fontSize: 48, fontWeight: 700, color: T.copper, letterSpacing: "-0.03em", marginTop: 4 }}>87.3%</div>
            </div>

            {/* H1 */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>H1 — Satoshi 700, 22px</span>
              <div style={{ fontSize: 22, fontWeight: 700, color: T.text, letterSpacing: "-0.03em", marginTop: 4 }}>Tableau de bord</div>
            </div>

            {/* H2 with section marker */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>H2 — Satoshi 600, 13px + section marker</span>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                <div style={{ width: 12, height: 2, background: T.copper, borderRadius: 1 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Résultats de la dernière mise à jour</span>
              </div>
            </div>

            {/* Body */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>Body — Satoshi 400, 13px</span>
              <div style={{ fontSize: 13, color: T.textSec, marginTop: 4, maxWidth: 440, lineHeight: 1.6 }}>
                Vos prévisions ont été mises à jour avec succès. Le score de fiabilité global est en hausse de 3 points par rapport à la dernière mise à jour.
              </div>
            </div>

            {/* KPI value */}
            <div style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>KPI — Satoshi 700, 24px cuivre</span>
              <div style={{ fontSize: 24, fontWeight: 700, color: T.copper, letterSpacing: "-0.03em", marginTop: 4 }}>€127,450</div>
            </div>

            {/* Mono data */}
            <div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase" }}>Mono data — IBM Plex Mono 500, 11px</span>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 500, color: T.text, marginTop: 4 }}>
                WAPE: 12.4% — MASE: 0.83 — Biais: +2.1%
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* 4. LES 5 BRAND DEVICES */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
            Les 5 brand devices
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            {/* 1. Horizon Line */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.copper, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>01 — Horizon line</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 3, height: 28, background: T.copper, borderRadius: 1.5 }} />
                <span style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.03em" }}>Prévisions</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>Barre cuivre 2-3px. Charts, titres, cards actives, nav.</div>
            </div>

            {/* 2. Copper Numerals */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.copper, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>02 — Copper numerals</div>
              <div style={{ fontSize: 28, fontWeight: 700, color: T.copper, letterSpacing: "-0.03em", marginBottom: 4 }}>94.2%</div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>Chiffres-clés toujours en cuivre. Jamais pour le texte narratif.</div>
            </div>

            {/* 3. Section Markers */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.copper, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>03 — Section markers</div>
              <div style={{ marginBottom: 4 }}>
                <div style={{ width: 12, height: 2, background: T.copper, borderRadius: 1, marginBottom: 6 }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>Résumé exécutif</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5, marginTop: 6 }}>Trait 12×2px avant chaque titre H2.</div>
            </div>

            {/* 4. Dot Grid */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.copper, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>04 — Dot grid</div>
              <div style={{ width: "100%", height: 48, borderRadius: 4, backgroundImage: dotGridSvg, backgroundSize: "16px 16px", border: `1px dashed ${T.border}`, marginBottom: 4 }} />
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>Points 16px, r=0.6, 35% opacity. Zones forecast.</div>
            </div>

            {/* 5. Pulse */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.copper, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>05 — Pulse</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="12" fill={T.copper} opacity="0.12" />
                  <circle cx="20" cy="20" r="6" fill={T.copper} />
                </svg>
                <span style={{ fontSize: 11, color: T.textSec }}>« Vous êtes ici »</span>
              </div>
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>Dot r=3 + halo r=5 à 12%. Dernier point réel.</div>
            </div>

            {/* Grain texture */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.copper, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Bonus — Grain texture</div>
              <div style={{ width: "100%", height: 48, borderRadius: 4, background: T.bg, backgroundImage: grainSvg, backgroundSize: "200px", border: `1px solid ${T.border}`, marginBottom: 4 }} />
              <div style={{ fontSize: 11, color: T.textSec, lineHeight: 1.5 }}>SVG feTurbulence, opacity 0.015. Fond principal.</div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* 5. COMPOSANTS UI */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
            Composants UI
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Buttons */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>Boutons</div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button style={{ padding: "11px 24px", borderRadius: 6, border: "none", background: T.copper, color: "#fff", fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer", boxShadow: "0 1px 3px rgba(180,83,9,0.15)" }}>
                  Lancer une prévision
                </button>
                <button style={{ padding: "11px 24px", borderRadius: 6, border: `1.5px solid ${T.copper}`, background: "transparent", color: T.copper, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                  Exporter PDF
                </button>
                <button style={{ padding: "11px 24px", borderRadius: 6, border: `1px solid ${T.border}`, background: "transparent", color: T.textSec, fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
                  Annuler
                </button>
              </div>
            </div>

            {/* Badges */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>Badges de statut</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge variant="urgent">Rupture</Badge>
                <Badge variant="warning">Surstock</Badge>
                <Badge variant="copper">Révision</Badge>
                <Badge variant="stable">Stable</Badge>
              </div>
            </div>

            {/* Navigation */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>Navigation</div>
              <div style={{ display: "flex", gap: 20 }}>
                {navItems.map((item) => (
                  <div
                    key={item}
                    onClick={() => setActiveNav(item)}
                    style={{
                      fontSize: 13,
                      fontWeight: activeNav === item ? 600 : 400,
                      color: activeNav === item ? T.text : T.textSec,
                      cursor: "pointer",
                      paddingBottom: 6,
                      borderBottom: activeNav === item ? `2px solid ${T.copper}` : "2px solid transparent",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Card accent */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.copper}`, borderRadius: 8, padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fontWeight: 600, color: T.textTri, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 8 }}>Card accentuée</div>
              <div style={{ fontSize: 11, color: T.textSec, marginBottom: 4 }}>Score de fiabilité global</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: T.copper, letterSpacing: "-0.03em" }}>87.3%</div>
              <Sparkline data={[72, 75, 74, 78, 80, 83, 82, 85, 84, 87]} width={120} height={24} />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* 6. CHART SIGNAL */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
            Chart — conventions Signal
          </h2>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "24px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: T.textSec, marginBottom: 2 }}>Chiffre d'affaires prévisionnel</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: T.copper, letterSpacing: "-0.03em" }}>€847,200</div>
              </div>
              <div style={{ display: "flex", gap: 16, fontSize: 11, color: T.textSec }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 12, height: 2, background: T.chartActual, borderRadius: 1 }} />
                  Réalisé
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 12, height: 2, background: T.chartForecast, borderRadius: 1, borderTop: "1px dashed transparent" }} />
                  Prévision
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <svg width="8" height="8"><circle cx="4" cy="4" r="3" fill={T.copper} /><circle cx="4" cy="4" r="4" fill={T.copper} opacity="0.15" /></svg>
                  Pulse
                </div>
              </div>
            </div>
            <SignalChart />
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* 7. VOCABULAIRE DE MARQUE */}
        {/* ═══════════════════════════════════════════ */}
        <section style={{ marginBottom: 56 }}>
          <SectionMarker />
          <h2 style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 20px" }}>
            Vocabulaire de marque
          </h2>

          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            {[
              ["Run / dernier run", "Mise à jour"],
              ["WAPE / MAPE", "Score de fiabilité"],
              ["Modèle statistique", "Méthode de calcul"],
              ["AUJOURD'HUI", "RÉFÉRENCE"],
              ["Forecast / prédiction", "Prévision"],
              ["Champion model", "Meilleure méthode"],
              ["Tournament", "Sélection automatique"],
              ["Backtest", "Validation historique"],
            ].map(([avoid, use], i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  borderBottom: i < 7 ? `1px solid ${T.border}` : "none",
                  fontSize: 12,
                }}
              >
                <div style={{ padding: "10px 20px", color: T.textTri, textDecoration: "line-through", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                  {avoid}
                </div>
                <div style={{ padding: "10px 20px", color: T.copperDark, fontWeight: 500, background: i % 2 === 0 ? T.copperBgSoft : "transparent" }}>
                  {use}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════ */}
        {/* FOOTER */}
        {/* ═══════════════════════════════════════════ */}
        <footer style={{ textAlign: "center", padding: "32px 0", borderTop: `1px solid ${T.border}` }}>
          <LogoAscension size={20} />
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 8 }}>
            Prevya — Signal V6 — Mars 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
