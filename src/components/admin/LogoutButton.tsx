"use client";
import { createSupabaseBrowser } from "@/lib/supabase/browser";

export default function LogoutButton() {
  async function logout() {
    await createSupabaseBrowser().auth.signOut();
    window.location.assign("/admin/login");
  }
  return <button type="button" onClick={logout} className="btn-secondary !py-2 text-sm">Log out</button>;
}
