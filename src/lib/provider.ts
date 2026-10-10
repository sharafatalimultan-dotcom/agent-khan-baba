// Adapter for a legally authorized verification provider.
// If VERIFICATION_API_URL / VERIFICATION_API_KEY are not set, nothing is called and
// the UI falls back to official instructions. No mock or invented data is ever returned.

export type ProviderKind = "mobile" | "cnic";
export type ProviderResult =
  | { status: "not_configured" }
  | { status: "ok"; fields: Record<string, string> }
  | { status: "not_found" }
  | { status: "error"; message: string; httpStatus?: number };

export function providerConfigured(): boolean {
  return Boolean(process.env.VERIFICATION_API_URL && process.env.VERIFICATION_API_KEY);
}

function allowedFields(): string[] {
  return (process.env.VERIFICATION_ALLOWED_FIELDS ?? "network,status")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Edit this function to match your provider's contract.
 * Contract assumed here: POST { type, value } with Bearer auth, JSON object response.
 * Only fields in VERIFICATION_ALLOWED_FIELDS are ever passed on to the browser.
 */
export async function lookup(kind: ProviderKind, value: string): Promise<ProviderResult> {
  if (!providerConfigured()) return { status: "not_configured" };
  try {
    const res = await fetch(process.env.VERIFICATION_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.VERIFICATION_API_KEY}`,
      },
      body: JSON.stringify({ type: kind, value }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (res.status === 404) return { status: "not_found" };
    if (!res.ok) return { status: "error", message: `Provider returned HTTP ${res.status}`, httpStatus: res.status };
    const json = (await res.json()) as Record<string, unknown>;
    const fields: Record<string, string> = {};
    for (const key of allowedFields()) {
      const v = json[key];
      if (typeof v === "string" || typeof v === "number") fields[key] = String(v).slice(0, 200);
    }
    return Object.keys(fields).length ? { status: "ok", fields } : { status: "not_found" };
  } catch (e) {
    return { status: "error", message: e instanceof Error ? e.message.slice(0, 200) : "Provider request failed" };
  }
}
