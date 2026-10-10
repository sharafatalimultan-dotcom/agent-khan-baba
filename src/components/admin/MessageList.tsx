"use client";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

type Msg = { id: string; name: string; email: string; subject: string; message: string; is_read: boolean; created_at: string };

export default function MessageList({ initial }: { initial: Msg[] }) {
  const [msgs, setMsgs] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  async function toggle(m: Msg) {
    const { error: err } = await createSupabaseBrowser().from("contact_messages").update({ is_read: !m.is_read }).eq("id", m.id);
    if (err) return setError(err.message);
    setMsgs((l) => l.map((x) => (x.id === m.id ? { ...x, is_read: !m.is_read } : x)));
  }
  async function remove(m: Msg) {
    if (!window.confirm("Delete this message?")) return;
    const { error: err } = await createSupabaseBrowser().from("contact_messages").delete().eq("id", m.id);
    if (err) return setError(err.message);
    setMsgs((l) => l.filter((x) => x.id !== m.id));
  }

  if (!msgs.length) return <p className="text-sm text-ink-soft">No messages yet.</p>;
  return (
    <div className="space-y-3">
      {error && <p role="alert" className="rounded-xl bg-brand-soft px-3 py-2 text-sm text-brand-dark">{error}</p>}
      {msgs.map((m) => (
        <article key={m.id} className={`card ${m.is_read ? "" : "border-brand"}`}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h2 className="text-base">{m.subject}</h2>
              <p className="text-sm text-ink-soft">{m.name} · <a className="underline" href={`mailto:${m.email}`}>{m.email}</a> · {new Date(m.created_at).toLocaleString()}</p>
            </div>
            {!m.is_read && <span className="rounded-full bg-brand px-2 py-0.5 text-xs font-bold text-white">New</span>}
          </div>
          {/* Rendered as text by React, so message content cannot inject markup. */}
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6">{m.message}</p>
          <div className="mt-3 flex gap-2">
            <button className="btn-secondary !py-1.5 text-sm" onClick={() => void toggle(m)}>{m.is_read ? "Mark unread" : "Mark read"}</button>
            <button className="btn-secondary !py-1.5 text-sm text-brand" onClick={() => void remove(m)}>Delete</button>
          </div>
        </article>
      ))}
    </div>
  );
}
