"use client";
import Link from "next/link";
import { useId, useState } from "react";
import { normalizeCnic, normalizeMobile } from "@/lib/validation";

type Tab = "mobile" | "cnic";
type Result =
  | { mode: "guidance" }
  | { mode: "provider"; fields: Record<string, string>; notFound?: boolean }
  | null;

type OfficialLink = { label: string; url: string };

const FIELD_LABELS: Record<string, string> = { network: "Network", status: "Status", registered_sims: "Registered SIMs" };

export default function VerifyTool({ links }: { links: OfficialLink[] }) {
  const [tab, setTab] = useState<Tab>("mobile");
  const [value, setValue] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [needsConsent, setNeedsConsent] = useState(false);
  const uid = useId();

  function switchTab(next: Tab) {
    setTab(next);
    setValue("");
    setError(null);
    setResult(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);
    const v = tab === "mobile" ? normalizeMobile(value) : normalizeCnic(value);
    if (!v.ok) {
      setError(v.message);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: tab, value, consent }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        if (json.fallback) setResult({ mode: "guidance" });
        return;
      }
      if (json.mode === "provider") {
        setResult({ mode: "provider", fields: json.fields ?? {}, notFound: json.notFound });
      } else {
        setResult({ mode: "guidance" });
      }
      setNeedsConsent(Boolean(json.providerConfigured));
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const tabBtn = (t: Tab, label: string) => (
    <button
      type="button"
      role="tab"
      id={`${uid}-${t}-tab`}
      aria-selected={tab === t}
      aria-controls={`${uid}-panel`}
      onClick={() => switchTab(t)}
      className={`flex-1 whitespace-nowrap rounded-xl px-2 py-3 text-[13px] font-bold transition min-[380px]:text-sm sm:px-3 sm:text-base ${
        tab === t ? "bg-brand text-white shadow-card" : "bg-white text-ink hover:bg-brand-soft"
      }`}
    >
      {label}
    </button>
  );

  return (
    <section aria-labelledby={`${uid}-title`} className="panel">
      <h2 id={`${uid}-title`} className="text-center">Free SIM Verification Tool</h2>
      <p className="mx-auto mt-1 max-w-md text-center text-sm text-ink-soft">
        Verify SIM information using official and authorized methods in Pakistan.
      </p>

      <div role="tablist" aria-label="Verification type" className="mt-4 flex gap-2 rounded-2xl bg-white/70 p-1.5">
        {tabBtn("mobile", "📱 Mobile Number")}
        {tabBtn("cnic", "🪪 CNIC Number")}
      </div>

      <form id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-${tab}-tab`} onSubmit={onSubmit} noValidate className="mt-4 space-y-3">
        <div>
          <label htmlFor={`${uid}-input`} className="label">
            {tab === "mobile" ? "Mobile number" : "CNIC number (13 digits)"}
          </label>
          <input
            id={`${uid}-input`}
            className="input"
            inputMode="numeric"
            autoComplete="off"
            maxLength={tab === "mobile" ? 16 : 15}
            placeholder={tab === "mobile" ? "03XXXXXXXXX or +923XXXXXXXXX" : "XXXXX-XXXXXXX-X"}
            value={value}
            onChange={(e) => { setValue(e.target.value); if (error) setError(null); }}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${uid}-err` : undefined}
          />
        </div>

        {needsConsent && (
          <label className="flex items-start gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-4 w-4 accent-red-600" />
            <span>This is my own {tab === "mobile" ? "number" : "CNIC"}, or I have the owner's permission to check it.</span>
          </label>
        )}

        {error && (
          <p id={`${uid}-err`} role="alert" className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading} className="btn-primary !w-full !py-3.5 text-base">
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
              Checking…
            </>
          ) : tab === "mobile" ? "Verify SIM Information" : "Check Registered SIMs"}
        </button>
      </form>

      <div aria-live="polite" className="mt-4">
        {result?.mode === "provider" && (
          <div className="card">
            {result.notFound || !Object.keys(result.fields).length ? (
              <p className="text-sm text-ink-soft">The authorized provider returned no information for this entry.</p>
            ) : (
              <dl className="grid gap-2 text-sm">
                {Object.entries(result.fields).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-slate-100 pb-2 last:border-0">
                    <dt className="font-semibold">{FIELD_LABELS[k] ?? k}</dt>
                    <dd className="text-ink-soft">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
            <p className="mt-3 text-xs text-ink-soft">Shown only to the extent permitted by the authorized provider.</p>
          </div>
        )}

        {result?.mode === "guidance" && <OfficialSteps tab={tab} links={links} />}
      </div>
    </section>
  );
}

function OfficialSteps({ tab, links }: { tab: Tab; links: OfficialLink[] }) {
  return (
    <div className="card">
      <h3 className="text-base">Your number looks valid. Here is how to verify it officially</h3>
      <p className="mt-1 text-sm text-ink-soft">
        Live owner lookup is not enabled on this site. We never show invented or unverified records, and private details of other people are not available here.
      </p>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
        {tab === "mobile" ? (
          <>
            <li>Contact your mobile network from that SIM, using its official app or helpline, to confirm the registration details of your own number.</li>
            <li>Check the services currently published by the PTA for SIM checks and complaints.</li>
            <li>If the SIM is not yours or you do not recognise it, report it through the official process.</li>
          </>
        ) : (
          <>
            <li>Use the PTA-authorized method for checking SIMs registered against your own CNIC. Confirm the current method on the PTA website because services change.</li>
            <li>Compare the list with the SIMs you actually use.</li>
            <li>Report any SIM you do not recognise and ask your network to block it.</li>
          </>
        )}
      </ol>
      <ul className="mt-3 flex flex-wrap gap-2">
        {links.slice(0, 3).map((l) => (
          <li key={l.url}>
            <a className="btn-secondary !py-2 text-sm" href={l.url} target="_blank" rel="noopener noreferrer">{l.label} ↗</a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm">
        More detail: <Link className="font-semibold text-brand underline" href="/sim-verification-guide">SIM Verification Guide</Link> ·{" "}
        <Link className="font-semibold text-brand underline" href="/block-report-sim">Block or Report a SIM</Link>
      </p>
    </div>
  );
}
