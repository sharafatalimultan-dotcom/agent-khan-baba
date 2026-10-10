"use client";
import { useState } from "react";
import { emailRegex } from "@/lib/validation";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const body = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      subject: String(form.get("subject") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      website: String(form.get("website") ?? ""),
    };
    if (body.name.length < 2) return setError("Please enter your name.");
    if (!emailRegex.test(body.email)) return setError("Please enter a valid email address.");
    if (body.subject.length < 3) return setError("Please enter a subject.");
    if (body.message.length < 10) return setError("Your message should be at least 10 characters.");

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Could not send your message.");
        setStatus("idle");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Network error. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return <div role="status" className="panel font-semibold">Thank you. Your message has been sent. We will reply by email if needed.</div>;
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4">
      <div><label className="label" htmlFor="c-name">Name</label><input id="c-name" name="name" className="input" maxLength={80} autoComplete="name" /></div>
      <div><label className="label" htmlFor="c-email">Email</label><input id="c-email" name="email" type="email" className="input" maxLength={120} autoComplete="email" /></div>
      <div><label className="label" htmlFor="c-subject">Subject</label><input id="c-subject" name="subject" className="input" maxLength={120} /></div>
      <div><label className="label" htmlFor="c-message">Message</label><textarea id="c-message" name="message" rows={5} className="input" maxLength={2000} /></div>
      <div className="hidden" aria-hidden><label>Leave empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p className="text-xs text-ink-soft">Please do not include your CNIC, OTPs or passwords in your message.</p>
      {error && <p role="alert" className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark">{error}</p>}
      <button className="btn-primary" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"}</button>
    </form>
  );
}
