import { createSupabaseServer } from "@/lib/supabase/server";
import { providerConfigured } from "@/lib/provider";

function Stat({ label, value, tone }: { label: string; value: number | string; tone?: "bad" }) {
  return (
    <div className="card !p-4">
      <p className="text-sm text-ink-soft">{label}</p>
      <p className={`mt-1 text-3xl font-extrabold ${tone === "bad" && Number(value) > 0 ? "text-brand" : ""}`}>{value}</p>
    </div>
  );
}

export default async function Page() {
  const db = createSupabaseServer();
  const since = new Date(Date.now() - 7 * 86400_000).toISOString();

  const count = (q: PromiseLike<{ count: number | null }>) => q.then((r) => r.count ?? 0);
  const [msgs, unread, faqs, lines, verifies, errors, limited] = await Promise.all([
    count(db.from("contact_messages").select("*", { count: "exact", head: true })),
    count(db.from("contact_messages").select("*", { count: "exact", head: true }).eq("is_read", false)),
    count(db.from("faqs").select("*", { count: "exact", head: true })),
    count(db.from("helplines").select("*", { count: "exact", head: true })),
    count(db.from("api_logs").select("*", { count: "exact", head: true }).eq("kind", "verify").gte("created_at", since)),
    count(db.from("api_logs").select("*", { count: "exact", head: true }).eq("level", "error").gte("created_at", since)),
    count(db.from("api_logs").select("*", { count: "exact", head: true }).eq("kind", "rate_limited").gte("created_at", since)),
  ]);

  return (
    <>
      <h1 className="mb-4 text-2xl">Dashboard</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Messages (total)" value={msgs} />
        <Stat label="Unread messages" value={unread} />
        <Stat label="FAQs in database" value={faqs} />
        <Stat label="Helplines in database" value={lines} />
        <Stat label="Provider lookups (7 days)" value={verifies} />
        <Stat label="Errors (7 days)" value={errors} tone="bad" />
        <Stat label="Rate-limited (7 days)" value={limited} />
        <Stat label="Provider configured" value={providerConfigured() ? "Yes" : "No"} />
      </div>
      <p className="mt-6 text-sm text-ink-soft">
        Without a configured provider the tool shows official guidance only, so lookups stay at zero. Counts never include personal data.
      </p>
    </>
  );
}
