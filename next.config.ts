import type { NextConfig } from "next";

// --- Content Security Policy ---
// Domaines autorisés pour les connexions sortantes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://kshtmftvjhsdlxpsvgyr.supabase.co";
const supabaseWs = supabaseUrl.replace("https://", "wss://");
// N8N n'est plus dans la CSP : les appels passent par /api/webhook/* (server-side)

const cspDirectives = [
  // Politique par défaut : uniquement même origine
  "default-src 'self'",

  // Scripts : self + inline nécessaire pour JSON-LD (dangerouslySetInnerHTML) et l'hydratation Next.js
  "script-src 'self' 'unsafe-inline'",

  // Styles : inline nécessaire pour Tailwind, Framer Motion, et les styles dynamiques
  "style-src 'self' 'unsafe-inline'",

  // Images : data: pour SVG en base64 (animated-background), blob: pour l'export PDF (html2canvas)
  "img-src 'self' data: blob:",

  // Polices : auto-hébergées par next/font/google (pas de CDN externe)
  "font-src 'self'",

  // Connexions API : Supabase REST + WebSocket (N8N est server-side only via /api/webhook/*)
  `connect-src 'self' ${supabaseUrl} ${supabaseWs}`,

  // Workers : nécessaire pour html2canvas / PDF export
  "worker-src 'self' blob:",

  // Interdire les iframes, objets embarqués, et le framing par des tiers
  "frame-src 'none'",
  "object-src 'none'",
  "frame-ancestors 'none'",

  // Restreindre les cibles de formulaire et la base URL
  "base-uri 'self'",
  "form-action 'self'",

  // Bloquer les requêtes de téléchargement non autorisées
  "upgrade-insecure-requests",
];

const ContentSecurityPolicy = cspDirectives.join("; ");

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        // Appliquer les headers de sécurité à toutes les routes
        source: "/(.*)",
        headers: [
          // --- CSP ---
          {
            key: "Content-Security-Policy",
            value: ContentSecurityPolicy,
          },
          // --- Anti-clickjacking (défense en profondeur, complète frame-ancestors) ---
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // --- Empêcher le MIME-sniffing ---
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // --- Contrôler les informations referrer envoyées ---
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // --- Forcer HTTPS (1 an, incluant les sous-domaines) ---
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // --- Restreindre les fonctionnalités du navigateur ---
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // --- Empêcher la détection du type de contenu (IE legacy) ---
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
