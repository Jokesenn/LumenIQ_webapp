import { useState } from "react";

const FONT_URLS = [
  "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap",
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&display=swap",
];

const T = {
  // Colors
  bg: "#FAFAF9", card: "#FFFFFF", surface: "#F3F3F0",
  border: "#E5E5E0", borderMed: "#D0D0C8",
  copper: "#B45309", copperHover: "#9A4408", copperDark: "#92400E",
  copperBg: "#FEF3E2", copperBgSoft: "#FFFBF5",
  text: "#141414", textSec: "#5C5C58", textTri: "#8A8A82",
  success: "#15803D", successBg: "#F0FDF4",
  warning: "#A16207", warningBg: "#FEFCE8",
  error: "#B91C1C", errorBg: "#FEF2F2",
  chartActual: "#141414", chartForecast: "#B45309", chartGrid: "#EEEEE8",
  // Fonts
  display: "'Satoshi', sans-serif",
  body: "'Satoshi', sans-serif",
  mono: "'IBM Plex Mono', monospace",
};

function Logo({ size = 32, dark = false }) {
  const fg = dark ? "#ECECEC" : T.text;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect x="13.5" y="3" width="3" height="26" rx="1.5" fill={T.copper} />
      <path d={`M4 27C6 23 9 17 12 13L15 9`} stroke={fg} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="15" y1="9" x2="27" y2="4" stroke={T.copper} strokeWidth="2.8" strokeLinecap="round" />
      <circle cx="4" cy="27" r="2" fill={fg} />
    </svg>
  );
}

function Swatch({ color, name, hex, wcag }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 0" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "6px", background: color, border: `1px solid ${T.border}`, flexShrink: 0 }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "12px", fontWeight: "600", color: T.text }}>{name}</div>
        <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textTri }}>{hex}</div>
      </div>
      {wcag && <div style={{ fontFamily: T.mono, fontSize: "10px", color: wcag.includes("AAA") ? T.success : wcag.includes("AA") ? T.copper : T.warning }}>{wcag}</div>}
    </div>
  );
}

