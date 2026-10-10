import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Guards every /admin route (except /admin/login) and /api/admin/* on the server.
// Admin status comes from the admin_users table, never from client-side flags.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApi = pathname.startsWith("/api/admin");
  const isLogin = pathname === "/admin/login";

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) {
    return isApi
      ? NextResponse.json({ error: "Backend not configured" }, { status: 503 })
      : isLogin
        ? NextResponse.next()
        : NextResponse.redirect(new URL("/admin/login", req.url));
  }

  let res = NextResponse.next({ request: req });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list: { name: string; value: string; options: CookieOptions }[]) => {
        list.forEach(({ name, value }) => req.cookies.set(name, value));
        res = NextResponse.next({ request: req });
        list.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();
  let isAdmin = false;
  if (data.user) {
    const { data: row } = await supabase
      .from("admin_users").select("user_id").eq("user_id", data.user.id).maybeSingle();
    isAdmin = Boolean(row);
  }

  if (isLogin) {
    return isAdmin ? NextResponse.redirect(new URL("/admin", req.url)) : res;
  }
  if (!isAdmin) {
    return isApi
      ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      : NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return res;
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
