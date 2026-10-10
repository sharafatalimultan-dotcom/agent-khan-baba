"use client";
import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!email || !password) return setError("Enter your email and password.");
    setLoading(true);
    const supabase = createSupabaseBrowser();
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setLoading(false);
      return setError("Sign-in failed. Check your details.");
    }
    // Middleware verifies admin_users membership; non-admins are bounced back here.
    window.location.assign("/admin");
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="mb-6 flex justify-center"><Logo size={48} uid="adm" /></div>
      <h1 className="text-center text-2xl">Admin sign in</h1>
      {!configured ? (
        <p role="alert" className="mt-6 rounded-xl bg-brand-soft p-4 text-sm text-brand-dark">
          Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY, then reload.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="card mt-6 space-y-4" noValidate>
          <div><label className="label" htmlFor="a-email">Email</label><input id="a-email" name="email" type="email" autoComplete="username" className="input" /></div>
          <div><label className="label" htmlFor="a-pass">Password</label><input id="a-pass" name="password" type="password" autoComplete="current-password" className="input" /></div>
          {error && <p role="alert" className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark">{error}</p>}
          <button className="btn-primary" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
        </form>
      )}
    </div>
  );
}
