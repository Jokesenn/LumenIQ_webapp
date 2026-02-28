import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/shared";

export const metadata: Metadata = {
  title: "Mentions légales | LumenIQ",
  description:
    "Mentions légales de LumenIQ SAS : éditeur, hébergement, propriété intellectuelle et conditions d'utilisation.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-8 text-white">
              Mentions légales
            </h1>

            <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Éditeur du site</h2>
                <p>
                  LumenIQ<br />
                  Société par actions simplifiée (SAS)<br />
                  Siège social : [Adresse à compléter]<br />
                  RCS : [Numéro à compléter]<br />
                  SIRET : [Numéro à compléter]<br />
                  Directeur de la publication : [Nom à compléter]
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Hébergement</h2>
                <p>
                  Ce site est hébergé par Vercel Inc.<br />
                  340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
                  Les données applicatives sont hébergées au sein de l&apos;Union européenne
                  via Supabase (infrastructure AWS eu-west).
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Protection des données personnelles</h2>
                <p>
                  Conformément au Règlement Général sur la Protection des Données (RGPD)
                  et à la loi Informatique et Libertés, vous disposez d&apos;un droit d&apos;accès,
                  de rectification, de suppression et de portabilité de vos données personnelles.
                </p>
                <p className="mt-2">
                  Pour exercer ces droits, contactez-nous à : <span className="text-white">contact@lumeniq.fr</span>
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Cookies</h2>
                <p>
                  Ce site utilise uniquement des cookies strictement nécessaires au fonctionnement
                  du service (authentification, préférences de session). Aucun cookie publicitaire
                  ou de traçage n&apos;est déposé.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Propriété intellectuelle</h2>
                <p>
                  L&apos;ensemble du contenu de ce site (textes, graphismes, logos, images, logiciels)
                  est la propriété exclusive de LumenIQ ou de ses partenaires et est protégé par
                  le droit français et international de la propriété intellectuelle.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
                <p>
                  Email : <span className="text-white">contact@lumeniq.fr</span><br />
                  Support technique : <span className="text-white">support@lumeniq.fr</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
