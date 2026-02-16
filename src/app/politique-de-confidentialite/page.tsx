import type { Metadata } from "next";
import { Navbar, Footer } from "@/components/shared";

export const metadata: Metadata = {
  title: "Politique de confidentialité | LumenIQ",
  description:
    "Politique de confidentialité de LumenIQ : données collectées, finalités, droits RGPD, sous-traitants et sécurité.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

export default function PolitiqueDeConfidentialite() {
  return (
    <div className="min-h-screen bg-zinc-950">
      <Navbar />

      <main className="pt-20">
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
              Politique de confidentialit&eacute;
            </h1>
            <p className="text-sm text-zinc-500 mb-10">
              Derni&egrave;re mise &agrave; jour : 16 f&eacute;vrier 2026
            </p>

            <div className="space-y-8 text-zinc-400 text-sm leading-relaxed">
              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  1. Responsable du traitement
                </h2>
                <p>
                  LumenIQ SAS<br />
                  Si&egrave;ge social : [Adresse &agrave; compl&eacute;ter]<br />
                  Email : <span className="text-white">contact@lumeniq.fr</span><br />
                  Le responsable du traitement d&eacute;termine les finalit&eacute;s et les moyens
                  du traitement de vos donn&eacute;es personnelles.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  2. Donn&eacute;es collect&eacute;es
                </h2>
                <p>Dans le cadre de l&apos;utilisation de LumenIQ, nous collectons :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-zinc-300">Donn&eacute;es d&apos;identification</strong> :
                    nom complet, adresse email
                  </li>
                  <li>
                    <strong className="text-zinc-300">Donn&eacute;es d&apos;utilisation</strong> :
                    fichiers CSV import&eacute;s (historiques de ventes), r&eacute;sultats de pr&eacute;vision
                    g&eacute;n&eacute;r&eacute;s, param&egrave;tres de configuration
                  </li>
                  <li>
                    <strong className="text-zinc-300">Donn&eacute;es techniques</strong> :
                    cookies de session (authentification uniquement)
                  </li>
                </ul>
                <p className="mt-2">
                  Nous ne collectons aucune donn&eacute;e sensible au sens du RGPD
                  (origine ethnique, opinions politiques, donn&eacute;es de sant&eacute;, etc.).
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  3. Finalit&eacute;s du traitement
                </h2>
                <p>Vos donn&eacute;es sont trait&eacute;es pour :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>L&apos;ex&eacute;cution du service de pr&eacute;vision (analyse de vos donn&eacute;es de vente, g&eacute;n&eacute;ration de forecasts)</li>
                  <li>La gestion de votre compte utilisateur et l&apos;authentification</li>
                  <li>Le support technique et la communication relative au service</li>
                  <li>L&apos;am&eacute;lioration du service (analyses agr&eacute;g&eacute;es et anonymis&eacute;es)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  4. Base l&eacute;gale
                </h2>
                <p>Le traitement de vos donn&eacute;es repose sur :</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-zinc-300">L&apos;ex&eacute;cution du contrat</strong> (Article 6.1.b du RGPD) :
                    le traitement est n&eacute;cessaire &agrave; la fourniture du service de pr&eacute;vision
                    auquel vous avez souscrit
                  </li>
                  <li>
                    <strong className="text-zinc-300">Votre consentement</strong> (Article 6.1.a du RGPD) :
                    recueilli lors de la cr&eacute;ation de votre compte
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  5. Dur&eacute;e de conservation
                </h2>
                <p>
                  Vos donn&eacute;es sont conserv&eacute;es pendant toute la dur&eacute;e de votre
                  utilisation du service. En cas de suppression de votre compte, toutes
                  vos donn&eacute;es personnelles et fichiers sont d&eacute;finitivement effac&eacute;s
                  sous 30 jours.
                </p>
                <p className="mt-2">
                  Les donn&eacute;es de facturation sont conserv&eacute;es conform&eacute;ment aux
                  obligations l&eacute;gales comptables (10 ans).
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  6. Sous-traitants et transferts de donn&eacute;es
                </h2>
                <p>Nous faisons appel aux sous-traitants suivants :</p>
                <div className="mt-3 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-left">
                        <th className="py-2 pr-4 text-zinc-300 font-medium">Prestataire</th>
                        <th className="py-2 pr-4 text-zinc-300 font-medium">Finalit&eacute;</th>
                        <th className="py-2 text-zinc-300 font-medium">Localisation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      <tr>
                        <td className="py-2 pr-4">Supabase (AWS)</td>
                        <td className="py-2 pr-4">Base de donn&eacute;es, authentification, stockage</td>
                        <td className="py-2">Union europ&eacute;enne (eu-central-1)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Vercel</td>
                        <td className="py-2 pr-4">H&eacute;bergement de l&apos;application web</td>
                        <td className="py-2">&Eacute;tats-Unis (clauses contractuelles types)</td>
                      </tr>
                      <tr>
                        <td className="py-2 pr-4">Hostinger (N8N)</td>
                        <td className="py-2 pr-4">Automatisation des workflows</td>
                        <td className="py-2">Union europ&eacute;enne</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="mt-3">
                  Les transferts hors UE sont encadr&eacute;s par des clauses contractuelles
                  types approuv&eacute;es par la Commission europ&eacute;enne.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  7. Vos droits
                </h2>
                <p>
                  Conform&eacute;ment au RGPD et &agrave; la loi Informatique et Libert&eacute;s,
                  vous disposez des droits suivants :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li><strong className="text-zinc-300">Droit d&apos;acc&egrave;s</strong> : obtenir une copie de vos donn&eacute;es personnelles</li>
                  <li><strong className="text-zinc-300">Droit de rectification</strong> : corriger vos donn&eacute;es inexactes ou incompl&egrave;tes</li>
                  <li><strong className="text-zinc-300">Droit &agrave; l&apos;effacement</strong> : supprimer votre compte et toutes vos donn&eacute;es</li>
                  <li><strong className="text-zinc-300">Droit &agrave; la portabilit&eacute;</strong> : exporter vos donn&eacute;es dans un format structur&eacute;</li>
                  <li><strong className="text-zinc-300">Droit d&apos;opposition</strong> : vous opposer au traitement de vos donn&eacute;es</li>
                  <li><strong className="text-zinc-300">Droit &agrave; la limitation</strong> : restreindre le traitement de vos donn&eacute;es</li>
                </ul>
                <p className="mt-3">
                  Vous pouvez exercer vos droits d&apos;acc&egrave;s, de portabilit&eacute; et
                  d&apos;effacement directement depuis la page{" "}
                  <span className="text-white">Param&egrave;tres</span> de votre compte.
                </p>
                <p className="mt-2">
                  Pour toute autre demande, contactez-nous &agrave; :{" "}
                  <span className="text-white">contact@lumeniq.fr</span>
                </p>
                <p className="mt-2">
                  Vous disposez &eacute;galement du droit d&apos;introduire une r&eacute;clamation
                  aupr&egrave;s de la CNIL :{" "}
                  <span className="text-white">www.cnil.fr</span>
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  8. S&eacute;curit&eacute;
                </h2>
                <p>
                  Nous mettons en &oelig;uvre des mesures techniques et organisationnelles
                  pour prot&eacute;ger vos donn&eacute;es :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Chiffrement des donn&eacute;es en transit (TLS/HTTPS) et au repos (AES-256)</li>
                  <li>Authentification s&eacute;curis&eacute;e avec hashage des mots de passe (bcrypt)</li>
                  <li>Politiques de s&eacute;curit&eacute; au niveau des lignes (Row Level Security) sur toutes les tables</li>
                  <li>Headers de s&eacute;curit&eacute; HTTP (CSP, HSTS, X-Frame-Options)</li>
                  <li>Communications webhook sign&eacute;es (HMAC-SHA256)</li>
                </ul>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  9. Cookies
                </h2>
                <p>
                  LumenIQ utilise uniquement des cookies strictement n&eacute;cessaires au
                  fonctionnement du service :
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>
                    <strong className="text-zinc-300">Cookie de session Supabase</strong> :
                    maintien de votre session d&apos;authentification
                  </li>
                  <li>
                    <strong className="text-zinc-300">Pr&eacute;f&eacute;rences locales</strong> :
                    stockage local (localStorage) pour l&apos;onboarding et les pr&eacute;f&eacute;rences d&apos;affichage
                  </li>
                </ul>
                <p className="mt-2">
                  Aucun cookie publicitaire, analytique ou de tra&ccedil;age n&apos;est utilis&eacute;.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">
                  10. Modifications
                </h2>
                <p>
                  Nous nous r&eacute;servons le droit de modifier cette politique de
                  confidentialit&eacute;. En cas de modification substantielle, nous vous en
                  informerons par email ou via une notification dans l&apos;application.
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-white mb-3">Contact</h2>
                <p>
                  Pour toute question relative &agrave; cette politique ou &agrave; vos donn&eacute;es
                  personnelles :<br />
                  Email : <span className="text-white">contact@lumeniq.fr</span><br />
                  Support : <span className="text-white">support@lumeniq.fr</span>
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
