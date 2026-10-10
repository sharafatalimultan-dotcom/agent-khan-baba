import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient as createAdminJs } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export function supabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

/** Session-aware client (anon key + user's cookies). Subject to RLS. */
export function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
          try {
            list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
          } catch {
            // Called from a Server Component; middleware refreshes the session instead.
          }
        },
      },
    },
  );
}

/** Service-role client. SERVER ONLY. Bypasses RLS: use for logging and nothing user-controlled. */
export function createSupabaseService() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !key) return null;
  return createAdminJs(process.env.NEXT_PUBLIC_SUPABASE_URL, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Returns the admin user, or null. Authorization is checked against the admin_users table. */
export async function getAdminUser() {
  if (!supabaseConfigured()) return null;
  const supabase = createSupabaseServer();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  const { data: row } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  return row ? data.user : null;
}
