import { createHmac } from "crypto";
import { serverEnv } from "@/lib/env";

/**
 * Signe un payload pour les webhooks N8N avec HMAC-SHA256.
 *
 * Format de signature : t=<timestamp>,v1=<hmac_hex>
 * Le message signé est : "<timestamp>.<body>"
 *
 * Côté N8N, vérifier avec :
 *   const [tPart, v1Part] = signature.split(",");
 *   const ts = tPart.split("=")[1];
 *   const expected = HMAC_SHA256(ts + "." + rawBody, secret);
 *   if (expected !== v1Part.split("=")[1]) reject;
 *   if (abs(now - ts) > 300) reject; // replay > 5 min
 */
export function signWebhookPayload(body: string): {
  signature: string;
  timestamp: number;
} {
  const secret = serverEnv.n8nWebhookSecret;
  if (!secret) {
    throw new Error("N8N_WEBHOOK_SECRET is not configured");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const message = `${timestamp}.${body}`;
  const hmac = createHmac("sha256", secret).update(message).digest("hex");

  return {
    signature: `t=${timestamp},v1=${hmac}`,
    timestamp,
  };
}
