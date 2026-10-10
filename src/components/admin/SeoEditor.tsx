"use client";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

type Entry = { path: string; title: string; description: string };

export default function SeoEditor({ entries, announcement }: { entries: Entry[]; announcement: string }) {
  const [list, setList] = useState(entries);
  const [banner, setBanner] = useState(announcement);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  async function saveSeo(e: Entry) {
    setMsg(null);
    if (e.title.length < 5 || e.title.length > 70) return setMsg({ ok: false, text: `${e.path}: title must be 5 to 70 characters.` });
    if (e.description.length < 20 || e.description.length > 180) return setMsg({ ok: false, text: `${e.path}: description must be 20 to 180 characters.` });
    setBusy(e.path);
    const { error } = await createSupabaseBrowser().from("seo_settings").upsert({ ...e, updated_at: new Date().toISOString() });
    setBusy(null);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: `Saved ${e.path}` });
  }

  async function saveBanner() {
    setMsg(null);
    setBusy("banner");
    const { error } = await createSupabaseBrowser().from("site_settings").upsert({ key: "announcement", value: banner.trim(), updated_at: new Date().toISOString() });
    setBusy(null);
    setMsg(error ? { ok: false, text: error.message } : { ok: true, text: "Announcement saved" });
  }

  return (
    <div className="space-y-6">
      {msg && <p role="status" className={`rounded-xl px-3 py-2 text-sm font-medium ${msg.ok ? "bg-green-50 text-green-800" : "bg-brand-soft text-brand-dark"}`}>{msg.text}</p>}

      <section className="card">
        <h2 className="text-lg">Site announcement</h2>
        <p className="text-sm text-ink-soft">Shown as a banner at the top of every page. Leave empty to hide it.</p>
        <input className="input mt-3" maxLength={300} value={banner} onChange={(e) => setBanner(e.target.value)} aria-label="Announcement text" />
        <button className="btn-primary mt-3 !w-auto" disabled={busy === "banner"} onClick={() => void saveBanner()}>Save announcement</button>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg">Page titles and descriptions</h2>
        {list.map((e, i) => (
          <div key={e.path} className="card space-y-2">
            <p className="font-mono text-sm font-bold">{e.path}</p>
            <label className="label" htmlFor={`t-${i}`}>Title ({e.title.length}/70)</label>
            <input id={`t-${i}`} className="input" value={e.title} onChange={(ev) => setList((l) => l.map((x, j) => (j === i ? { ...x, title: ev.target.value } : x)))} />
            <label className="label" htmlFor={`d-${i}`}>Meta description ({e.description.length}/180)</label>
            <textarea id={`d-${i}`} rows={2} className="input" value={e.description} onChange={(ev) => setList((l) => l.map((x, j) => (j === i ? { ...x, description: ev.target.value } : x)))} />
            <button className="btn-secondary" disabled={busy === e.path} onClick={() => void saveSeo(e)}>{busy === e.path ? "Saving…" : "Save"}</button>
          </div>
        ))}
      </section>
    </div>
  );
}
