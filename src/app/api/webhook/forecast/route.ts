import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signWebhookPayload } from "@/lib/webhook-signature";

/**
 * POST /api/webhook/forecast
 *
 * Proxy authentifié pour le webhook N8N de déclenchement de forecast.
 * - Vérifie la session Supabase (l'utilisateur doit être connecté)
 * - Utilise le user_id de la session (pas du client → anti-spoofing)
 * - Signe la requête avec HMAC-SHA256 pour que N8N puisse vérifier l'origine
 * - Cache l'URL N8N du client
 */
export async function POST(request: Request) {
  try {
    // 1. Authentifier l'utilisateur via la session Supabase
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. Lire et valider le payload du client
    const body = await request.json();
    const { job_id, plan, input_path, filename, config_override } = body;

    if (!job_id || !input_path || !filename) {
      return NextResponse.json(
        { error: "Paramètres manquants : job_id, input_path, filename" },
        { status: 400 }
      );
    }

    // 3. Vérifier que le job appartient bien à l'utilisateur
    const { data: job } = await supabase
      .schema("lumeniq")
      .from("forecast_jobs")
      .select("id")
      .eq("id", job_id)
      .eq("user_id", user.id)
      .single();

    if (!job) {
      return NextResponse.json(
        { error: "Job non trouvé ou non autorisé" },
        { status: 403 }
      );
    }

    // 4. Construire le payload sécurisé (user_id vient de la session)
    const webhookPayload = {
      job_id,
      user_id: user.id,
      plan: plan || "standard",
      input_path,
      filename,
      ...(config_override && { config_override }),
    };

    // 5. Envoyer au webhook N8N avec signature HMAC
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      return NextResponse.json(
        { error: "Webhook non configuré" },
        { status: 503 }
      );
    }

    const payloadString = JSON.stringify(webhookPayload);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Signer si le secret est configuré (graceful degradation)
    if (process.env.N8N_WEBHOOK_SECRET) {
      const { signature } = signWebhookPayload(payloadString);
      headers["X-Webhook-Signature"] = signature;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: payloadString,
    });

    if (!response.ok) {
      console.error(
        `N8N webhook error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Erreur du service de forecast" },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook proxy error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
