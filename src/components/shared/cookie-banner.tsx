"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "lumeniq-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, "ok");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-white/10 bg-zinc-900/95 backdrop-blur-lg px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <Cookie className="w-5 h-5 text-zinc-400 shrink-0 hidden sm:block" />
        <p className="text-sm text-zinc-400 flex-1">
          Ce site utilise uniquement des cookies n&eacute;cessaires au fonctionnement
          du service (authentification, pr&eacute;f&eacute;rences de session). Aucun
          cookie publicitaire n&apos;est d&eacute;pos&eacute;.{" "}
          <Link
            href="/politique-de-confidentialite"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors"
          >
            En savoir plus
          </Link>
        </p>
        <button
          onClick={handleAccept}
          className="shrink-0 px-5 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/15 border border-white/10 rounded-lg transition-colors"
        >
          Compris
        </button>
      </div>
    </div>
  );
}
