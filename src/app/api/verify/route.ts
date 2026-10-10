import { NextResponse } from "next/server";
import { z } from "zod";
import { normalizeCnic, normalizeMobile } from "@/lib/validation";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { lookup, providerConfigured } from "@/lib/provider";
import { hashIdentifier, logEvent } from "@/lib/log";

export const dynamic = "force-dynamic";

const Body = z.object({
  type: z.enum(["mobile", "cnic"]),
  value: z.string().max(40),
  consent: z.boolean().optional(),
});

export async function POST(req: Request) {
  const ip = clientIp(req);
  const rl = rateLimit(`verify:${ip}`, 8, 60_000);
  if (!rl.allowed) {
    await logEvent({ kind: "rate_limited", level: "warn", message: "verify rate limit", subjectHash: hashIdentifier(ip) });
    return NextResponse.json(
      { ok: false, error: `Too many requests. Please try again in ${rl.retryAfter} seconds.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let parsed;
  try {
    parsed = Body.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });

  const { type, value, consent } = parsed.data;
  const v = type === "mobile" ? normalizeMobile(value) : normalizeCnic(value);
  if (!v.ok) return NextResponse.json({ ok: false, error: v.message }, { status: 422 });

  // No provider configured: official guidance only. Nothing is stored or invented.
  if (!providerConfigured()) {
    return NextResponse.json({ ok: true, mode: "guidance", providerConfigured: false });
  }

  if (!consent) {
    return NextResponse.json(
      { ok: false, error: "Please confirm that this is your own number/CNIC or that you have the owner's permission." },
      { status: 422 },
    );
  }

  const result = await lookup(type, v.value);
  const subjectHash = hashIdentifier(v.value);

  if (result.status === "ok") {
    await logEvent({ kind: "verify", message: `${type} lookup ok`, subjectHash });
    return NextResponse.json({ ok: true, mode: "provider", providerConfigured: true, fields: result.fields });
  }
  if (result.status === "not_found") {
    await logEvent({ kind: "verify", message: `${type} lookup no result`, subjectHash });
    return NextResponse.json({ ok: true, mode: "provider", providerConfigured: true, fields: {}, notFound: true });
  }
  if (result.status === "error") {
    await logEvent({ kind: "provider_error", level: "error", message: result.message, subjectHash, httpStatus: result.httpStatus });
    return NextResponse.json(
      { ok: false, error: "The verification service is temporarily unavailable. Please use the official steps below.", fallback: true },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true, mode: "guidance", providerConfigured: false });
}
