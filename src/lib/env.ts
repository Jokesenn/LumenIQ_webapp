/**
 * Centralized environment variable validation and access module.
 *
 * This module enforces:
 * - Server-side env vars (no NEXT_PUBLIC_ prefix) are only accessible on the server
 * - Public env vars are validated at module load time
 * - Clear error messages for missing configuration
 *
 * Usage:
 *   import { serverEnv, publicEnv } from "@/lib/env";
 *
 *   // Server-side only (throws error if called on client):
 *   const url = serverEnv.n8nWebhookUrl;
 *
 *   // Public (safe on client and server):
 *   const supabaseUrl = publicEnv.supabaseUrl;
 */

/**
 * Server-side environment variables (no NEXT_PUBLIC_ prefix).
 * These are accessed via lazy getters to ensure they're only read at call time.
 * Accessing on the client will throw an error.
 */
function requireServerEnv(name: string): string {
  if (typeof window !== 'undefined') {
    throw new Error(`Server env var ${name} accessed on client`);
  }
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server env var: ${name}`);
  }
  return value;
}

/**
 * Optional server-side environment variables.
 * Returns the value if set, otherwise undefined.
 */
function optionalServerEnv(name: string): string | undefined {
  if (typeof window !== 'undefined') {
    throw new Error(`Server env var ${name} accessed on client`);
  }
  return process.env[name];
}

/**
 * Public environment variables (NEXT_PUBLIC_ prefix).
 * These are validated at module load time and can be used anywhere.
 *
 * IMPORTANT: Next.js only inlines NEXT_PUBLIC_* vars on the client when
 * accessed via static dot notation (process.env.NEXT_PUBLIC_FOO).
 * Dynamic access like process.env[name] returns undefined on the client.
 * That's why the value must be passed explicitly from a static reference.
 */
function requirePublicEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required public env var: ${name}`);
  }
  return value;
}

/**
 * Server-side environment variables (no NEXT_PUBLIC_ prefix).
 * Use these lazy getters to access server-only config.
 *
 * Example:
 *   const url = serverEnv.n8nWebhookUrl; // throws if on client or not set
 */
export const serverEnv = {
  /** N8N webhook URL for forecast job triggers (required in production) */
  get n8nWebhookUrl() {
    return requireServerEnv('N8N_WEBHOOK_URL');
  },

  /** N8N webhook URL for chat/AI requests (required in production) */
  get n8nChatWebhookUrl() {
    return requireServerEnv('N8N_CHAT_WEBHOOK_URL');
  },

  /** N8N webhook signing secret (optional in dev, required in production) */
  get n8nWebhookSecret(): string | undefined {
    const secret = optionalServerEnv('N8N_WEBHOOK_SECRET');
    if (!secret && process.env.NODE_ENV === 'production') {
      console.warn(
        '[env] N8N_WEBHOOK_SECRET not configured in production — webhook requests will be sent without HMAC signature'
      );
    }
    return secret;
  },

  /** Supabase service role key for admin operations (required for user deletion) */
  get supabaseServiceRoleKey() {
    return requireServerEnv('SUPABASE_SERVICE_ROLE_KEY');
  },
} as const;

/**
 * Public environment variables (NEXT_PUBLIC_ prefix).
 * These are safe to use on client and server.
 * They are pre-validated at module load time.
 *
 * Example:
 *   const url = publicEnv.supabaseUrl;
 */
export const publicEnv = {
  /** Supabase API URL (publicly visible) */
  supabaseUrl: requirePublicEnv('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),

  /** Supabase anon key (publicly visible, safe for client-side auth) */
  supabaseAnonKey: requirePublicEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
} as const;
