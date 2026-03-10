import type { NextConfig } from "next";

// CSP is now handled by middleware.ts (nonce-based for strict-dynamic support).
// Only non-CSP security headers remain here.

const nextConfig: NextConfig = {
  reactCompiler: true,

  async headers() {
    return [
      {
        // Appliquer les headers de sécurité à toutes les routes
        source: "/(.*)",
        headers: [
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
