"use client";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "url" | "select";
  options?: string[];
  required?: boolean;
};

type Row = Record<string, unknown> & { id: string };

// Generic admin editor. Writes go through the browser client, so Row Level Security
// (is_admin()) is what authorizes them, not this UI.
export default function CrudTable({
  table,
  fields,
  initialRows,
  titleField,
  defaults,
}: {
  table: string;
  fields: Field[];
  initialRows: Row[];
  titleField: string;
  defaults: Record<string, unknown>;
}) {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function startEdit(row: Row | null) {
    setError(null);
    setEditing(row ? row.id : "new");
    setDraft(row ? { ...row } : { ...defaults });
  }

  async function save() {
    setError(null);
    for (const f of fields) {
      const v = draft[f.name];
      if (f.required && (v === undefined || v === null || String(v).trim() === "")) return setError(`${f.label} is required.`);
      if (f.type === "url" && v && !/^https:\/\//i.test(String(v))) return setError(`${f.label} must start with https://`);
    }
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = draft[f.name];
      payload[f.name] = f.type === "number" ? Number(v ?? 0) : f.type === "checkbox" ? Boolean(v) : v === "" ? null : v;
    }
    payload.updated_at = new Date().toISOString();
    setBusy(true);
    const supabase = createSupabaseBrowser();
    if (editing === "new") {
      const { data, error: err } = await supabase.from(table).insert(payload).select().single();
      if (err) setError(err.message);
      else { setRows((r) => [...r, data as Row]); setEditing(null); }
    } else {
      const { data, error: err } = await supabase.from(table).update(payload).eq("id", editing!).select().single();
      if (err) setError(err.message);
      else { setRows((r) => r.map((x) => (x.id === editing ? (data as Row) : x))); setEditing(null); }
    }
    setBusy(false);
  }

  async function remove(row: Row) {
    if (!window.confirm(`Delete "${String(row[titleField])}"? This cannot be undone.`)) return;
    setBusy(true);
    const { error: err } = await createSupabaseBrowser().from(table).delete().eq("id", row.id);
    if (err) setError(err.message);
    else setRows((r) => r.filter((x) => x.id !== row.id));
    setBusy(false);
  }

  return (
    <div className="space-y-4">
      <button type="button" className="btn-primary !w-auto" onClick={() => startEdit(null)}>+ Add new</button>

      {error && <p role="alert" className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark">{error}</p>}

      {editing && (
        <form className="card space-y-3" onSubmit={(e) => { e.preventDefault(); void save(); }}>
          <h2 className="text-lg">{editing === "new" ? "Add new" : "Edit"}</h2>
          {fields.map((f) => (
            <div key={f.name}>
              {f.type === "checkbox" ? (
                <label className="flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={Boolean(draft[f.name])} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.checked })} className="h-4 w-4 accent-red-600" />
                  {f.label}
                </label>
              ) : (
                <>
                  <label className="label" htmlFor={`f-${f.name}`}>{f.label}{f.required && " *"}</label>
                  {f.type === "textarea" ? (
                    <textarea id={`f-${f.name}`} rows={4} className="input" value={String(draft[f.name] ?? "")} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} />
                  ) : f.type === "select" ? (
                    <select id={`f-${f.name}`} className="input" value={String(draft[f.name] ?? "")} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })}>
                      {f.options?.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input id={`f-${f.name}`} className="input" type={f.type === "number" ? "number" : "text"} value={String(draft[f.name] ?? "")} onChange={(e) => setDraft({ ...draft, [f.name]: e.target.value })} />
                  )}
                </>
              )}
            </div>
          ))}
          <div className="flex gap-2">
            <button className="btn-primary !w-auto" disabled={busy}>{busy ? "Saving…" : "Save"}</button>
            <button type="button" className="btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-ink-soft">Nothing here yet. The public site shows built-in defaults until you add your own entries.</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="card flex items-start justify-between gap-3 !p-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">{String(r[titleField])}</p>
                {r.published === false && <span className="text-xs font-semibold text-brand">Hidden</span>}
              </div>
              <div className="flex shrink-0 gap-2">
                <button type="button" className="btn-secondary !px-3 !py-1.5 text-sm" onClick={() => startEdit(r)}>Edit</button>
                <button type="button" className="btn-secondary !px-3 !py-1.5 text-sm text-brand" onClick={() => void remove(r)} disabled={busy}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
