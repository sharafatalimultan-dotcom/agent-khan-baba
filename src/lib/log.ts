import { createHmac } from "crypto";
import { createSupabaseService } from "./supabase/server";

/** One-way keyed hash so logs never contain readable numbers. */
export function hashIdentifier(value: string): string {
  const secret = process.env.LOG_HASH_SECRET || "dev-only-secret";
  return createHmac("sha256", secret).update(value).digest("hex").slice(0, 16);
}

export async function logEvent(entry: {
  kind: "verify" | "contact" | "provider_error" | "rate_limited" | "admin";
  level?: "info" | "warn" | "error";
  message: string;
  subjectHash?: string;
  httpStatus?: number;
}) {
  const db = createSupabaseService();
  if (!db) return;
  try {
    await db.from("api_logs").insert({
      kind: entry.kind,
      level: entry.level ?? "info",
      message: entry.message.slice(0, 300),
      subject_hash: entry.subjectHash ?? null,
      http_status: entry.httpStatus ?? null,
    });
  } catch {
    // logging must never break a request
  }
}
