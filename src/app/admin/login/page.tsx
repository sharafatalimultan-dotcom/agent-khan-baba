
"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowser } from "@/lib/supabase/browser";
import Logo from "@/components/Logo";

type Mode = "login" | "forgot" | "update";

const SITE_URL = "https://agent-khan-baba.vercel.app";

export default function AdminLogin() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Recovery link open hone par password update screen dikhayein.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (
      params.get("reset") === "success" ||
      params.get("type") === "recovery"
    ) {
      setMode("update");
      setMessage("Please enter your new password.");
    }
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirmPassword = String(
      form.get("confirmPassword") ?? ""
    );

    if (!email && mode !== "update") {
      setError("Please enter your email address.");
      return;
    }

    if (mode === "login" && !password) {
      setError("Please enter your password.");
      return;
    }

    if (mode === "update") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);

    try {
      const supabase = createSupabaseBrowser();

      // Send password recovery email.
      if (mode === "forgot") {
        const { error: resetError } =
          await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${SITE_URL}/admin/login?reset=success`,
          });

        if (resetError) {
          setError(resetError.message);
        } else {
          setMessage(
            "Recovery email sent. Please check your inbox and spam folder."
          );
        }

        setLoading(false);
        return;
      }

      // Save the new password after recovery link verification.
      if (mode === "update") {
        const { error: updateError } =
          await supabase.auth.updateUser({
            password,
          });

        if (updateError) {
          setError(updateError.message);
          setLoading(false);
          return;
        }

        await supabase.auth.signOut();

        window.history.replaceState(
          {},
          "",
          "/admin/login"
        );

        setMode("login");
        setMessage(
          "Password updated successfully. Please sign in with your new password."
        );

        setLoading(false);
        return;
      }

      // Normal Admin Login.
      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      window.location.assign("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-4 py-16">
      <div className="mb-6 flex justify-center">
        <Logo size={48} uid="adm" />
      </div>

      <h1 className="text-center text-2xl">
        {mode === "login"
          ? "Admin sign in"
          : mode === "forgot"
          ? "Forgot Password"
          : "Set New Password"}
      </h1>

      {!configured ? (
        <p
          role="alert"
          className="mt-6 rounded-xl bg-brand-soft p-4 text-sm text-brand-dark"
        >
          Supabase is not configured. Please check your
          NEXT_PUBLIC_SUPABASE_URL and
          NEXT_PUBLIC_SUPABASE_ANON_KEY settings.
        </p>
      ) : (
        <form
          onSubmit={onSubmit}
          className="card mt-6 space-y-4"
          noValidate
        >
          {mode !== "update" && (
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
          )}

          {mode !== "forgot" && (
            <div>
              <label className="label" htmlFor="a-pass">
                {mode === "update"
                  ? "New Password"
                  : "Password"}
              </label>
              <input
                id="a-pass"
                name="password"
                type="password"
                autoComplete={
                  mode === "update"
                    ? "new-password"
                    : "current-password"
                }
                className="input"
                required
              />
            </div>
          )}

          {mode === "update" && (
            <div>
              <label
                className="label"
                htmlFor="a-confirm-pass"
              >
                Confirm New Password
              </label>
              <input
                id="a-confirm-pass"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
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

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : mode === "login"
              ? "Sign in"
              : mode === "forgot"
              ? "Send Password Recovery"
              : "Update Password"}
          </button>

          {mode !== "update" && (
            <button
              type="button"
              className="w-full text-sm underline"
              onClick={() => {
                setMode(
                  mode === "login" ? "forgot" : "login"
                );
                setError(null);
                setMessage(null);
              }}
            >
              {mode === "login"
                ? "Forgot Password?"
                : "Back to Admin Login"}
            </button>
          )}
        </form>
      )}
    </div>
  );
}