export default function ThemeShowcase() {
  const [tab, setTab] = useState("overview");
  const tabs = [
    { id: "overview", label: "Vue d'ensemble" },
    { id: "colors", label: "Couleurs" },
    { id: "typography", label: "Typographie" },
    { id: "devices", label: "Brand Devices" },
    { id: "components", label: "Composants" },
  ];

  return (
    <div style={{
      minHeight: "100vh", fontFamily: T.body, color: T.text,
      background: T.bg,
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E"), radial-gradient(${T.textTri}12 1px, transparent 1px)`,
      backgroundSize: "200px 200px, 16px 16px",
    }}>
      {FONT_URLS.map(u => <link key={u} rel="stylesheet" href={u} />)}

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "8px" }}>
          <Logo size={36} />
          <div>
            <div style={{ fontFamily: T.display, fontWeight: "900", fontSize: "22px", letterSpacing: "-0.03em" }}>LumenIQ Signal</div>
            <div style={{ fontSize: "12px", color: T.textSec }}>Theme Showcase — v6 final</div>
          </div>
        </div>
        <div style={{ width: "40px", height: "2px", background: T.copper, borderRadius: "1px", marginBottom: "24px" }} />

        {/* Tabs */}
        <div style={{ display: "flex", gap: "2px", marginBottom: "28px", background: T.surface, borderRadius: "8px", padding: "3px", width: "fit-content" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer",
              fontFamily: T.body, fontSize: "12px",
              background: tab === t.id ? T.card : "transparent",
              color: tab === t.id ? T.copper : T.textSec,
              fontWeight: tab === t.id ? "600" : "400",
              boxShadow: tab === t.id ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ══════ OVERVIEW ══════ */}
        {tab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
              {/* Identity */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>Identité</span>
                </div>
                <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "16px" }}>
                  <div style={{ background: T.bg, borderRadius: "8px", padding: "8px", display: "flex" }}><Logo size={48} /></div>
                  <div>
                    <div style={{ fontFamily: T.display, fontWeight: "900", fontSize: "20px", letterSpacing: "-0.03em" }}>LumenIQ</div>
                    <div style={{ fontSize: "11px", color: T.textTri }}>Logo Ascension · Courbe → Droite</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "6px", marginBottom: "12px" }}>
                  {[T.bg, T.card, T.copper, T.copperHover, T.text, T.textSec, T.success, T.warning, T.error].map((c, i) => (
                    <div key={i} style={{ flex: 1, height: "8px", borderRadius: "4px", background: c, border: `1px solid ${T.border}` }} />
                  ))}
                </div>
                <div style={{ fontSize: "11px", color: T.textSec, lineHeight: 1.6 }}>
                  Cuivre #B45309 · Fond #FAFAF9 · Satoshi + IBM Plex Mono · WCAG AA audité
                </div>
              </div>

              {/* Quick facts */}
              <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>Spécifications</span>
                </div>
                {[
                  ["Accent", "Cuivre #B45309"],
                  ["Background", "#FAFAF9 (warm white)"],
                  ["Display font", "Satoshi (Fontshare)"],
                  ["Data font", "IBM Plex Mono"],
                  ["Radius", "4 / 6 / 8 / 12px"],
                  ["Brand devices", "5 (Horizon, Numerals, Markers, Grid, Pulse)"],
                  ["WCAG", "AA complet (14 paires)"],
                  ["Mode", "Light-first"],
                ].map(([k, v], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 7 ? `1px solid ${T.border}` : "none" }}>
                    <span style={{ fontSize: "11px", color: T.textTri }}>{k}</span>
                    <span style={{ fontSize: "11px", fontWeight: "500" }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample dashboard card */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                <span style={{ fontSize: "12px", fontWeight: "600" }}>Aperçu dashboard</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
                {[
                  { label: "Score de fiabilité", value: "87.3%", accent: true },
                  { label: "Séries analysées", value: "247", accent: false },
                  { label: "Erreur moyenne", value: "12.4%", accent: false },
                  { label: "Actions", value: "4", accent: false },
                ].map(({ label, value, accent }) => (
                  <div key={label} style={{
                    padding: "14px 16px", borderRadius: "8px",
                    background: T.bg, border: `1px solid ${T.border}`,
                    borderLeft: accent ? `3px solid ${T.copper}` : `1px solid ${T.border}`,
                  }}>
                    <div style={{ fontSize: "11px", color: T.textSec, marginBottom: "6px" }}>{label}</div>
                    <div style={{ fontFamily: T.display, fontSize: "22px", fontWeight: "700", color: T.copper, letterSpacing: "-0.03em" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ COLORS ══════ */}
        {tab === "colors" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Copper (accent)</div>
              <Swatch color={T.copper} name="Copper" hex="#B45309" wcag="AA 4.81:1" />
              <Swatch color={T.copperHover} name="Copper Hover" hex="#9A4408" wcag="AA+ 6.27:1" />
              <Swatch color={T.copperDark} name="Copper Dark" hex="#92400E" wcag="AAA 7.09:1" />
              <Swatch color={T.copperBg} name="Copper BG" hex="#FEF3E2" />
              <Swatch color={T.copperBgSoft} name="Copper BG Soft" hex="#FFFBF5" />
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Backgrounds & Text</div>
              <Swatch color={T.bg} name="Background" hex="#FAFAF9" />
              <Swatch color={T.card} name="Card" hex="#FFFFFF" />
              <Swatch color={T.surface} name="Surface" hex="#F3F3F0" />
              <Swatch color={T.text} name="Text Primary" hex="#141414" wcag="AAA 17.6:1" />
              <Swatch color={T.textSec} name="Text Secondary" hex="#5C5C58" wcag="AA 6.43:1" />
              <Swatch color={T.textTri} name="Text Tertiary" hex="#8A8A82" wcag="AA-lg 3.33:1" />
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Sémantique</div>
              <Swatch color={T.success} name="Success" hex="#15803D" wcag="AA 4.79:1" />
              <Swatch color={T.warning} name="Warning" hex="#A16207" wcag="AA 4.76:1" />
              <Swatch color={T.error} name="Error" hex="#B91C1C" wcag="AA 5.91:1" />
            </div>
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>Borders & Surfaces</div>
              <Swatch color={T.border} name="Border" hex="#E5E5E0" />
              <Swatch color={T.borderMed} name="Border Medium" hex="#D0D0C8" />
              <Swatch color={T.chartGrid} name="Chart Grid" hex="#EEEEE8" />
            </div>
          </div>
        )}

        {/* ══════ TYPOGRAPHY ══════ */}
        {tab === "typography" && (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "28px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
            <div style={{ marginBottom: "32px" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>Satoshi — Display & Body</div>
              <div style={{ fontFamily: T.display, fontWeight: "900", fontSize: "48px", color: T.copper, letterSpacing: "-0.04em", lineHeight: 1 }}>87.3%</div>
              <div style={{ fontFamily: T.display, fontWeight: "700", fontSize: "22px", letterSpacing: "-0.03em", marginTop: "12px" }}>Tableau de bord</div>
              <div style={{ fontFamily: T.display, fontWeight: "600", fontSize: "13px", marginTop: "8px" }}>Score de fiabilité global</div>
              <div style={{ fontFamily: T.body, fontWeight: "400", fontSize: "13px", color: T.textSec, marginTop: "8px", lineHeight: 1.6 }}>Prévision fiable, aucune action nécessaire. 247 séries analysées avec 24 méthodes de calcul sur 7 familles différentes.</div>
              <div style={{ fontFamily: T.body, fontWeight: "400", fontSize: "11px", color: T.textTri, marginTop: "6px" }}>Dernière mise à jour il y a 2 heures · Plan Standard</div>
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: "20px" }}>
              <div style={{ fontSize: "10px", fontWeight: "600", color: T.textTri, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "16px" }}>IBM Plex Mono — Data & Labels</div>
              <div style={{ fontFamily: T.mono, fontSize: "22px", fontWeight: "600", color: T.copper, letterSpacing: "-0.03em" }}>12.4% · 247 · 6.7%</div>
              <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textSec, marginTop: "10px" }}>WAPE 8.2% · Classe A · Dernière mise à jour 10 mars 2026 14:32</div>
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                {[
                  { label: "RUPTURE", color: T.error },
                  { label: "SURSTOCK", color: T.warning },
                  { label: "RÉVISION", color: T.copper },
                  { label: "STABLE", color: T.success },
                ].map(({ label, color }) => (
                  <span key={label} style={{
                    fontFamily: T.mono, fontSize: "9px", fontWeight: "600",
                    letterSpacing: "0.05em", color,
                    background: color + "12", padding: "3px 8px", borderRadius: "3px",
                  }}>{label}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════ BRAND DEVICES ══════ */}
        {tab === "devices" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              {
                name: "1. Horizon Line",
                desc: "Barre verticale cuivre 3px. Sépare passé/futur dans les charts, accentue les titres et cards actives.",
                render: () => (
                  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ width: "3px", height: "32px", background: T.copper, borderRadius: "1.5px" }} />
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: "700" }}>Tableau de bord</div>
                        <div style={{ fontSize: "11px", color: T.textTri }}>Titre avec accent</div>
                      </div>
                    </div>
                    <div style={{ padding: "12px 16px", borderLeft: `3px solid ${T.copper}`, background: T.bg, borderRadius: "6px" }}>
                      <div style={{ fontSize: "11px", color: T.textSec }}>Card active</div>
                      <div style={{ fontSize: "18px", fontWeight: "700", color: T.copper }}>87.3%</div>
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ fontSize: "12px", color: T.copper, fontWeight: "600", borderBottom: `2px solid ${T.copper}`, paddingBottom: "4px" }}>Dashboard</span>
                      <span style={{ fontSize: "12px", color: T.textSec }}>Prévisions</span>
                    </div>
                  </div>
                ),
              },
              {
                name: "2. Copper Numerals",
                desc: "Tous les chiffres-clés en cuivre. Satoshi 700 pour l'affichage, IBM Plex Mono pour l'inline.",
                render: () => (
                  <div style={{ display: "flex", gap: "24px", alignItems: "baseline" }}>
                    <span style={{ fontFamily: T.display, fontSize: "36px", fontWeight: "700", color: T.copper, letterSpacing: "-0.04em" }}>87.3%</span>
                    <span style={{ fontFamily: T.display, fontSize: "22px", fontWeight: "700", color: T.copper }}>247</span>
                    <span style={{ fontFamily: T.mono, fontSize: "13px", fontWeight: "500", color: T.copper }}>WAPE 12.4%</span>
                  </div>
                ),
              },
              {
                name: "3. Section Markers",
                desc: "Petit trait cuivre 12px × 2px avant chaque titre de section.",
                render: () => (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {["Prévisions vs réalisé", "Actions recommandées", "Résumé exécutif"].map(t => (
                      <div key={t} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                        <span style={{ fontSize: "13px", fontWeight: "600" }}>{t}</span>
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                name: "4. Dot Grid",
                desc: "Micro-texture 16px, rayon 0.6px, opacité 35%. Zones forecast et fond principal.",
                render: () => (
                  <div style={{ display: "flex", gap: "16px" }}>
                    <div style={{
                      width: "120px", height: "60px", borderRadius: "6px", border: `1px solid ${T.border}`,
                      backgroundImage: `radial-gradient(${T.textTri} 0.6px, transparent 0.6px)`,
                      backgroundSize: "16px 16px", opacity: 0.35,
                    }} />
                    <div style={{ fontSize: "11px", color: T.textSec, lineHeight: 1.6, maxWidth: "200px" }}>
                      Apparaît dans la zone forecast des charts (à droite de la ligne de référence) et en texture de fond de page.
                    </div>
                  </div>
                ),
              },
              {
                name: "5. Pulse",
                desc: "Point cuivre r=3 + halo r=5 à 12% opacité. Marque le dernier point réel dans les charts.",
                render: () => (
                  <svg width="120" height="40" viewBox="0 0 120 40">
                    <line x1="10" y1="30" x2="60" y2="15" stroke={T.chartActual} strokeWidth="2" strokeLinecap="round" />
                    <circle cx="60" cy="15" r="8" fill={T.copper} opacity="0.12" />
                    <circle cx="60" cy="15" r="4" fill={T.copper} />
                    <line x1="60" y1="15" x2="110" y2="10" stroke={T.copper} strokeWidth="2" strokeDasharray="4,3" strokeLinecap="round" />
                    <text x="60" y="38" textAnchor="middle" fill={T.textTri} fontSize="8" fontFamily={T.mono}>RÉFÉRENCE</text>
                  </svg>
                ),
              },
            ].map(({ name, desc, render }) => (
              <div key={name} style={{
                background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px",
                padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                  <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                  <span style={{ fontSize: "13px", fontWeight: "700" }}>{name}</span>
                </div>
                <div style={{ fontSize: "11px", color: T.textSec, marginBottom: "14px" }}>{desc}</div>
                {render()}
              </div>
            ))}
          </div>
        )}

        {/* ══════ COMPONENTS ══════ */}
        {tab === "components" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Buttons */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Boutons</span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button style={{ background: T.copper, color: "#fff", border: "none", borderRadius: "6px", padding: "10px 22px", fontSize: "13px", fontWeight: "600", fontFamily: T.display, cursor: "pointer", boxShadow: `0 1px 3px ${T.copper}25` }}>Lancer une prévision</button>
                <button style={{ background: "transparent", color: T.copper, border: `1.5px solid ${T.copper}`, borderRadius: "6px", padding: "10px 22px", fontSize: "13px", fontWeight: "600", fontFamily: T.display, cursor: "pointer" }}>Télécharger le rapport</button>
                <button style={{ background: "transparent", color: T.textSec, border: `1px solid ${T.border}`, borderRadius: "6px", padding: "10px 22px", fontSize: "13px", fontFamily: T.body, cursor: "pointer" }}>Historique</button>
              </div>
            </div>

            {/* Badges */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Badges & statuts</span>
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {[
                  { l: "RUPTURE", c: T.error }, { l: "SURSTOCK", c: T.warning },
                  { l: "RÉVISION", c: T.copper }, { l: "STABLE", c: T.success },
                  { l: "Classe A", c: T.success }, { l: "Classe B", c: T.warning }, { l: "Classe C", c: T.textTri },
                ].map(({ l, c }) => (
                  <span key={l} style={{
                    fontFamily: T.mono, fontSize: "9px", fontWeight: "600",
                    letterSpacing: "0.05em", color: c,
                    background: c + "12", padding: "3px 8px", borderRadius: "3px",
                  }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Cards */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "20px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Cards</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderRadius: "8px", padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: "11px", color: T.textSec, marginBottom: "6px" }}>Card standard</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: T.copper }}>247</div>
                  <div style={{ fontSize: "10px", color: T.textTri, marginTop: "4px" }}>Séries analysées</div>
                </div>
                <div style={{ background: T.bg, border: `1px solid ${T.border}`, borderLeft: `3px solid ${T.copper}`, borderRadius: "8px", padding: "16px", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
                  <div style={{ fontSize: "11px", color: T.textSec, marginBottom: "6px" }}>Card avec accent</div>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: T.copper }}>12.4%</div>
                  <div style={{ fontSize: "10px", color: T.textTri, marginTop: "4px" }}>Erreur moyenne</div>
                </div>
              </div>
            </div>

            {/* Action row */}
            <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: "8px", overflow: "hidden", boxShadow: "0 1px 2px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "14px 18px", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: "12px", height: "2px", background: T.copper, borderRadius: "1px" }} />
                <span style={{ fontSize: "13px", fontWeight: "700" }}>Action item</span>
              </div>
              <div style={{ display: "flex", alignItems: "stretch", background: T.errorBg }}>
                <div style={{ width: "3px", background: T.error }} />
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 18px", flex: 1 }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: T.error }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600" }}>Robe été XL</span>
                      <span style={{ fontFamily: T.mono, fontSize: "9px", fontWeight: "600", letterSpacing: "0.05em", color: T.error, background: T.error + "12", padding: "2px 7px", borderRadius: "3px" }}>RUPTURE</span>
                      <span style={{ fontFamily: T.mono, fontSize: "9px", fontWeight: "600", color: T.success }}>Classe A</span>
                    </div>
                    <div style={{ fontSize: "12px", color: T.textSec, marginTop: "4px" }}>Risque de rupture dans 12 jours — pensez à passer commande.</div>
                  </div>
                  <div style={{ fontFamily: T.mono, fontSize: "11px", color: T.textTri }}>8.2%</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ marginTop: "32px", paddingTop: "16px", borderTop: `2px solid ${T.copper}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Logo size={18} />
            <span style={{ fontFamily: T.display, fontWeight: "900", fontSize: "13px", letterSpacing: "-0.02em" }}>LumenIQ</span>
          </div>
          <span style={{ fontSize: "10px", color: T.textTri }}>Signal V6 · Theme Showcase · Mars 2026</span>
        </div>
      </div>
    </div>
  );
}
