
"use client";

import { useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import Logo from "@/components/Logo";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetMode, setResetMode] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");

    if (!email) {
      return setError("Please enter your email address.");
    }

    if (!resetMode && !password) {
      return setError("Please enter your password.");
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      if (resetMode) {
        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo:
              `${window.location.origin}/admin/login?reset=success`,
          });

        if (resetError) {
          setError(resetError.message);
        } else {
          setMessage(
            "Password recovery email sent. Check your inbox and spam folder."
          );
        }

        setLoading(false);
        return;
      }

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError("Sign-in failed. Check your email and password.");
        setLoading(false);
        return;
      }

      window.location.assign("/admin");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="mb-6 flex justify-center">
        <Logo size={48} uid="adm" />
      </div>

      <h1 className="text-center text-2xl">
        {resetMode ? "Reset Admin Password" : "Admin sign in"}
      </h1>

      {!configured ? (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-brand-soft p-4 text-sm text-brand-dark"
        >
          Supabase is not configured. Set
          NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY, then reload.
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="card mt-6 space-y-4"
          noValidate
        >
          <div>
            <label className="label" htmlFor="a-email">
              Email
            </label>
            <input
              id="a-email"
              name="email"
              type="email"
              autoComplete="username"
              className="input"
              required
            />
          </div>

          {!resetMode && (
            <div>
              <label className="label" htmlFor="a-pass">
                Password
              </label>
              <input
                id="a-pass"
                name="password"
                type="password"
                autoComplete="current-password"
                className="input"
                required
              />
            </div>
          )}

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark"
            >
              {error}
            </p>
          )}

          {message && (
            <p
              role="status"
              className="rounded-xl bg-brand-soft px-3 py-2 text-sm font-medium text-brand-dark"
            >
              {message}
            </p>
          )}

          <button className="btn-primary w-full" disabled={loading}>
            {loading
              ? "Please wait..."
              : resetMode
                ? "Send Password Recovery"
                : "Sign in"}
          </button>

          <button
            type="button"
            className="w-full text-sm underline"
            onClick={() => {
              setResetMode(!resetMode);
              setError(null);
              setMessage(null);
            }}
          >
            {resetMode
              ? "Back to Admin Login"
              : "Forgot Password?"}
          </button>
        </form>
      )}
    </div>
  );
}
