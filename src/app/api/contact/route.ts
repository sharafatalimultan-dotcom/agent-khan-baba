import { NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/lib/ratelimit";
import { createSupabaseService, supabaseConfigured } from "@/lib/supabase/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { emailRegex } from "@/lib/validation";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";

const Body = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(120).regex(emailRegex),
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

export async function POST(req: Request) {
  const rl = rateLimit(`contact:${clientIp(req)}`, 3, 10 * 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: `Too many messages. Please try again in ${Math.ceil(rl.retryAfter / 60)} minutes.` },
      { status: 429 },
    );
  }
  let parsed;
  try {
    parsed = Body.safeParse(await req.json());
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please check all fields and try again." }, { status: 422 });
  }
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { ok: false, error: `The contact form is not available right now. Please email ${SITE.email}.` },
      { status: 503 },
    );
  }
  const { name, email, subject, message } = parsed.data;
  const db = createSupabaseService() ?? createSupabaseServer();
  const { error } = await db.from("contact_messages").insert({ name, email, subject, message });
  if (error) {
    return NextResponse.json({ ok: false, error: "Could not send your message. Please try again later." }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
