import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signWebhookPayload } from "@/lib/webhook-signature";
import { serverEnv } from "@/lib/env";

/**
 * POST /api/webhook/chat
 *
 * Proxy authentifié pour le webhook N8N de chat IA.
 * - Vérifie la session Supabase
 * - Utilise le user_id de la session (anti-spoofing)
 * - Vérifie que le job appartient à l'utilisateur
 * - Signe la requête avec HMAC-SHA256
 */
export async function POST(request: Request) {
  try {
    // 1. Authentifier l'utilisateur
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // 2. Lire et valider le payload
    const body = await request.json();
    const { jobId, question, history } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Paramètre manquant : question" },
        { status: 400 }
      );
    }

    // 3. Vérifier que le job (si fourni) appartient bien à l'utilisateur
    if (jobId) {
      const { data: job } = await supabase
        .schema("lumeniq")
        .from("forecast_jobs")
        .select("id")
        .eq("id", jobId)
        .eq("user_id", user.id)
        .single();

      if (!job) {
        return NextResponse.json(
          { error: "Job non trouvé ou non autorisé" },
          { status: 403 }
        );
      }
    }

    // 4. Construire le payload sécurisé
    const webhookPayload = {
      jobId: jobId || null,
      userId: user.id,
      question,
      history: Array.isArray(history) ? history : [],
    };

    // 5. Envoyer au webhook N8N avec signature HMAC
    let webhookUrl: string;
    try {
      webhookUrl = serverEnv.n8nChatWebhookUrl;
    } catch (error) {
      return NextResponse.json(
        { error: "Chat webhook non configuré" },
        { status: 503 }
      );
    }

    const payloadString = JSON.stringify(webhookPayload);

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const webhookSecret = serverEnv.n8nWebhookSecret;
    if (webhookSecret) {
      const { signature } = signWebhookPayload(payloadString);
      headers["X-Webhook-Signature"] = signature;
    }

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers,
      body: payloadString,
      signal: AbortSignal.timeout(55000), // timeout avant le client (60s)
    });

    if (!response.ok) {
      console.error(
        `N8N chat webhook error: ${response.status} ${response.statusText}`
      );
      return NextResponse.json(
        { error: "Erreur du service IA" },
        { status: 502 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      return NextResponse.json(
        { error: "Le service IA met trop de temps à répondre" },
        { status: 504 }
      );
    }
    console.error("Chat webhook proxy error:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
