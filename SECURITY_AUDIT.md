# Audit de Securite & Conformite RGPD — LumenIQ

**Date** : 16 fevrier 2026 (derniere mise a jour : 16 fevrier 2026)
**Perimetre** : Backend (`Lumen_IQ/`) + Frontend (`LumenIQ_webapp/`) + Supabase + N8N
**Projet Supabase** : `kshtmftvjhsdlxpsvgyr` (region `eu-central-1`)

---

## Table des matieres

1. [Resume executif](#1-resume-executif)
2. [RLS & Securite base de donnees](#2-rls--securite-base-de-donnees)
3. [Corrections de vulnerabilites applicatives](#3-corrections-de-vulnerabilites-applicatives)
4. [Headers de securite HTTP](#4-headers-de-securite-http)
5. [Securisation des webhooks N8N](#5-securisation-des-webhooks-n8n)
6. [Conformite RGPD](#6-conformite-rgpd)
7. [Renforcement authentification](#7-renforcement-authentification)
8. [Fichiers modifies](#8-fichiers-modifies)
9. [Migrations Supabase appliquees](#9-migrations-supabase-appliquees)
10. [Configuration serveur (VPS)](#10-configuration-serveur-vps)
11. [Actions restantes](#11-actions-restantes)

---

## 1. Resume executif

L'audit a couvert l'ensemble du flux de donnees : upload CSV dans la webapp, stockage Supabase, declenchement N8N, traitement backend, retour des resultats. Toutes les vulnerabilites identifiees ont ete corrigees.

**Avant l'audit** :
- 4 politiques RLS de test laissant un acces ouvert a n'importe qui
- 2 vues contournant le RLS (SECURITY DEFINER)
- 14 fonctions avec search_path mutable (risque d'injection)
- URLs N8N exposees dans le bundle JavaScript client
- Aucun header de securite HTTP
- Open redirect dans le callback d'authentification
- Acces aux fichiers de resultats sans verification d'ownership
- Pas de politique de confidentialite ni de mecanismes RGPD
- Suppression de compte non fonctionnelle
- Mot de passe minimum 6 caracteres sans exigence de complexite

**Apres l'audit** :
- 0 vulnerabilite critique ou haute
- 1 avertissement restant (Leaked Password Protection — necessite plan Pro Supabase)

---

## 2. RLS & Securite base de donnees

### 2.1 Suppression des politiques de test dangereuses

**Migration** : `remove_dangerous_temp_testing_policies`

4 politiques supprimees qui autorisaient des operations sans authentification :

| Table | Politique supprimee | Risque |
|-------|-------------------|--------|
| `forecast_jobs` | "Allow insert for testing" | INSERT anonyme |
| `forecast_syntheses` | "Temp: Allow insert for testing" | INSERT anonyme |
| `forecast_syntheses` | "Temp: Allow select for testing" | SELECT anonyme |
| `state_store` | "Temp: Allow all for testing" | Acces total anonyme |

### 2.2 Correction des vues SECURITY DEFINER

**Migration** : `fix_security_definer_views_and_service_role_policies`

2 vues recreees avec `security_invoker = true` (respecte le RLS) :
- `lumeniq.user_usage_summary`
- `lumeniq.recent_jobs_detail`

### 2.3 Correction des politiques service_role

**Meme migration**

3 tables avaient des politiques "Service role full access" ciblant le mauvais role (`public` au lieu de `service_role`) :
- `forecast_syntheses`
- `job_summaries`
- `state_store`

Politique dupliquee supprimee : `plans` (SELECT en double).

### 2.4 Optimisation des performances RLS

**Migration** : `optimize_rls_policies_initplan`

~35 politiques recreees avec deux ameliorations :
- `auth.uid()` remplace par `(select auth.uid())` — evalue une seule fois par requete au lieu d'une fois par ligne
- Role `{public}` remplace par `authenticated` — plus restrictif

### 2.5 Securisation des fonctions PostgreSQL

**Migration** : `fix_function_search_path`

14 fonctions corrigees avec `SET search_path = ''` pour empecher les attaques par injection de search_path :

**Schema `lumeniq`** :
- `handle_new_user()`
- `update_series_used_count()`
- `refresh_user_usage_summary()`
- `check_and_reset_series_period()`
- `delete_user_data()` (ajoutee dans cette session)

**Schema `public`** :
- 9 fonctions liees aux triggers et a la gestion des profils

### 2.6 Fonction de suppression de donnees (RGPD)

**Migration** : `create_delete_user_data_function`

Fonction RPC `lumeniq.delete_user_data(target_user_id UUID)` :
- `SECURITY DEFINER` + `SET search_path = ''`
- Verifie `auth.uid() = target_user_id` (auto-suppression uniquement)
- Supprime dans l'ordre FK : `forecast_actions` -> `series_actuals` -> `forecast_results_months` -> `forecast_results` -> `forecast_series` -> `forecast_syntheses` -> `job_summaries` -> `job_monthly_aggregates` -> `state_store` -> `forecast_jobs` -> `user_preferences` -> `profiles`
- Retourne le nombre total de lignes supprimees

### 2.7 Nettoyage des index inutilises

**Migration** : `drop_unused_indexes`

8 index detectes comme jamais utilises par le linter Supabase, supprimes :

| Index | Table |
|-------|-------|
| `idx_profiles_plan` | `profiles` |
| `idx_forecast_results_alerts` | `forecast_results` |
| `idx_actions_series` | `forecast_actions` |
| `idx_api_logs_user` | `api_logs` |
| `idx_api_logs_created_at` | `api_logs` |
| `idx_syntheses_user_id` | `forecast_syntheses` |
| `idx_syntheses_type` | `forecast_syntheses` |
| `idx_usage_logs_user_period` | `usage_logs` |

**Migration** : `add_foreign_key_indexes`

3 index simples recrees pour couvrir les foreign keys exposees par la suppression :

| Index | Table | Colonne |
|-------|-------|---------|
| `idx_api_logs_user_id` | `api_logs` | `user_id` |
| `idx_forecast_syntheses_user_id` | `forecast_syntheses` | `user_id` |
| `idx_usage_logs_user_id` | `usage_logs` | `user_id` |

**Resultat net** : 5 index inutiles supprimes, 3 index FK conserves en version simplifiee.

---

## 3. Corrections de vulnerabilites applicatives

### 3.1 Open redirect dans le callback d'authentification

**Fichier** : `src/app/auth/callback/route.ts`

**Avant** : le parametre `next` etait utilise directement pour la redirection apres authentification, permettant a un attaquant de rediriger vers un site externe via un lien malveillant (`/auth/callback?next=https://evil.com`).

**Apres** : validation stricte du parametre `next` :
```typescript
const rawNext = searchParams.get('next') ?? '/dashboard'
const next = rawNext.startsWith('/') && !rawNext.startsWith('//') ? rawNext : '/dashboard'
```
- Seuls les chemins relatifs commencant par `/` sont acceptes
- Les URLs de type `//evil.com` (protocol-relative) sont rejetees
- Fallback vers `/dashboard` en cas de valeur invalide

### 3.2 Verification d'ownership pour le telechargement de resultats

**Fichier** : `src/app/dashboard/results/actions.ts`

**Avant** : la server action `getResultsDownloadUrl(jobId)` generait une URL signee pour n'importe quel `jobId` sans verifier que le job appartenait a l'utilisateur connecte. Un utilisateur pouvait potentiellement acceder aux resultats d'un autre utilisateur en devinant ou interceptant un `jobId`.

**Apres** : verification en base de donnees avant de generer l'URL signee :
```typescript
const { data: job } = await supabase
  .schema("lumeniq")
  .from("forecast_jobs")
  .select("id")
  .eq("id", jobId)
  .eq("user_id", user.id)
  .single();

if (!job) return null;
```

### 3.3 Alignement minLength du mot de passe

**Fichier** : `src/app/login/page.tsx`

Le champ password avait `minLength={6}` alors que la configuration Supabase a ete renforcee a 8 caracteres minimum. Aligne a `minLength={8}` pour une validation cote client coherente avec le backend.

---

## 4. Headers de securite HTTP

**Fichier** : `next.config.ts`

6 headers appliques a toutes les routes (`/(.*)`):

| Header | Valeur | Objectif |
|--------|--------|----------|
| `Content-Security-Policy` | `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' <supabase_url> <supabase_ws>; worker-src 'self' blob:; frame-src 'none'; object-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; upgrade-insecure-requests` | Restreindre les sources de contenu |
| `X-Frame-Options` | `DENY` | Anti-clickjacking |
| `X-Content-Type-Options` | `nosniff` | Empecher le MIME-sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Limiter les informations referrer |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Forcer HTTPS (1 an) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Desactiver les APIs sensibles |

**Points cles** :
- N8N n'est PAS dans la CSP `connect-src` (les appels passent par les API routes server-side)
- Supabase (REST + WebSocket) est le seul domaine externe autorise
- Polices auto-hebergees via `next/font/google` (pas de CDN externe)

---

## 5. Securisation des webhooks N8N

### 5.1 Architecture avant/apres

**Avant** :
```
Client (browser) ---> N8N directement (URL dans NEXT_PUBLIC_*)
                      URL visible dans le bundle JS
                      userId envoye depuis le client (spoofable)
```

**Apres** :
```
Client (browser) ---> /api/webhook/forecast (Next.js API route)
                      |-- Verifie session Supabase
                      |-- Verifie ownership du job en DB
                      |-- Extrait userId de la session (anti-spoofing)
                      |-- Signe avec HMAC-SHA256
                      +--> N8N (URL server-only)
                           |-- Valide signature HMAC
                           |-- Rejette si timestamp > 5 min
```

### 5.2 Fichiers crees

| Fichier | Role |
|---------|------|
| `src/lib/webhook-signature.ts` | Utilitaire HMAC-SHA256 : `signWebhookPayload(body)` -> `{ signature: "t=<ts>,v1=<hex>", timestamp }` |
| `src/app/api/webhook/forecast/route.ts` | Proxy authentifie pour le declenchement de forecast |
| `src/app/api/webhook/chat/route.ts` | Proxy authentifie pour le chat IA (timeout 55s) |

### 5.3 Variables d'environnement

Toutes les URLs N8N sont desormais **server-only** (pas de prefixe `NEXT_PUBLIC_`) :

```env
N8N_WEBHOOK_URL=https://n8n.srv811898.hstgr.cloud/webhook/forecast-trigger
N8N_CHAT_WEBHOOK_URL=https://n8n.srv811898.hstgr.cloud/webhook/1b5a2430-...
N8N_WEBHOOK_SECRET=<secret HMAC 256 bits>
```

### 5.4 Validation cote N8N

Un noeud **Code** a ete ajoute dans les 2 workflows N8N (forecast-trigger + chat) pour valider la signature HMAC :
- Verifie la presence du header `x-webhook-signature`
- Parse le format `t=<timestamp>,v1=<hmac>`
- Rejette si le timestamp depasse 5 minutes (anti-replay)
- Recalcule le HMAC et compare avec la valeur recue

Prerequis serveur : `NODE_FUNCTION_ALLOW_BUILTIN=crypto` dans l'environnement Docker de N8N.

---

## 6. Conformite RGPD

### 6.1 Politique de confidentialite (Articles 13-14)

**Fichier** : `src/app/politique-de-confidentialite/page.tsx`
**URL** : `/politique-de-confidentialite`

Page statique avec 10 sections :
1. Responsable du traitement (LumenIQ SAS)
2. Donnees collectees (identification, utilisation, techniques)
3. Finalites (service, auth, support, amelioration)
4. Base legale (execution du contrat + consentement)
5. Duree de conservation (duree du compte + 30 jours)
6. Sous-traitants (Supabase UE, Vercel US avec CCT, Hostinger UE)
7. Droits (acces, rectification, effacement, portabilite, opposition, limitation)
8. Securite (TLS, AES-256, bcrypt, RLS, CSP, HMAC)
9. Cookies (session uniquement, pas de traceur)
10. Modifications

### 6.2 Banniere cookies informative

**Fichier** : `src/components/shared/cookie-banner.tsx`
**Integration** : `src/app/layout.tsx` (root layout)

- Bandeau fixe en bas de page
- Texte informatif (cookies necessaires uniquement)
- Lien vers la politique de confidentialite
- Bouton "Compris" -> `localStorage.setItem("lumeniq-cookie-consent", "ok")`
- N'apparait plus apres acceptation

### 6.3 Export de donnees (Article 20 — Portabilite)

**Fichier** : `src/app/dashboard/settings/actions.ts` (`exportUserData()`)
**UI** : Section "Vos donnees" dans la page Parametres

- Server action authentifiee
- Exporte 12 tables du schema `lumeniq` filtrees par `user_id`
- Gestion speciale de `forecast_actions` (jointure via `job_id`)
- Supprime `stripe_customer_id` et `stripe_subscription_id` du profil
- Telecharge un fichier JSON structure (`lumeniq-export-YYYY-MM-DD.json`)

### 6.4 Suppression de compte (Article 17 — Droit a l'effacement)

**Server action** : `deleteAccount()` dans `settings/actions.ts`
**Migration** : `create_delete_user_data_function`
**UI** : Modale de confirmation dans la page Parametres

Flux de suppression :
1. L'utilisateur clique "Supprimer mon compte"
2. Modale avec texte d'avertissement + champ de confirmation ("SUPPRIMER")
3. Appel RPC `delete_user_data` (supprime toutes les donnees en DB)
4. Suppression des fichiers Storage (`uploads/` + `results/`)
5. Suppression du compte Auth via client admin (`SUPABASE_SERVICE_ROLE_KEY`)
6. Deconnexion + redirection vers `/login`

### 6.5 Consentement a l'inscription

**Fichier** : `src/app/login/page.tsx`

- Checkbox en mode signup : "J'accepte la politique de confidentialite et le traitement de mes donnees personnelles"
- Lien cliquable vers `/politique-de-confidentialite`
- Bouton "Creer mon compte" desactive tant que la checkbox n'est pas cochee
- Reset lors du changement de mode (login/signup)

### 6.6 Footer

**Fichier** : `src/components/shared/footer.tsx`

Lien "Politique de confidentialite" ajoute dans la section Legale (a cote de "Mentions legales").

---

## 7. Renforcement authentification

Configuration appliquee dans Supabase Dashboard (Auth > Providers > Email) :

| Parametre | Avant | Apres |
|-----------|-------|-------|
| Minimum password length | 6 | **8** |
| Password Requirements | No required characters | **Lowercase, uppercase, digits, symbols** |
| Prevent leaked passwords | Desactive | Desactive (necessite plan Pro) |

Impact sur les utilisateurs existants : les nouvelles regles s'appliquent a l'inscription et au changement de mot de passe. Les utilisateurs existants avec un mot de passe faible recevront un `WeakPasswordError` a la prochaine connexion.

---

## 8. Fichiers modifies

### Fichiers crees
| Fichier | Description |
|---------|-------------|
| `src/app/politique-de-confidentialite/page.tsx` | Page politique de confidentialite |
| `src/components/shared/cookie-banner.tsx` | Banniere cookies informative |
| `src/app/dashboard/settings/actions.ts` | Server actions (export + suppression) |
| `src/lib/webhook-signature.ts` | Utilitaire signature HMAC-SHA256 |
| `src/app/api/webhook/forecast/route.ts` | Proxy webhook forecast |
| `src/app/api/webhook/chat/route.ts` | Proxy webhook chat |

### Fichiers modifies
| Fichier | Modification |
|---------|-------------|
| `next.config.ts` | Ajout de 6 headers de securite + CSP |
| `src/app/auth/callback/route.ts` | Protection contre l'open redirect |
| `src/app/dashboard/results/actions.ts` | Verification d'ownership avant telechargement |
| `src/app/layout.tsx` | Integration CookieBanner |
| `src/components/shared/footer.tsx` | Lien politique de confidentialite |
| `src/components/shared/index.ts` | Export CookieBanner |
| `src/app/login/page.tsx` | Checkbox consentement inscription + minLength 8 |
| `src/app/dashboard/settings/page.tsx` | Section export + modale suppression |
| `src/hooks/useFileUpload.ts` | Appel via proxy `/api/webhook/forecast` |
| `src/components/dashboard/ai-chat/AiChatDrawer.tsx` | Appel via proxy `/api/webhook/chat` |
| `src/app/test-upload/page.tsx` | Mise a jour reference env var |
| `.env.local` | Variables server-only (N8N, HMAC secret, service role key) |

---

## 9. Migrations Supabase appliquees

Appliquees sur le projet `kshtmftvjhsdlxpsvgyr` (production) :

| # | Nom | Description |
|---|-----|-------------|
| 1 | `remove_dangerous_temp_testing_policies` | Suppression de 4 politiques de test |
| 2 | `fix_security_definer_views_and_service_role_policies` | Vues SECURITY INVOKER + politiques service_role + dedup plans |
| 3 | `optimize_rls_policies_initplan` | ~35 politiques avec `(select auth.uid())` + role `authenticated` |
| 4 | `fix_function_search_path` | 14 fonctions avec `SET search_path = ''` |
| 5 | `create_delete_user_data_function` | Fonction RPC `delete_user_data` pour suppression RGPD |
| 6 | `drop_unused_indexes` | Suppression de 8 index inutilises (detectes par le linter Supabase) |
| 7 | `add_foreign_key_indexes` | Recreation de 3 index simples couvrant les foreign keys exposees |

---

## 10. Configuration serveur (VPS)

### Docker Compose (N8N)

Variable ajoutee au service `n8n` :
```yaml
environment:
  - NODE_FUNCTION_ALLOW_BUILTIN=crypto
```

Permet au noeud Code de N8N d'utiliser `require('crypto')` pour la validation HMAC.

### Workflows N8N

2 workflows modifies avec un noeud Code de validation HMAC :
- `forecast-trigger` (declenchement de forecast)
- Chat webhook (`1b5a2430-a187-44e6-9435-1ee49838935b`)

---

## 11. Actions restantes

| Action | Priorite | Condition | Statut |
|--------|----------|-----------|--------|
| Activer "Prevent use of leaked passwords" | Moyenne | Passage au plan Pro Supabase | En attente |
| Completer les informations legales dans `/mentions-legales` | Haute | Adresse, RCS, SIRET, directeur de publication | En attente |
| Configurer `SUPABASE_SERVICE_ROLE_KEY` en production (Vercel) | Haute | Deploiement Vercel | En attente |
| ~~Generer le secret HMAC N8N~~ | ~~Haute~~ | ~~—~~ | **Fait** |
| ~~Mettre a jour le `minLength` du champ password~~ | ~~Basse~~ | ~~—~~ | **Fait** |
| ~~Corriger l'open redirect dans auth/callback~~ | ~~Haute~~ | ~~—~~ | **Fait** |
| ~~Ajouter la verification d'ownership dans results/actions~~ | ~~Haute~~ | ~~—~~ | **Fait** |
