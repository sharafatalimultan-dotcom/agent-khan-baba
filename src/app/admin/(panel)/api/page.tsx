import { createSupabaseServer } from "@/lib/supabase/server";
import { providerConfigured } from "@/lib/provider";

export const dynamic = "force-dynamic";

function Flag({ name, set, secret }: { name: string; set: boolean; secret?: boolean }) {
  return (
    <li className="flex items-center justify-between gap-3 border-b border-slate-100 py-2 last:border-0">
      <code className="text-sm">{name}</code>
      <span className={`text-sm font-semibold ${set ? "text-green-700" : "text-brand"}`}>
        {set ? (secret ? "Set (hidden)" : "Set") : "Not set"}
      </span>
    </li>
  );
}

export default async function Page() {
  const { data: logs } = await createSupabaseServer()
    .from("api_logs").select("*").order("created_at", { ascending: false }).limit(100);
  const env = (k: string) => Boolean(process.env[k]);

  return (
    <>
      <h1 className="mb-4 text-2xl">API health and logs</h1>

      <section className="card mb-6">
        <h2 className="text-lg">Authorized verification provider</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Status: <strong>{providerConfigured() ? "Configured" : "Not configured: the site shows official guidance only."}</strong>
        </p>
        <p className="mt-1 text-sm text-ink-soft">
          Credentials live in server environment variables (Vercel project settings). They cannot be viewed or edited here, by design.
        </p>
        <ul className="mt-3">
          <Flag name="VERIFICATION_API_URL" set={env("VERIFICATION_API_URL")} />
          <Flag name="VERIFICATION_API_KEY" set={env("VERIFICATION_API_KEY")} secret />
          <Flag name="VERIFICATION_ALLOWED_FIELDS" set={env("VERIFICATION_ALLOWED_FIELDS")} />
          <Flag name="SUPABASE_SERVICE_ROLE_KEY" set={env("SUPABASE_SERVICE_ROLE_KEY")} secret />
          <Flag name="LOG_HASH_SECRET" set={env("LOG_HASH_SECRET")} secret />
        </ul>
      </section>

      <section className="card">
        <h2 className="mb-3 text-lg">Recent events (latest 100)</h2>
        {!logs?.length ? (
          <p className="text-sm text-ink-soft">No events yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b text-ink-soft"><th className="py-2 pr-3">Time</th><th className="pr-3">Level</th><th className="pr-3">Kind</th><th className="pr-3">Message</th><th>HTTP</th></tr></thead>
              <tbody>
                {logs.map((l) => (
                  <tr key={l.id} className="border-b border-slate-100 align-top">
                    <td className="whitespace-nowrap py-2 pr-3">{new Date(l.created_at).toLocaleString()}</td>
                    <td className={`pr-3 font-semibold ${l.level === "error" ? "text-brand" : ""}`}>{l.level}</td>
                    <td className="pr-3">{l.kind}</td>
                    <td className="pr-3">{l.message}</td>
                    <td>{l.http_status ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="mt-3 text-xs text-ink-soft">Logs contain no readable numbers. Subject identifiers are one-way hashes and are not displayed.</p>
      </section>
    </>
  );
}
